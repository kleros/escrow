import { createActions } from 'lessdux'

/* Actions */

// Arbitrable Transactions
export const arbitrabletxs = createActions('ARBITRABLETXS')

// Arbitrable Transaction
export const arbitrabletx = {
  ...createActions('ARBITRABLETX', {
    withCreate: true
  }),
  FORM: 'FORM_ARBITRABLETX',
  RESUMEFORM: 'RESUMEFORM_ARBITRABLETX'
}

// MetaEvidence
export const metaevidence = createActions('METAEVIDENCE')

// Dispute
export const dispute = {
  ...createActions('DISPUTE', {
    withCreate: true
  })
}

// Pay
export const pay = {
  ...createActions('PAY', {
    withCreate: true
  })
}

// Reimburse
export const reimburse = {
  ...createActions('REIMBURSE', {
    withCreate: true
  })
}

// Tiemout
export const timeout = {
  ...createActions('TIMEOUT', {
    withCreate: true
  })
}

// Evidence
export const evidence = {
  ...createActions('EVIDENCE', {
    withCreate: true
  })
}

// Appeal
export const appeal = {
  ...createActions('APPEAL', {
    withCreate: true
  })
}

/* Action Creators */

// Arbitrable Transactions
export const fetchArbitrabletxs = () => ({ type: arbitrabletxs.FETCH })

// Arbitrable Transaction
export const formArbitrabletx = arbitrabletxForm => ({
  type: arbitrabletx.FORM,
  payload: { arbitrabletxForm }
})

export const createArbitrabletx = (arbitrabletxReceived, metaEvidenceIPFSHash) => ({
  type: arbitrabletx.CREATE,
  payload: { arbitrabletxReceived, metaEvidenceIPFSHash }
})

export const fetchArbitrabletx = id => ({
  type: arbitrabletx.FETCH,
  payload: { id }
})

// MetaEvidence
export const fetchMetaEvidence = metaEvidenceIPFSHash => ({
  type: metaevidence.FETCH,
  payload: { metaEvidenceIPFSHash }
})

// Dispute
export const createDispute = id => ({
  type: dispute.CREATE,
  payload: { id }
})

// Pay
export const createPayOrReimburse = (id, amount) => ({
  type: pay.CREATE,
  payload: { id, amount }
})

// Tiemout
export const createTimeout = id => ({
  type: timeout.CREATE,
  payload: { id }
})

// Evidence
export const createEvidence = (evidenceReceived, arbitrableTransactionId) => ({
  type: evidence.CREATE,
  payload: { evidenceReceived, arbitrableTransactionId }
})

// Appeal
export const createAppeal = id => ({
  type: appeal.CREATE,
  payload: { id }
})