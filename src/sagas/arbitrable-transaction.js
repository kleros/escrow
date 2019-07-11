import { all, call, put, takeLatest } from 'redux-saga/effects'
import { navigate } from '@reach/router'
import multipleArbitrableTransaction from '@kleros/kleros-interaction/build/contracts/MultipleArbitrableTransaction.json'
import Arbitrator from '@kleros/kleros-interaction/build/contracts/Arbitrator.json'

import {
  web3,
  archon,
  ARBITRABLE_ADDRESSES,
  ARBITRABLE_TOKEN_ADDRESSES
} from '../bootstrap/dapp-api'
import * as arbitrabletxActions from '../actions/arbitrable-transaction'
import ERC20 from '../assets/abi/erc20.json'
import multipleArbitrableTokenTransaction from '../assets/abi/multipleArbitrableTokenTransaction.json'
import * as errorConstants from '../constants/error'
import * as disputeConstants from '../constants/dispute'
import ETH from '../constants/eth'
import { action } from '../utils/action'
import { lessduxSaga } from '../utils/saga'
import readFile from '../utils/read-file'
import createMetaEvidence from '../utils/generate-meta-evidence'
import getStatusArbitrable from '../utils/get-status-arbitrable'
import validateMetaEvidence from '../utils/validate-meta-evidence'

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
        arbitrabletxForm.token.decimals = yield call(erc20.methods.decimals().call)
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
      invoice: arbitrabletxForm.invoice
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
      invoice: arbitrabletxForm.invoice
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
        extraData: metaEvidenceDecoded.extraData || {}
      }
    })
  )
}

/**
 * Creates a new arbitrableTx.
 * @param {object} { payload: arbitrabletxReceived } - The arbitrable transaction to create.
 */
function* createArbitrabletx({
  payload: { arbitrabletxReceived, metaEvidenceIPFSHash }
}) {
  const accounts = yield call(web3.eth.getAccounts)

  let txHash
  if (!arbitrabletxReceived.token || arbitrabletxReceived.token.ticker === 'ETH') {
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
        value: web3.utils.toWei(arbitrabletxReceived.amount, 'ether')
      }
    )
  }
  else {
    const arbitrableTransactionContractInstance = new web3.eth.Contract(
      multipleArbitrableTokenTransaction.abi,
      arbitrabletxReceived.arbitrableAddress
    )

    let decimals = 18
    if (arbitrabletxReceived.token && arbitrabletxReceived.token.decimals)
      decimals = arbitrabletxReceived.token.decimals
    // Convert to int based on decimals
    const amount = web3.utils.toBN(arbitrabletxReceived.amount * (
      10 ** decimals
    ))

    const erc20 = new web3.eth.Contract(
      ERC20.abi,
      arbitrabletxReceived.token.address
    )

    // Approve amount to be spent
    yield call(
      erc20.methods.approve(
        arbitrabletxReceived.arbitrableAddress,
        amount
      ).send,
      {
        from: accounts[0]
      }
    )

    // Create Transaction
    txHash = yield call(
      arbitrableTransactionContractInstance.methods.createTransaction(
        amount,
        arbitrabletxReceived.token.address,
        arbitrabletxReceived.timeout.toString(),
        arbitrabletxReceived.receiver,
        `/ipfs/${metaEvidenceIPFSHash}/metaEvidence.json`
      ).send,
      {
        from: accounts[0]
      }
    )
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
      multipleArbitrableTransaction.abi,
      arbitrableContract
    )
    const [arbitrableTransactionIds, arbitratorExtraData] = yield all([
      call(
        multipleArbitrableTransactionEth.methods.getTransactionIDsByAddress(
          accounts[0]
        ).call
      ),
      call(multipleArbitrableTransactionEth.methods.arbitratorExtraData().call)
    ])
    const _arbitrableTransactions = yield all(
      // eslint-disable-next-line no-loop-func
      arbitrableTransactionIds.map(arbitrableTransactionId =>
        call(async () => {
          try {
            const [arbitrableTransaction, metaEvidence] = await Promise.all([
              multipleArbitrableTransactionEth.methods
                .transactions(arbitrableTransactionId)
                .call(),
              archon.arbitrable.getMetaEvidence(
                arbitrableContract,
                arbitrableTransactionId // Use arbitrableTransactionId as metaEvidenceID
              )
            ])

            arbitrableTransaction.arbitrableAddress =
              arbitrableContract ||
              '0x0000000000000000000000000000000000000000'
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
            arbitrableTransaction.originalAmount = web3.utils
              .toWei(metaEvidence.metaEvidenceJSON.amount, 'ether')
              .toString()
            arbitrableTransaction.detailsStatus = getStatusArbitrable({
              accounts,
              arbitrabletx: arbitrableTransaction
            })
            arbitrableTransaction.arbitratorExtraData = arbitratorExtraData

            return arbitrableTransaction
          } catch (err) {
            console.error(err)
          }
        })
      )
    )

    arbitrableTransactions.push(..._arbitrableTransactions.filter(t => t))
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

  const metaEvidenceArchon = yield call(archon.arbitrable.getMetaEvidence, arbitrable, id)

  // Build this object up to return
  let arbitrableTransaction = {}
  let arbitrableTransactionContractInstance

  if (
    metaEvidenceArchon.metaEvidenceJSON.token &&
    metaEvidenceArchon.metaEvidenceJSON.token.address
  ) {
    // Token transaction
    arbitrableTransactionContractInstance = new web3.eth.Contract(
      multipleArbitrableTokenTransaction.abi,
      arbitrable
    )
  } else {
    // ETH transaction
    arbitrableTransactionContractInstance = new web3.eth.Contract(
      multipleArbitrableTransaction.abi,
      arbitrable
    )
  }

  // Share same methods for now
  // NOTE if contracts diverge this will have to be moved into blocks above
  const [
    arbitratorAddress,
    arbitratorExtraData,
    _arbitrableTransaction,
    feeTimeout
  ] = yield all([
    call(
      arbitrableTransactionContractInstance.methods.arbitrator().call
    ),
    call(
      arbitrableTransactionContractInstance.methods.arbitratorExtraData().call
    ),
    call(
      arbitrableTransactionContractInstance.methods.transactions(transactionId).call
    ),
    call(arbitrableTransactionContractInstance.methods.feeTimeout().call)
  ])

  arbitrableTransaction = _arbitrableTransaction

  arbitrableTransaction.arbitratorExtraData = arbitratorExtraData
  arbitrableTransaction.feeTimeout = feeTimeout
  arbitrableTransaction.arbitratorAddress = arbitratorAddress
  arbitrableTransaction.id = id
  arbitrableTransaction.evidences = null

  const _amount = arbitrableTransaction.amount
  if (
    metaEvidenceArchon.metaEvidenceJSON.token &&
    metaEvidenceArchon.metaEvidenceJSON.token.decimals &&
    metaEvidenceArchon.metaEvidenceJSON.token.decimals !== '18'
  ) {
    const amountLength = _amount.length
    const decimalIndex = amountLength - metaEvidenceArchon.metaEvidenceJSON.token.decimals
    arbitrableTransaction.amount = _amount.slice(0, decimalIndex) + '.' + _amount.slice(decimalIndex)
  } else {
    arbitrableTransaction.amount = web3.utils.fromWei(
      _amount,
      'ether'
    )
  }

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

  const arbitrationCost = yield call(arbitratorEth.methods.arbitrationCost(
    arbitrableTransaction.arbitratorExtraData
  ).call)

  const disputeStatus = yield call(
    arbitratorEth.methods.disputeStatus(arbitrableTransaction.disputeId).call
  )

  if (metaEvidenceArchon.metaEvidenceJSON.fileURI)
    arbitrableTransaction.file = `https://ipfs.kleros.io${
      metaEvidenceArchon.metaEvidenceJSON.fileURI
    }`

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

  // Add in missing pieces of metaEvidence for legacy disputes
  if (!metaEvidenceArchon.metaEvidenceJSON.token)
    metaEvidenceArchon.metaEvidenceJSON.token = ETH

  if (!metaEvidenceArchon.metaEvidenceJSON.extraData)
    metaEvidenceArchon.metaEvidenceJSON.extraData = {}

  // Set token to be from MetaEvidence if exists so that we retain extra information
  if (arbitrableTransaction.token && metaEvidenceArchon.metaEvidenceJSON.token) {
    if (arbitrableTransaction.token !== metaEvidenceArchon.metaEvidenceJSON.token.address)
      throw new Error("Token in contract does not match MetaEvidence")
    arbitrableTransaction.token = metaEvidenceArchon.metaEvidenceJSON.token
  }

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
    appealable: disputeStatus === disputeConstants.APPEALABLE.toString()
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: arbitrable, id, amount } - The id of the arbitrableTx and the amount of the transaction.
 */
function* createPayOrReimburse({ payload: { arbitrable, id, amount } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const multipleArbitrableTransactionEth = new web3.eth.Contract(
    multipleArbitrableTransaction.abi,
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
        value: 0
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
        value: 0
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
    multipleArbitrableTransaction.abi,
    arbitrable
  )

  yield call(
    multipleArbitrableTransactionEth.methods.executeTransaction(id).send,
    {
      from: accounts[0],
      value: 0
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
    multipleArbitrableTransaction.abi,
    arbitrable
  )

  const arbitratorAddress = yield call(
    multipleArbitrableTransactionEth.methods.arbitrator().call
  )

  const arbitratorEth = new web3.eth.Contract(
    Arbitrator.abi,
    arbitratorAddress
  )

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const extraData = yield call(
    multipleArbitrableTransactionEth.methods.arbitratorExtraData().call
  )

  const arbitrationCost = yield call(
    arbitratorEth.methods.arbitrationCost(extraData).call
  )

  if (accounts[0] === arbitrableTransaction.receiver)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeByReceiver(id)
        .send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.receiverFee
      }
    )
  if (accounts[0] === arbitrableTransaction.sender)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeBySender(id)
        .send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.senderFee
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
    multipleArbitrableTransaction.abi,
    arbitrable
  )

  const arbitratorAddress = yield call(
    multipleArbitrableTransactionEth.methods.arbitrator().call
  )

  const arbitratorEth = new web3.eth.Contract(
    Arbitrator.abi,
    arbitratorAddress
  )

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
    value: appealCost
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
    multipleArbitrableTransaction.abi,
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
        value: 0
      }
    )
  else
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutBySender(id).send,
      {
        from: accounts[0],
        value: 0
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
  payload: { evidenceReceived, arbitrable, arbitrableTransactionId }
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
    description: evidenceReceived.description
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
    multipleArbitrableTransaction.abi,
    arbitrable
  )

  const txHash = yield call(
    multipleArbitrableTransactionEth.methods.submitEvidence(
      arbitrableTransactionId, // force id to be a string
      `/ipfs/${ipfsHashMetaEvidence}`
    ).send,
    {
      from: accounts[0],
      value: 0
    }
  )

  if (txHash) navigate(evidenceReceived.arbitrableTransactionId)

  return yield put(
    action(arbitrabletxActions.arbitrabletx.FETCH, {
      arbitrable,
      id: arbitrableTransactionId
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
