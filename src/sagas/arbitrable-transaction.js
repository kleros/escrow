import { call, put, takeLatest } from 'redux-saga/effects'
import { navigate } from '@reach/router'

import { web3, multipleArbitrableTransactionEth, arbitrator } from '../bootstrap/dapp-api'
import * as arbitrabletxActions from '../actions/arbitrable-transaction'
import * as errorConstants from '../constants/error'
import * as disputeConstants from '../constants/dispute'
import { action } from '../utils/action'
import { lessduxSaga } from '../utils/saga'
import getBase64 from '../utils/get-base-64'
import createMetaEvidence from '../utils/generate-meta-evidence'

import ipfsPublish from './api/ipfs-publish'

/**
 * Creates a new arbitrableTx.
 * @param {object} { payload: arbitrabletxReceived } - The arbitrable transaction to create.
 */
function* createArbitrabletx({ type, payload: { arbitrabletxReceived } }) {
  const accounts = yield call(web3.eth.getAccounts)

  let arbitrableTransactionCount
  let metaEvidence = null
  let ipfsHashMetaEvidence = null

  if (arbitrabletxReceived.file) {
    const data = yield call(
      getBase64,
      arbitrabletxReceived.file
    )

    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = yield call(
      ipfsPublish,
      data
    )

    // Pass IPFS path for URI. No need for fileHash
    metaEvidence = createMetaEvidence(
      accounts[0],
      arbitrabletxReceived.seller,
      arbitrabletxReceived.title,
      arbitrabletxReceived.description,
      `/ipfs/${fileIpfsHash[0].hash}`
    )
  } else {
    metaEvidence = createMetaEvidence(
      accounts[0],
      arbitrabletxReceived.seller,
      arbitrabletxReceived.title,
      arbitrabletxReceived.description,
    )
  }

  // Upload the meta-evidence to IPFS
  const ipfsHashMetaEvidenceObj = yield call(ipfsPublish, JSON.stringify(metaEvidence))
  ipfsHashMetaEvidence = ipfsHashMetaEvidenceObj[0].hash

  arbitrableTransactionCount = yield call(
    multipleArbitrableTransactionEth.methods.getCountTransactions().call
  )

  const txHash = yield call(
    multipleArbitrableTransactionEth.methods.createTransaction(
      arbitrabletxReceived.arbitrator,
      60,
      arbitrabletxReceived.seller,
      '0x0',
      `/ipfs/${ipfsHashMetaEvidence}`
    ).send,
    {
      from: accounts[0],
      value: web3.utils.toWei(arbitrabletxReceived.payment, 'ether')
    }
  )

  if (txHash)
    navigate(arbitrableTransactionCount)

  return {}
}

/**
 * Fetches arbitrableTxs for the current user and puts them in the store.
 */
function* fetchArbitrabletxs() {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  const arbitrableTransactionIds = yield call(
    multipleArbitrableTransactionEth.methods.getTransactionIDsByAddress(
      accounts[0]
    ).call
  )

  let arbitrableTransactions = []

  let arbitrableTransaction

  for (let arbitrableTransactionId of arbitrableTransactionIds) {
    arbitrableTransaction = yield call(
        multipleArbitrableTransactionEth.methods.transactions(arbitrableTransactionId).call
    )

    arbitrableTransaction.id = arbitrableTransactionId

    arbitrableTransactions.push(arbitrableTransaction)
  }

  return arbitrableTransactions.reverse()
}

/**
 * Fetches arbitrable transaction details.
 * @param {object} { payload: id } - The id of the arbitrable transaction to fetch details for.
 */
function* fetchArbitrabletx({ payload: { id } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let arbitrableTransaction
  let ruling = null

  // force convert to string
  const transactionId = id.toString()

  arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(transactionId).call
  )

  arbitrableTransaction.id = id
  
  const arbitratorEth = new web3.eth.Contract(
    arbitrator.abi,
    arbitrableTransaction.arbitrator // need to follow the arbitrator standard ERC 792
  )

  const disputeStatus = yield call(
    arbitratorEth.methods.disputeStatus(arbitrableTransaction.disputeId).call
  )

  if (disputeStatus === disputeConstants.SOLVED)
    ruling = yield call(
      arbitratorEth.methods.currentRuling(arbitrableTransaction.disputeId).call
    )

  return {
    ...arbitrableTransaction,
    ruling,
    appealable: disputeStatus === disputeConstants.APPEALABLE
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: id, amount } - The id of the arbitrableTx and the amount of the transaction.
 */
function* createPayOrReimburse({ type, payload: { id, amount } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  if (accounts[0] === arbitrableTransaction.buyer)
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
  else
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

    return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id }))
}

/**
 * Raises dispute.
 * @param {object} { payload: id } - The id of the arbitrable transaction.
 */
function* createDispute({ payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const arbitratorEth = new web3.eth.Contract(
    arbitrator.abi,
    arbitrableTransaction.arbitrator // need to follow the arbitrator standard ERC 792
  )

  const arbitrationCost = yield call(
    arbitratorEth.methods.arbitrationCost('0x00').call
  )

  if (accounts[0] === arbitrableTransaction.buyer)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeByBuyer(
        id
      ).send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.buyerFee
      }
    )
  else
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeBySeller(
        id
      ).send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.sellerFee
      }
    )

  return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id }))
}

/**
 * Raises an appeal.
 * @param {object} { payload: id } - The id of the arbitrable transaction.
 */
function* createAppeal({ type, payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const arbitratorEth = new web3.eth.Contract(
    arbitrator.abi,
    arbitrableTransaction.arbitrator // need to follow the arbitrator standard ERC 792
  )

  const appealCost = yield call(
    arbitratorEth.methods.appealCost(arbitrableTransaction.disputeId, '0x00').call
  )

  yield call(
    arbitratorEth.methods.appeal(
      arbitrableTransaction.disputeId,
      '0x00'
    ).send,
    {
      from: accounts[0],
      value: appealCost
    }
  )
  
  return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id })) 
}

/**
 * Call if a party fails to pay the fee.
 * @param {object} { payload: id } - The arbitrabl transaction id of the contract.
 */
function* createTimeout({ type, payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  if (accounts[0] === arbitrableTransaction.buyer)
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutByBuyer(
        id
      ).send,
      {
        from: accounts[0],
        value: 0
      }
    )
  else
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutBySeller(
        id
      ).send,
      {
        from: accounts[0],
        value: 0
      }
    )

  return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id }))
}

/**
 * Send evidence
 * @param {object} { type, payload: evidenceReceived,  } - Evidence.
 */
function* createEvidence({ type, payload: { evidenceReceived, arbitrableTransactionId } }) {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  console.log('evidenceReceived', evidenceReceived)
  console.log('arbitrableTransactionId', arbitrableTransactionId)


  let ipfsHashMetaEvidence = null

    const data = yield call(
      getBase64,
      evidenceReceived.file
    )

    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = yield call(
      ipfsPublish,
      data
    )

    // Pass IPFS path for URI. No need for fileHash
    const evidence = {
      fileURI: `/ipfs/${fileIpfsHash[0].hash}`,
      name: evidenceReceived.name,
      description: evidenceReceived.description
    }

  // Upload the meta-evidence to IPFS
  const ipfsHashMetaEvidenceObj = yield call(ipfsPublish, JSON.stringify(evidence))
  ipfsHashMetaEvidence = ipfsHashMetaEvidenceObj[0].hash

  console.log('ipfsHashMetaEvidence',ipfsHashMetaEvidence)

  let txHash

  try {
  txHash = yield call(
    multipleArbitrableTransactionEth.methods.submitEvidence(
      arbitrableTransactionId, // force id to be a string
      `/ipfs/${ipfsHashMetaEvidence}`
    ).send,
    {
      from: accounts[0],
      value: 0
    }
  )
  } catch (err) {
    console.log(err)
  }

  if (txHash)
    navigate(evidenceReceived.arbitrableTransactionId)

  return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id: arbitrableTransactionId }))
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
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
