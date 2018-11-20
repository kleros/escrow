import { call, put, takeLatest } from 'redux-saga/effects'
import Archon from '@kleros/archon'

import {
  web3,
  ARBITRATOR_ADDRESS,
  ARBITRABLE_ADDRESS,
  multipleArbitrableTransactionEth
} from '../bootstrap/dapp-api'
import * as arbitrabletxActions from '../actions/arbitrable-transaction'
import * as errorConstants from '../constants/error'
import { lessduxSaga } from '../utils/saga'
// import { createMetaEvidence } from '../utils/arbitrable-tx'
import { getBase64 } from '../utils/get-base-64'
// import awaitTx from '../utils/await-tx'

// import storeApi from './api/store'

/**
 * Creates a new arbitrableTx.
 * @param {object} { payload: arbitrableTxReceived } - The arbitrable transaction to create.
 */
function* createArbitrabletx({ type, payload: { arbitrableTxReceived } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let arbitrableTransactionCount
  let fileAgreement = {
    payload: {
      fileURL: ''
    }
  }
  let fileHash = ''

  try {
    // if (arbitrableTxReceived.fileAgreement) {
    //   const data = yield call(
    //     getBase64,
    //     arbitrableTxReceived.fileAgreement[0]
    //   )
    //   // Upload the meta-evidence then return an url
    //   fileAgreement = yield call(
    //     storeApi.postFile,
    //     data,
    //     arbitrableTxReceived.fileAgreement[0].name.split('.').pop()
    //   )
    //   const ArchonInstance = new Archon(web3.currentProvider)
    //   fileHash = ArchonInstance.utils.multihashFile(
    //     data,
    //     0x1B // keccak-256
    //   )
    // }

    // const metaEvidence = createMetaEvidence(
    //   accounts[0],
    //   arbitrableTxReceived.partyB,
    //   arbitrableTxReceived.title,
    //   arbitrableTxReceived.description,
    //   fileAgreement.payload.fileURL.replace(/\.[^/.]+$/, ''),
    //   arbitrableTxReceived.fileAgreement[0].name.split('.').pop(),
    //   fileHash
    // )

    // Upload the meta-evidence then return an url
    // const file = yield call(storeApi.postFile, JSON.stringify(metaEvidence))

    // Set arbitrableTx instance
    // yield call(kleros.arbitrable.setarbitrableTxInstance, ARBITRABLE_ADDRESS)

    arbitrableTransactionCount = yield call(
      multipleArbitrableTransactionEth.methods.getCountTransactions().call
    )

    // const txHash = yield call(
    //   kleros.arbitrable.createArbitrableTransaction,
    //   accounts[0],
    //   arbitrableTxReceived.arbitrator || ARBITRATOR_ADDRESS,
    //   arbitrableTxReceived.partyB,
    //   // TODO use web3.utils
    //   unit.toWei(arbitrableTxReceived.payment, 'ether'),
    //   undefined,
    //   process.env.REACT_APP_ARBITRATOR_EXTRADATA,
    //   file.payload.fileURL
    // )

    // const txReceipt = yield call(awaitTx, web3, txHash.tx)

    // if (txReceipt) {
    //   localStorage.setItem(
    //     'arbitrableTransaction',
    //     JSON.stringify({
    //       buyer: accounts[0],
    //       seller: arbitrableTxReceived.partyB,
    //       amount: arbitrableTxReceived.payment,
    //       arbitrator: arbitrableTxReceived.arbitrator || ARBITRATOR_ADDRESS,
    //       metaEvidence
    //     })
    //   )

      // use navigate
      //   yield put(push(`/arbitrableTxs/${arbitrableTransactionCount}`))
    // }
  } catch (err) {
    console.log(err)
  }
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
  // force convert to string
  const transactionId = id.toString()
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let arbitrableTransaction
  let ruling = null
  let currentSession = null
  let disputeData = null
  let canAppeal = null



  try {
    arbitrableTransaction = yield call(
        multipleArbitrableTransactionEth.methods.transactions(transactionId).call
    )

    arbitrableTransaction.id = id

    // disputeData = yield call(
    //   kleros.arbitrator.getDispute,
    //   arbitrableTransaction.disputeId
    // )

    // if (arbitrableTransaction.status === 4)
    //   ruling = yield call(
    //     kleros.arbitrator.currentRulingForDispute,
    //     arbitrableTransaction.disputeId
    //   )

    // currentSession = yield call(kleros.arbitrator.getSession)
  } catch (err) {
    console.log(err)
  }

//   if (disputeData) {
//     canAppeal =
//       disputeData.firstSession + disputeData.numberOfAppeals === currentSession
//   } else {
//     canAppeal = false
//   }

  return {
    ...arbitrableTransaction
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: arbitrableTransactionId, amount } - The id of the arbitrableTx and the amount of the transaction.
 */
function* createPay({ type, payload: { arbitrableTransactionId, amount } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set arbitrable transaction instance
//   yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let payTx = null

  try {
    // const arbitrableTransaction = yield call(
    //   kleros.arbitrable.getData,
    //   arbitrableTransactionId
    // )

    // if (arbitrableTransaction.amount === 0)
    //   throw new Error('The dispute is already finished')

    // if (amount == 0) 
    //   amount = arbitrableTransaction.amount

    // payTx = yield call(
    //   kleros.arbitrable.pay,
    //   accounts[0],
    //   arbitrableTransactionId,
    //   amount
    // )

    // const txReceipt = yield call(awaitTx, web3, payTx.tx)

    // if (txReceipt) {
    //     // use navigate()
    //     //   yield put(push(`/`))
    // }
  } catch (err) {
    console.log(err)
    throw new Error('Error pay transaction')
  }

  return payTx
}

/**
 * Reimburse party A. To be called if the good or service can't be fully provided.
 * @param {object} { payload: arbitrableTransactionId, amount } - The id of the arbitrable transaction.
 */
function* createReimburse({ type, payload: { arbitrableTransactionId, amount } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set arbitrable transaction instance
//   yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let reimburseTx = ''

  try {
    // const arbitrableTransaction = yield call(
    //   kleros.arbitrable.getData,
    //   arbitrableTransactionId
    // )

    // if (arbitrableTransaction.amount === 0)
    //   throw new Error('The dispute is already finished')

    // reimburseTx = yield call(
    //   kleros.arbitrable.reimburse,
    //   accounts[0],
    //   arbitrableTransactionId,
    //   amount
    // )

    // const txReceipt = yield call(awaitTx, web3, reimburseTx.tx)

    // if (txReceipt) {
    // //   yield put(push(`/`))
    // //   yield call(toastr.success, 'Successful refund', toastrOptions)
    // }
  } catch (err) {
    console.log(err)
    throw new Error('Error reimburse failed')
  }

  return reimburseTx
}

/**
 * Raises dispute.
 * @param {object} { payload: id } - The id of the arbitrable transaction.
 */
function* createDispute({ payload: { id } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
//   yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let disputeTx = ''

  try {
    // const arbitrableTransaction = yield call(
    //   kleros.arbitrable.getData,
    //   arbitrableTransactionId
    // )

    // let fee
    // if (arbitrableTransaction.buyer === accounts[0].toLowerCase())
    //   fee = arbitrableTransaction.buyerFee
    // if (arbitrableTransaction.seller === accounts[0].toLowerCase())
    //   fee = arbitrableTransaction.sellerFee

    // const arbitrationCost = yield call(
    //   kleros.arbitrator.getArbitrationCost,
    //   arbitrableTransaction.arbitratorExtraData
    // )

    // const cost = arbitrationCost - fee

    // if (accounts[0].toLowerCase() === arbitrableTransaction.buyer) {
    //   disputeTx = yield call(
    //     kleros.arbitrable.payArbitrationFeeByBuyer,
    //     accounts[0],
    //     arbitrableTransactionId,
    //     cost
    //   )
    // } else if (accounts[0].toLowerCase() === arbitrableTransaction.seller) {
    //   disputeTx = yield call(
    //     kleros.arbitrable.payArbitrationFeeBySeller,
    //     accounts[0],
    //     arbitrableTransactionId,
    //     cost
    //   )
    // }
  } catch (err) {
    console.log(err)
    throw new Error('Error create dispute failed')
  }

//   yield put(push('/'))
//   yield call(toastr.success, 'Dispute creation successful', toastrOptions)

  return disputeTx
}

/**
 * Raises an appeal.
 * @param {object} { payload: arbitrableTransactionId } - The id of the arbitrable transaction.
 */
function* createAppeal({ type, payload: { arbitrableTransactionId, disputeId } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
//   yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

  let raiseAppealByPartyATxObj

  try {
    // Set contract instance
    // const arbitrableTransaction = yield call(
    //   kleros.arbitrable.getData,
    //   arbitrableTransactionId
    // )

    // const appealCost = yield call(
    //   kleros.arbitrator.getAppealCost,
    //   disputeId,
    //   arbitrableTransactionId.arbitratorExtraData
    // )

    // // raise appeal party A
    // raiseAppealByPartyATxObj = yield call(
    //   kleros.arbitrable.appeal,
    //   accounts[0],
    //   arbitrableTransactionId,
    //   arbitrableTransaction.arbitratorExtraData,
    //   appealCost
    // )
  } catch (err) {
    console.log(err)
    throw new Error('Error create appeal failed')
  }

//   yield put(push('/'))
//   yield call(toastr.success, 'Appeal creation successful', toastrOptions)

  return raiseAppealByPartyATxObj
}

/**
 * Call by PartyA to be to reimburse if partyB fails to pay the fee.
 * @param {object} { payload: contractAddress, partyA, partyB } - The address of the contract.
 */
function* createTimeout({
  type,
  payload: { arbitrableTransactionId, buyer, seller }
}) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  // Set contract instance
//   yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

//   yield put(push('/'))

  let timeoutTx = null

  try {
    // Set contract instance
    // const arbitrableTransaction = yield call(
    //   kleros.arbitrable.getData,
    //   arbitrableTransactionId
    // )

    // if (arbitrableTransaction.amount === 0)
    //   throw new Error('The dispute is already finished')

    // if (buyer === accounts[0].toLowerCase()) {
    //   timeoutTx = yield call(
    //     kleros.arbitrable.callTimeOutBuyer,
    //     accounts[0],
    //     arbitrableTransactionId
    //   )
    // } else if (seller === accounts[0].toLowerCase()) {
    //   timeoutTx = yield call(
    //     kleros.arbitrable.callTimeOutSeller,
    //     accounts[0],
    //     arbitrableTransactionId
    //   )
    // }
  } catch (err) {
    console.log(err)
    throw new Error('Error timeout failed')
  }

  //   yield call(toastr.success, 'Timeout successful', toastrOptions)

  return timeoutTx
}

/**
 * Send evidence
 * @param {object} { type, payload: evidenceReceived } - Evidence.
 */
function* createEvidence({ type, payload: { evidenceReceived } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let evidenceTx = null

  // field to upload directly evidence

  try {
    // Upload the evidence then return an url
    // const file = yield call(
    //   storeApi.postFile,
    //   JSON.stringify({
    //     name: evidenceReceived.name,
    //     description: evidenceReceived.description,
    //     fileURI: evidenceReceived.url
    //   })
    // )

    // // Set contract instance
    // yield call(kleros.arbitrable.setContractInstance, ARBITRABLE_ADDRESS)

    // evidenceTx = yield call(
    //   multipleArbitrableTransactionEth.methods.submitEvidence(
    //     evidenceReceived.arbitrableTransactionId,
    //     file.payload.fileURL
    //   ).send,
    //   {
    //     from: accounts[0],
    //     value: 0
    //   }
    // )
  } catch (err) {
    console.log(err)
    throw new Error('Error evidence creation failed')
  }

  //   yield call(toastr.success, 'Evidence creation successful', toastrOptions)

  return evidenceTx
}

/**
 * Fetches dispute details.
 * @param {object} { payload: disouteId } - The dispute id to fetch details for.
 */
function* fetchDispute({ payload: { disputeId } }) {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  let dispute = null

  try {
    // dispute = yield call(kleros.arbitrator.getDispute, disputeId)
  } catch (err) {
    console.log(err)
  }

  return dispute
}

/**
 * Fetches the arbitrator's data.
 */
export function* fetchArbitratorData() {
//   const arbitratorData = yield call(kleros.arbitrator.getData)

//   return arbitratorData
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(
    arbitrabletxActions.arbitrator.FETCH,
    lessduxSaga,
    'fetch',
    arbitrabletxActions.arbitrator,
    fetchArbitratorData
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
    arbitrabletxActions.dispute.FETCH,
    lessduxSaga,
    'fetch',
    arbitrabletxActions.dispute,
    fetchDispute
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
    createPay
  )
  yield takeLatest(
    arbitrabletxActions.reimburse.CREATE,
    lessduxSaga,
    'create',
    arbitrabletxActions.reimburse,
    createReimburse
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