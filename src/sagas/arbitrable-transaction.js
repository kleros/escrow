import { all, call, put, takeLatest } from 'redux-saga/effects'
import { navigate } from '@reach/router'
import multipleArbitrableTransaction from '@kleros/kleros-interaction/build/contracts/MultipleArbitrableTransaction.json'
import Arbitrator from '@kleros/kleros-interaction/build/contracts/Arbitrator.json'
import ArbitrableAddressList from '@kleros/kleros-interaction/build/contracts/ArbitrableAddressList.json'
import ArbitrableTokenList from '@kleros/kleros-interaction/build/contracts/ArbitrableTokenList.json'

import {
  web3,
  archon,
  ERC20_ADDRESS,
  T2CR_ADDRESS,
  ARBITRABLE_ADDRESSES,
  ARBITRABLE_TOKEN_ADDRESSES,
} from '../bootstrap/dapp-api'
import * as arbitrabletxActions from '../actions/arbitrable-transaction'
import ERC20 from '../assets/abi/erc20.json'
import multipleArbitrableTokenTransaction from '../assets/abi/multipleArbitrableTokenTransaction.json'
import * as errorConstants from '../constants/error'
import * as disputeConstants from '../constants/dispute'
import * as warningConstants from '../constants/warnings'
import ETH from '../constants/eth'
import { action } from '../utils/action'
import { lessduxSaga } from '../utils/saga'
import readFile from '../utils/read-file'
import createMetaEvidence from '../utils/generate-meta-evidence'
import getStatusArbitrable from '../utils/get-status-arbitrable'
import validateMetaEvidence from '../utils/validate-meta-evidence'
import { getAbiForArbitrableAddress } from '../utils/get-abi-for-arbitrable-address'

import getMetaEvidence from './api/get-meta-evidence'
import ipfsPublish from './api/ipfs-publish'

/**
 * ArbitrableTx form.
 * @param {object} { payload: arbitrabletxReceived } - The arbitrable transaction to create.
 */
function* formArbitrabletx({ type, payload: { arbitrabletxForm } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let metaEvidence = null
  let arbitrableAddress = arbitrabletxForm.arbitrableContractAddress.eth

  if (arbitrabletxForm.token.address) {
    arbitrableAddress = arbitrabletxForm.arbitrableContractAddress.token

    if (!arbitrabletxForm.token.decimals) {
      try {
        // Tokens are from MainNet
        const erc20 = new web3.eth.Contract(
          ERC20.abi,
          arbitrabletxForm.token.address
        )
        // Fetch Decimals from Contract
        arbitrabletxForm.token.decimals = yield call(
          erc20.methods.decimals().call
        )
      } catch (err) {}
    }
  }

  if (arbitrabletxForm.file) {
    const data = yield call(readFile, arbitrabletxForm.file.dataURL)
    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = yield call(
      ipfsPublish,
      arbitrabletxForm.file.name,
      data
    )

    // Pass IPFS path for URI. No need for fileHash
    metaEvidence = createMetaEvidence({
      arbitrableAddress,
      sender: accounts[0],
      receiver: arbitrabletxForm.receiver,
      title: arbitrabletxForm.title,
      description: arbitrabletxForm.description,
      fileURI: `/ipfs/${fileIpfsHash[1].hash}${fileIpfsHash[0].path}`,
      amount: arbitrabletxForm.amount,
      timeout: arbitrabletxForm.timeout,
      subCategory: arbitrabletxForm.subCategory,
      token: arbitrabletxForm.token,
      extraData: arbitrabletxForm.extraData,
      invoice: arbitrabletxForm.invoice,
    })
  } else {
    metaEvidence = createMetaEvidence({
      arbitrableAddress,
      subCategory: arbitrabletxForm.subCategory,
      sender: accounts[0],
      receiver: arbitrabletxForm.receiver,
      title: arbitrabletxForm.title,
      description: arbitrabletxForm.description,
      amount: arbitrabletxForm.amount,
      timeout: arbitrabletxForm.timeout,
      token: arbitrabletxForm.token,
      extraData: arbitrabletxForm.extraData,
      invoice: arbitrabletxForm.invoice,
    })
  }

  const enc = new TextEncoder()

  // Upload the meta-evidence to IPFS
  const ipfsHashMetaEvidenceObj = yield call(
    ipfsPublish,
    'metaEvidence.json',
    enc.encode(JSON.stringify(metaEvidence))
  )

  if (arbitrabletxForm.type === 'invoice')
    navigate(`/invoice/${ipfsHashMetaEvidenceObj[1].hash}`)
  else navigate(`/payment/${ipfsHashMetaEvidenceObj[1].hash}`)

  return arbitrabletxForm
}

/**
 * MetaEvidence.
 * @param {object} { payload: metaEvidence } - The MetaEvidence.
 */
function* fetchMetaEvidence({ type, payload: { metaEvidenceIPFSHash } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Fetch the meta-evidence
  const metaEvidence = yield call(getMetaEvidence.getFile, metaEvidenceIPFSHash)

  const metaEvidenceDecoded = JSON.parse(JSON.stringify(metaEvidence))

  const parties = Object.assign(
    {},
    ...Object.entries(metaEvidenceDecoded.aliases).map(([a, b]) => ({ [b]: a }))
  )

  if (!validateMetaEvidence(metaEvidenceDecoded))
    throw new Error('SECURITY ERROR: MetaEvidence generated outside of Kleros')

  let verified = true
  const warnings = []
  // Add in missing pieces of metaEvidence for legacy disputes
  if (!metaEvidenceDecoded.token) {
    metaEvidenceDecoded.token = ETH
  } else {
    // If ETH, use the constants over user supplied data
    if (metaEvidenceDecoded.token.address === ETH.address) {
      metaEvidenceDecoded.token = ETH
    } else {
      const _token = metaEvidenceDecoded.token
      // Tokens
      const ERC20BadgeInstance = new web3.eth.Contract(
        ArbitrableAddressList.abi,
        ERC20_ADDRESS
      )

      const T2CRInstance = new web3.eth.Contract(
        ArbitrableTokenList.abi,
        T2CR_ADDRESS
      )

      const ERC20Instance = new web3.eth.Contract(ERC20.abi, _token.address)

      // Verify token attributes
      let decimals
      let allowance
      try {
        decimals = yield call(ERC20Instance.methods.decimals().call)
        allowance = yield call(
          ERC20Instance.methods.allowance(
            accounts[0],
            metaEvidenceDecoded.arbitrableAddress
          ).call
        )
      } catch {}

      // Overwrite user input if decimals is available in the contract
      if (decimals) {
        metaEvidenceDecoded.token.decimals = decimals
      } else {
        // Assume 18 if none supplied
        if (!metaEvidenceDecoded.token.decimals)
          metaEvidenceDecoded.token.decimals = 18
        verified = false
        warnings.push(
          warningConstants.DECIMAL_WARNING(metaEvidenceDecoded.token.decimals)
        )
      }
      if (allowance) metaEvidenceDecoded.token.allowance = allowance

      // Verify token attributes
      const tokenQuery = yield call(
        T2CRInstance.methods.queryTokens(
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          1,
          [false, true, false, false, false, false, false, false],
          true,
          _token.address
        ).call
      )

      const tokenID = tokenQuery.values[0]
      // If token does not exist we have nothing to check against
      if (tokenID) {
        const verifiedToken = yield call(
          T2CRInstance.methods.tokens(tokenID).call
        )
        for (let attr of Object.keys(_token)) {
          // If the attribute is not in the list we don't need to worry about it
          const _verifiedAttr = verifiedToken[attr]
          if (_verifiedAttr && _token[attr] !== _verifiedAttr) {
            verified = false
            warnings.push(warningConstants.REUSED_TOKEN_WARNING(attr))
          }
        }
      }

      // Verify token address
      const item = yield call(
        ERC20BadgeInstance.methods.getAddressInfo(_token.address).call
      )

      if (!item || Number(item.status) !== 1 || !verified) {
        verified = false
        warnings.push(warningConstants.ADDRESS_WARNING(_token.address))
      }
    }
  }

  warnings.reverse()

  return yield put(
    action(arbitrabletxActions.arbitrabletx.RESUMEFORM, {
      arbitrabletxResumeForm: {
        arbitrableAddress: metaEvidenceDecoded.arbitrableAddress,
        subCategory: metaEvidenceDecoded.subCategory,
        title: metaEvidenceDecoded.title,
        description: metaEvidenceDecoded.description,
        receiver: parties['receiver'],
        otherPartyAddress: parties['receiver'],
        amount: metaEvidenceDecoded.amount,
        token: metaEvidenceDecoded.token || ETH,
        invoice: metaEvidenceDecoded.invoice,
        timeout: metaEvidenceDecoded.timeout,
        file: metaEvidenceDecoded.fileURI
          ? `https://ipfs.kleros.io${metaEvidenceDecoded.fileURI}`
          : null,
        shareLink: `https://escrow.kleros.io/resume/${metaEvidenceIPFSHash}`,
        extraData: metaEvidenceDecoded.extraData || {},
        verified,
        warnings,
      },
    })
  )
}

/**
 * Creates a new arbitrableTx.
 * @param {object} { payload: arbitrabletxReceived } - The arbitrable transaction to create.
 */
function* createArbitrabletx({
  payload: { arbitrabletxReceived, metaEvidenceIPFSHash },
}) {
  const accounts = yield call(web3.eth.getAccounts)

  let txHash
  if (
    !arbitrabletxReceived.token ||
    arbitrabletxReceived.token.ticker === 'ETH'
  ) {
    const multipleArbitrableTransactionEth = new web3.eth.Contract(
      multipleArbitrableTransaction.abi,
      arbitrabletxReceived.arbitrableAddress
    )

    txHash = yield call(
      multipleArbitrableTransactionEth.methods.createTransaction(
        arbitrabletxReceived.timeout.toString(),
        arbitrabletxReceived.receiver,
        `/ipfs/${metaEvidenceIPFSHash}/metaEvidence.json`
      ).send,
      {
        from: accounts[0],
        value: web3.utils.toWei(arbitrabletxReceived.amount, 'ether'),
      }
    )
  } else {
    const arbitrableTransactionContractInstance = new web3.eth.Contract(
      multipleArbitrableTokenTransaction.abi,
      arbitrabletxReceived.arbitrableAddress
    )

    let decimals = 18
    if (arbitrabletxReceived.token && arbitrabletxReceived.token.decimals)
      decimals = arbitrabletxReceived.token.decimals

    // Handle decimals
    const receivedAmountParts = String(arbitrabletxReceived.amount).split('.')
    let whole = receivedAmountParts[0] || '0'
    let fraction = receivedAmountParts[1] || '0'

    while (fraction.length < decimals) {
      fraction += '0'
    }

    // Convert to int based on decimals
    const amount = web3.utils
      .toBN(whole)
      .mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)))
      .add(web3.utils.toBN(fraction))

    const allowanceAmount = web3.utils.toBN(
      arbitrabletxReceived.token.allowance
        ? arbitrabletxReceived.token.allowance
        : '0'
    )

    const erc20 = new web3.eth.Contract(
      ERC20.abi,
      arbitrabletxReceived.token.address
    )

    const _submit = async () => {
      return new Promise(async (resolve, reject) => {
        const createTx = async () => {
          const _txHash = await arbitrableTransactionContractInstance.methods
            .createTransaction(
              amount,
              arbitrabletxReceived.token.address,
              arbitrabletxReceived.timeout.toString(),
              arbitrabletxReceived.receiver,
              `/ipfs/${metaEvidenceIPFSHash}/metaEvidence.json`
            )
            .send({
              from: accounts[0],
            })

          resolve(_txHash)
        }

        // Use allowance if balance exists
        if (allowanceAmount.lt(amount))
          erc20.methods
            .approve(arbitrabletxReceived.arbitrableAddress, amount)
            .send({
              from: accounts[0],
            })
            .on('transactionHash', async () => {
              createTx()
            })
        else createTx()
      })
    }

    // Approve amount to be spent
    txHash = yield call(_submit)
  }

  if (txHash)
    navigate(
      `/contract/${arbitrabletxReceived.arbitrableAddress}/payment/${
        txHash.events.MetaEvidence.returnValues[0]
      }`
    )

  return {}
}

/**
 * Fetches arbitrableTxs for the current user and puts them in the store.
 */
function* fetchArbitrabletxs() {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let multipleArbitrableTransactionEth = {}
  const arbitrableTransactions = []

  // Combine all arbitrable contracts
  const ALL_ARBITRABLE_ADDRESSES = ARBITRABLE_ADDRESSES.concat(
    ARBITRABLE_TOKEN_ADDRESSES
  )

  for (let arbitrableContract of ALL_ARBITRABLE_ADDRESSES) {
    multipleArbitrableTransactionEth = new web3.eth.Contract(
      getAbiForArbitrableAddress(arbitrableContract),
      arbitrableContract
    )
    const [arbitrableTransactionIds, arbitratorExtraData] = yield all([
      call(
        multipleArbitrableTransactionEth.methods.getTransactionIDsByAddress(
          accounts[0]
        ).call
      ),
      call(multipleArbitrableTransactionEth.methods.arbitratorExtraData().call),
    ])
    const _arbitrableTransactions = yield all(
      // eslint-disable-next-line no-loop-func
      arbitrableTransactionIds.map((arbitrableTransactionId) =>
        call(async () => {
          try {
            const [arbitrableTransaction, metaEvidence] = await Promise.all([
              multipleArbitrableTransactionEth.methods
                .transactions(arbitrableTransactionId)
                .call(),
              archon.arbitrable.getMetaEvidence(
                arbitrableContract,
                arbitrableTransactionId // Use arbitrableTransactionId as metaEvidenceID
              ),
            ])

            arbitrableTransaction.arbitrableAddress =
              arbitrableContract || '0x0000000000000000000000000000000000000000'
            arbitrableTransaction.metaEvidence =
              metaEvidence.metaEvidenceJSON || {}
            arbitrableTransaction.id = arbitrableTransactionId || 0
            arbitrableTransaction.party =
              accounts[0] === arbitrableTransaction.sender
                ? 'sender'
                : accounts[0] === arbitrableTransaction.receiver
                ? 'receiver'
                : '...'
            arbitrableTransaction.otherParty =
              accounts[0] === arbitrableTransaction.receiver
                ? 'sender'
                : accounts[0] === arbitrableTransaction.sender
                ? 'receiver'
                : '...'
            arbitrableTransaction.originalAmount =
              metaEvidence.metaEvidenceJSON.amount &&
              web3.utils
                .toWei(metaEvidence.metaEvidenceJSON.amount, 'ether')
                .toString()
            arbitrableTransaction.detailsStatus = getStatusArbitrable({
              accounts,
              arbitrabletx: arbitrableTransaction,
            })
            arbitrableTransaction.arbitratorExtraData = arbitratorExtraData

            return arbitrableTransaction
          } catch (err) {
            console.error(err)
          }
        })
      )
    )

    arbitrableTransactions.push(..._arbitrableTransactions.filter((t) => t))
  }

  // Sort by lastInteraction. Most recently updated txs appear first
  return arbitrableTransactions.sort((a, b) => {
    return b.lastInteraction - a.lastInteraction
  })
}

/**
 * Fetches arbitrable transaction details.
 * @param {object} { payload: arbitrable, id } - The id of the arbitrable transaction to fetch details for.
 */
function* fetchArbitrabletx({ payload: { arbitrable, id } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let ruling = null

  // force convert to string
  const transactionId = id.toString()

  const metaEvidenceArchon = yield call(
    archon.arbitrable.getMetaEvidence,
    arbitrable,
    id
  )

  // Build this object up to return
  let arbitrableTransaction = {}

  const arbitrableTransactionContractInstance = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  // Share same methods for now
  // NOTE if contracts diverge this will have to be moved into blocks above
  const [
    arbitratorAddress,
    arbitratorExtraData,
    _arbitrableTransaction,
    feeTimeout,
  ] = yield all([
    call(arbitrableTransactionContractInstance.methods.arbitrator().call),
    call(
      arbitrableTransactionContractInstance.methods.arbitratorExtraData().call
    ),
    call(
      arbitrableTransactionContractInstance.methods.transactions(transactionId)
        .call
    ),
    call(arbitrableTransactionContractInstance.methods.feeTimeout().call),
  ])

  arbitrableTransaction = _arbitrableTransaction

  arbitrableTransaction.arbitratorExtraData = arbitratorExtraData
  arbitrableTransaction.feeTimeout = feeTimeout
  arbitrableTransaction.arbitratorAddress = arbitratorAddress
  arbitrableTransaction.id = id
  arbitrableTransaction.evidences = null

  arbitrableTransaction.otherParty =
    accounts[0] === arbitrableTransaction.sender ? 'receiver' : 'sender'
  arbitrableTransaction.otherPartyAddress =
    accounts[0] === arbitrableTransaction.sender
      ? arbitrableTransaction.receiver
      : arbitrableTransaction.sender

  // Fetch data from arbitrator
  const arbitratorEth = new web3.eth.Contract(
    Arbitrator.abi,
    arbitrableTransaction.arbitratorAddress
  )

  const arbitrationCost = yield call(
    arbitratorEth.methods.arbitrationCost(
      arbitrableTransaction.arbitratorExtraData
    ).call
  )

  const disputeStatus = yield call(
    arbitratorEth.methods.disputeStatus(arbitrableTransaction.disputeId).call
  )

  if (metaEvidenceArchon.metaEvidenceJSON.fileURI)
    arbitrableTransaction.file = `https://ipfs.kleros.io${
      metaEvidenceArchon.metaEvidenceJSON.fileURI
    }`

  // token addresses must match
  if (
    arbitrableTransaction.token &&
    metaEvidenceArchon.metaEvidenceJSON.token.address.toLowerCase() !==
      arbitrableTransaction.token.toLowerCase()
  )
    throw new Error(
      'MetaEvidence Token information does not match token in the contract'
    )

  arbitrableTransaction.token = metaEvidenceArchon.metaEvidenceJSON.token

  // NOTE: assuming disputeID is not equal to 0
  if (arbitrableTransaction.disputeId) {
    const metaEvidenceArchonEvidences = yield call(
      archon.arbitrable.getEvidence,
      arbitrable,
      arbitrableTransaction.arbitratorAddress,
      id
    )

    if (metaEvidenceArchonEvidences.length > 0)
      arbitrableTransaction.evidences = metaEvidenceArchonEvidences
  }

  if (
    disputeStatus.toString() === disputeConstants.SOLVED.toString() ||
    disputeStatus.toString() === disputeConstants.APPEALABLE.toString()
  )
    ruling = yield call(
      arbitratorEth.methods.currentRuling(arbitrableTransaction.disputeId).call
    )

  if (!metaEvidenceArchon.metaEvidenceJSON.extraData)
    metaEvidenceArchon.metaEvidenceJSON.extraData = {}

  let verified = true
  const warnings = []
  // Add in missing pieces of metaEvidence for legacy disputes
  if (!metaEvidenceArchon.metaEvidenceJSON.token) {
    metaEvidenceArchon.metaEvidenceJSON.token = ETH
  } else {
    // If ETH, use the constants over user supplied data
    if (metaEvidenceArchon.metaEvidenceJSON.token.address === ETH.address) {
      metaEvidenceArchon.metaEvidenceJSON.token = ETH
    } else {
      const _token = metaEvidenceArchon.metaEvidenceJSON.token
      // Tokens
      const ERC20BadgeInstance = new web3.eth.Contract(
        ArbitrableAddressList.abi,
        ERC20_ADDRESS
      )

      const T2CRInstance = new web3.eth.Contract(
        ArbitrableTokenList.abi,
        T2CR_ADDRESS
      )

      const ERC20Instance = new web3.eth.Contract(ERC20.abi, _token.address)

      // Verify token attributes
      let decimals
      try {
        decimals = yield call(ERC20Instance.methods.decimals().call)
      } catch {}

      // Overwrite user input if decimals is available in the contract
      if (decimals) {
        metaEvidenceArchon.metaEvidenceJSON.token.decimals = decimals
      } else {
        // Assume 18 if none supplied
        if (!metaEvidenceArchon.metaEvidenceJSON.token.decimals)
          metaEvidenceArchon.metaEvidenceJSON.token.decimals = 18
        verified = false
        warnings.push(
          warningConstants.DECIMAL_WARNING(
            metaEvidenceArchon.metaEvidenceJSON.token.decimals
          )
        )
      }

      // Verify token attributes
      const tokenQuery = yield call(
        T2CRInstance.methods.queryTokens(
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          1,
          [false, true, false, false, false, false, false, false],
          true,
          _token.address
        ).call
      )

      const tokenID = tokenQuery.values[0]
      // If token does not exist we have nothing to check against
      if (tokenID) {
        const verifiedToken = yield call(
          T2CRInstance.methods.tokens(tokenID).call
        )
        for (let attr of Object.keys(_token)) {
          // If the attribute is not in the list we don't need to worry about it
          const _verifiedAttr = verifiedToken[attr]
          if (_verifiedAttr && _token[attr] !== _verifiedAttr) {
            verified = false
            warnings.push(warningConstants.REUSED_TOKEN_WARNING(attr))
          }
        }
      }

      // Verify token address
      const item = yield call(
        ERC20BadgeInstance.methods.getAddressInfo(_token.address).call
      )

      if (!item || Number(item.status) !== 1 || !verified) {
        verified = false
        warnings.push(warningConstants.ADDRESS_WARNING(_token.address))
      }
    }
  }

  // Parse amount to human readable format
  const _amount = arbitrableTransaction.amount
  if (
    metaEvidenceArchon.metaEvidenceJSON.token &&
    metaEvidenceArchon.metaEvidenceJSON.token.decimals &&
    String(metaEvidenceArchon.metaEvidenceJSON.token.decimals) !== '18'
  ) {
    const amountLength = _amount.length
    const decimalIndex =
      amountLength - metaEvidenceArchon.metaEvidenceJSON.token.decimals
    if (decimalIndex < 0) {
      arbitrableTransaction.amount = parseFloat(
        '0.' + '0'.repeat(Math.abs(decimalIndex)) + _amount
      ).toString()
    } else {
      arbitrableTransaction.amount = parseFloat(
        _amount.slice(0, decimalIndex) + '.' + _amount.slice(decimalIndex)
      ).toString()
    }
  } else {
    arbitrableTransaction.amount = web3.utils.fromWei(_amount, 'ether')
  }

  warnings.reverse()

  return {
    arbitrableAddress: arbitrable,
    ...metaEvidenceArchon.metaEvidenceJSON,
    ...arbitrableTransaction, // Overwrite transaction.amount
    arbitrationCost: web3.utils.fromWei(arbitrationCost.toString(), 'ether'),
    originalAmount: metaEvidenceArchon.metaEvidenceJSON.amount,
    disputeStatus,
    party:
      accounts[0] === arbitrableTransaction.sender
        ? 'sender'
        : accounts[0] === arbitrableTransaction.receiver
        ? 'receiver'
        : 'none',
    ruling,
    appealable: disputeStatus === disputeConstants.APPEALABLE.toString(),
    verified,
    warnings,
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: arbitrable, id, amount } - The id of the arbitrableTx and the amount of the transaction.
 */
function* createPayOrReimburse({ payload: { arbitrable, id, amount } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  if (accounts[0] === arbitrableTransaction.sender)
    yield call(
      multipleArbitrableTransactionEth.methods.pay(
        id,
        web3.utils.toWei(amount, 'ether')
      ).send,
      {
        from: accounts[0],
        value: 0,
      }
    )
  if (accounts[0] === arbitrableTransaction.receiver)
    yield call(
      multipleArbitrableTransactionEth.methods.reimburse(
        id,
        web3.utils.toWei(amount, 'ether')
      ).send,
      {
        from: accounts[0],
        value: 0,
      }
    )

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, { arbitrable, id })
  )
}

/**
 * Transfer the transaction's amount to the sender if the timeout has passed.
 * @param {object} { payload: arbitrable, id } - The id of the arbitrableTx.
 */
function* executeTransaction({ payload: { arbitrable, id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  yield call(
    multipleArbitrableTransactionEth.methods.executeTransaction(id).send,
    {
      from: accounts[0],
      value: 0,
    }
  )

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, { arbitrable, id })
  )
}

/**
 * Raises dispute.
 * @param {object} { payload: arbitrable, id } - The id of the arbitrable transaction.
 */
function* createDispute({ payload: { arbitrable, id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  const arbitratorAddress = yield call(
    multipleArbitrableTransactionEth.methods.arbitrator().call
  )

  const arbitratorEth = new web3.eth.Contract(Arbitrator.abi, arbitratorAddress)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const extraData = yield call(
    multipleArbitrableTransactionEth.methods.arbitratorExtraData().call
  )

  const arbitrationCost = yield call(
    arbitratorEth.methods.arbitrationCost(extraData).call
  )

  if (accounts[0] === arbitrableTransaction.receiver) {
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeByReceiver(id)
        .send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.receiverFee,
      }
    )
  }

  if (accounts[0] === arbitrableTransaction.sender)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeBySender(id)
        .send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.senderFee,
      }
    )

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, { arbitrable, id })
  )
}

/**
 * Raises an appeal.
 * @param {object} { payload: arbitrable, id } - The id of the arbitrable transaction.
 */
function* createAppeal({ payload: { arbitrable, id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  const arbitratorAddress = yield call(
    multipleArbitrableTransactionEth.methods.arbitrator().call
  )

  const arbitratorEth = new web3.eth.Contract(Arbitrator.abi, arbitratorAddress)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const arbitratorExtraData = yield call(
    multipleArbitrableTransactionEth.methods.arbitratorExtraData().call
  )

  const appealCost = yield call(
    arbitratorEth.methods.appealCost(
      arbitrableTransaction.disputeId,
      arbitratorExtraData
    ).call
  )

  yield call(multipleArbitrableTransactionEth.methods.appeal(id).send, {
    from: accounts[0],
    value: appealCost,
  })

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, { arbitrable, id })
  )
}

/**
 * Call if a party fails to pay the fee.
 * @param {object} { payload: arbitrable, id } - The arbitrabl transaction id of the contract.
 */
function* createTimeout({ payload: { arbitrable, id } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  if (accounts[0] === arbitrableTransaction.receiver)
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutByReceiver(id).send,
      {
        from: accounts[0],
        value: 0,
      }
    )
  else
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutBySender(id).send,
      {
        from: accounts[0],
        value: 0,
      }
    )

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, { arbitrable, id })
  )
}

/**
 * Send evidence
 * @param {object} { payload: evidenceReceived, arbitrable, arbitrableTransactionId } - Evidence.
 */
function* createEvidence({
  payload: { evidenceReceived, arbitrable, arbitrableTransactionId },
}) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let ipfsHashMetaEvidence = null
  let fileURI = ''

  if (evidenceReceived.file) {
    const data = yield call(readFile, evidenceReceived.file.dataURL)

    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = yield call(
      ipfsPublish,
      evidenceReceived.file.name,
      data
    )

    fileURI = `/ipfs/${fileIpfsHash[1].hash}${fileIpfsHash[0].path}`
  }

  // Pass IPFS path for URI. No need for fileHash
  const evidence = {
    fileURI,
    name: evidenceReceived.name,
    description: evidenceReceived.description,
  }

  const enc = new TextEncoder()

  // Upload the meta-evidence to IPFS
  const ipfsHashMetaEvidenceObj = yield call(
    ipfsPublish,
    'evidence.json',
    enc.encode(JSON.stringify(evidence)) // encode to bytes
  )
  ipfsHashMetaEvidence =
    ipfsHashMetaEvidenceObj[1].hash + ipfsHashMetaEvidenceObj[0].path

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    getAbiForArbitrableAddress(arbitrable),
    arbitrable
  )

  const txHash = yield call(
    multipleArbitrableTransactionEth.methods.submitEvidence(
      arbitrableTransactionId, // force id to be a string
      `/ipfs/${ipfsHashMetaEvidence}`
    ).send,
    {
      from: accounts[0],
      value: 0,
    }
  )

  if (txHash) navigate(evidenceReceived.arbitrableTransactionId)

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, {
      arbitrable,
      id: arbitrableTransactionId,
    })
  )
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(
    arbitrabletxActions.metaevidence.FETCH,
    lessduxSaga,
    'fetch',
    arbitrabletxActions.metaevidence,
    fetchMetaEvidence
  )
  yield takeLatest(
    arbitrabletxActions.arbitrabletx.FORM,
    lessduxSaga,
    'create',
    arbitrabletxActions.arbitrabletx,
    formArbitrabletx
  )
  yield takeLatest(
    arbitrabletxActions.arbitrabletx.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.arbitrabletx,
    createArbitrabletx
  )
  yield takeLatest(
    arbitrabletxActions.arbitrabletxs.FETCH,
    lessduxSaga,
    'fetch',
    arbitrabletxActions.arbitrabletxs,
    fetchArbitrabletxs
  )
  yield takeLatest(
    arbitrabletxActions.arbitrabletx.FETCH,
    lessduxSaga,
    'fetch',
    arbitrabletxActions.arbitrabletx,
    fetchArbitrabletx
  )
  yield takeLatest(
    arbitrabletxActions.dispute.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.dispute,
    createDispute
  )
  yield takeLatest(
    arbitrabletxActions.appeal.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.appeal,
    createAppeal
  )
  yield takeLatest(
    arbitrabletxActions.pay.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.pay,
    createPayOrReimburse
  )
  yield takeLatest(
    arbitrabletxActions.executetx.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.executetx,
    executeTransaction
  )
  yield takeLatest(
    arbitrabletxActions.evidence.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.evidence,
    createEvidence
  )
  yield takeLatest(
    arbitrabletxActions.timeout.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.timeout,
    createTimeout
  )
}
