import { call, put, takeLatest } from 'redux-saga/effects'
import { navigate } from '@reach/router'
import Archon from '@kleros/archon'

import {
  web3,
  multipleArbitrableTransactionEth,
  arbitratorEth,
  getNetwork,
  ARBITRABLE_ADDRESS,
  ARBITRATOR_ADDRESS,
  FEE_TIMEOUT
} from '../bootstrap/dapp-api'
import * as arbitrabletxActions from '../actions/arbitrable-transaction'
import * as errorConstants from '../constants/error'
import * as disputeConstants from '../constants/dispute'
import { action } from '../utils/action'
import { lessduxSaga } from '../utils/saga'
import readFile from '../utils/read-file'
import createMetaEvidence from '../utils/generate-meta-evidence'
import getStatusArbitrable from '../utils/get-status-arbitrable'

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

  if (arbitrabletxForm.file) {
    const data = yield call(
      readFile,
      arbitrabletxForm.file.dataURL
    )
    // Upload the meta-evidence then return an ipfs hash
    const fileIpfsHash = yield call(
      ipfsPublish,
      arbitrabletxForm.file.name,
      data
    )

    // Pass IPFS path for URI. No need for fileHash
    metaEvidence = createMetaEvidence({
      receiver: accounts[0],
      sender: arbitrabletxForm.sender,
      title: arbitrabletxForm.title,
      description: arbitrabletxForm.description,
      fileURI: `/ipfs/${fileIpfsHash[1].hash}${fileIpfsHash[0].path}`,
      amount: arbitrabletxForm.amount,
      arbitrator: ARBITRATOR_ADDRESS
    })
  } else {
    metaEvidence = createMetaEvidence({
      receiver: accounts[0],
      sender: arbitrabletxForm.sender,
      title: arbitrabletxForm.title,
      description: arbitrabletxForm.description,
      amount: arbitrabletxForm.amount,
      arbitrator: ARBITRATOR_ADDRESS
    })
  }

  const enc = new TextEncoder()

  // Upload the meta-evidence to IPFS
  const ipfsHashMetaEvidenceObj = yield call(
    ipfsPublish,
    'metaEvidence.json',
    enc.encode(JSON.stringify(metaEvidence))
  )

  navigate(`/resume/${ipfsHashMetaEvidenceObj[1].hash}`)

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
  const metaEvidence = yield call(
    getMetaEvidence.getFile,
    metaEvidenceIPFSHash
  )

  const metaEvidenceDecoded = JSON.parse(JSON.stringify(metaEvidence))

  const parties = Object.assign({}, ...Object.entries(metaEvidenceDecoded.aliases).map(([a,b]) => ({ [b]: a })))

  return yield put(action(arbitrabletxActions.arbitrabletx.RESUMEFORM,
    {
      arbitrabletxResumeForm: {
        title: metaEvidenceDecoded.title,
        description: metaEvidenceDecoded.description,
        sender: parties['Party B'],
        otherParty: 'Sender',
        otherPartyAddress: parties['Party B'],
        amount: metaEvidenceDecoded.amount,
        file: metaEvidenceDecoded.fileURI ? `https://ipfs.kleros.io${metaEvidenceDecoded.fileURI}` : null,
        arbitrator: metaEvidenceDecoded.arbitrator,
        shareLink: `https://escrow.kleros.io/resume/${metaEvidenceIPFSHash}`
      }
    }
  ))
}

/**
 * Creates a new arbitrableTx.
 * @param {object} { payload: arbitrabletxReceived } - The arbitrable transaction to create.
 */
function* createArbitrabletx({ payload: { arbitrabletxReceived, metaEvidenceIPFSHash } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransactionCount = yield call(
    multipleArbitrableTransactionEth.methods.getCountTransactions().call
  )

  const txHash = yield call(
    multipleArbitrableTransactionEth.methods.createTransaction(
      FEE_TIMEOUT,
      arbitrabletxReceived.sender,
      `/ipfs/${metaEvidenceIPFSHash}/metaEvidence.json`
    ).send,
    {
      from: accounts[0],
      value: web3.utils.toWei(arbitrabletxReceived.amount, 'ether')
    }
  )

  if (txHash)
    navigate(`/${arbitrableTransactionCount}`)

  return {}
}

/**
 * Fetches arbitrableTxs for the current user and puts them in the store.
 */
function* fetchArbitrabletxs() {
  if (window.ethereum) yield call(window.ethereum.enable)
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)
  // initialize Archon
  const network = yield call(getNetwork)
  const archon = new Archon(
    `https://${network.toLowerCase()}.infura.io`,
    'https://ipfs.kleros.io'
  )

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

    let metaEvidence
    try {
      // Use arbitrableTransactionId as metaEvidenceID
      metaEvidence = yield call(
        archon.arbitrable.getMetaEvidence,
        ARBITRABLE_ADDRESS,
        arbitrableTransactionId
      )

      arbitrableTransaction.metaEvidence = metaEvidence.metaEvidenceJSON || {}
      arbitrableTransaction.id = arbitrableTransactionId
      arbitrableTransaction.party = accounts[0] === arbitrableTransaction.receiver ? 'receiver' : 'sender'
      arbitrableTransaction.otherParty = accounts[0] === arbitrableTransaction.receiver ? 'sender' : 'receiver'
      arbitrableTransaction.originalAmount = web3.utils.toWei(metaEvidence.metaEvidenceJSON.amount, 'ether').toString()
      arbitrableTransaction.detailsStatus = getStatusArbitrable({accounts, arbitrabletx: arbitrableTransaction})

      arbitrableTransactions.push(arbitrableTransaction)
    } catch (err) {
      console.error(err)
      continue
    }
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
  let disputeStatus = null
  let metaEvidenceArchon = {
    metaEvidenceJSON: {}
  }
  let appealDecision = false

  // force convert to string
  const transactionId = id.toString()

  arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(transactionId).call
  )

  arbitrableTransaction.id = id
  arbitrableTransaction.evidences = null

  arbitrableTransaction.amount = web3.utils.fromWei(arbitrableTransaction.amount.toString(), 'ether')

  try {
    const network = yield call(getNetwork)
    const archon = new Archon(
      `https://${network.toLowerCase()}.infura.io`,
      'https://ipfs.kleros.io'
    )

    metaEvidenceArchon = yield call(
      archon.arbitrable.getMetaEvidence,
      ARBITRABLE_ADDRESS,
      transactionId
    )

    if (metaEvidenceArchon.metaEvidenceJSON.fileURI)
      arbitrableTransaction.file = `https://ipfs.kleros.io${metaEvidenceArchon.metaEvidenceJSON.fileURI}`

    if (arbitrableTransaction.disputeId) {
      const metaEvidenceArchonEvidences = yield call(
        archon.arbitrable.getEvidence,
        ARBITRABLE_ADDRESS,
        ARBITRATOR_ADDRESS,
        arbitrableTransaction.disputeId
      )

      if (metaEvidenceArchonEvidences.length > 0)
        arbitrableTransaction.evidences = metaEvidenceArchonEvidences
    }

    arbitrableTransaction.otherParty = accounts[0] === arbitrableTransaction.receiver ? 'sender' : 'receiver'
    arbitrableTransaction.otherPartyAddress = accounts[0] === arbitrableTransaction.receiver ?  arbitrableTransaction.receiver :  arbitrableTransaction.sender

    disputeStatus = yield call(
      arbitratorEth.methods.disputeStatus(arbitrableTransaction.disputeId).call
    )

    if (
      disputeStatus.toString() === disputeConstants.SOLVED.toString()
      || disputeStatus.toString() === disputeConstants.APPEALABLE.toString()
    ) {
      ruling = yield call(
        arbitratorEth.methods.currentRuling(arbitrableTransaction.disputeId).call
      )

      /* TODO returns value if if there is an appeal in progress */
      // const getAppealDecision = yield call(
      //   archon.arbitrator.getAppealDecision,
      //   ARBITRATOR_ADDRESS,
      //   disputeId, // The unique identifier of the dispute
      //   appealNumber // The appeal number. Must be >= 1
      // )
    }

  } catch (err) {
    console.log(err)
  }

  return {
    ...metaEvidenceArchon.metaEvidenceJSON,
    ...arbitrableTransaction, // Overwrite transaction.amount
    party: accounts[0] === arbitrableTransaction.receiver ? 'receiver' : 'sender',
    ruling,
    appealable: disputeStatus === disputeConstants.APPEALABLE.toString()
  }
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: id, amount } - The id of the arbitrableTx and the amount of the transaction.
 */
function* createPayOrReimburse({ payload: { id, amount } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  if (accounts[0] === arbitrableTransaction.receiver)
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
 * Transfer the transaction's amount to the sender if the timeout has passed.
 * @param {object} { payload: id } - The id of the arbitrableTx.
 */
function* executeTransaction({ payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  yield call(
    multipleArbitrableTransactionEth.methods.executeTransaction(
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
 * Raises dispute.
 * @param {object} { payload: id } - The id of the arbitrable transaction.
 */
function* createDispute({ payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
  )

  const arbitrationCost = yield call(
    arbitratorEth.methods.arbitrationCost('0x00').call
  )

  if (accounts[0] === arbitrableTransaction.receiver)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeByReceiver(
        id
      ).send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.receiverFee
      }
    )
  if (accounts[0] === arbitrableTransaction.sender)
    yield call(
      multipleArbitrableTransactionEth.methods.payArbitrationFeeBySender(
        id
      ).send,
      {
        from: accounts[0],
        value: arbitrationCost - arbitrableTransaction.senderFee
      }
    )

  return yield put(action(arbitrabletxActions.arbitrabletx.FETCH, { id }))
}

/**
 * Raises an appeal.
 * @param {object} { payload: id } - The id of the arbitrable transaction.
 */
function* createAppeal({ payload: { id } }) {
  const accounts = yield call(web3.eth.getAccounts)

  const arbitrableTransaction = yield call(
    multipleArbitrableTransactionEth.methods.transactions(id).call
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

  if (accounts[0] === arbitrableTransaction.receiver)
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutByReceiver(
        id
      ).send,
      {
        from: accounts[0],
        value: 0
      }
    )
  else
    yield call(
      multipleArbitrableTransactionEth.methods.timeOutBySender(
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

  let ipfsHashMetaEvidence = null
  let fileURI = ''

  if (evidenceReceived.file) {
    const data = yield call(
      readFile,
      evidenceReceived.file.dataURL
    )

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
  ipfsHashMetaEvidence = ipfsHashMetaEvidenceObj[1].hash + ipfsHashMetaEvidenceObj[0].path

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
