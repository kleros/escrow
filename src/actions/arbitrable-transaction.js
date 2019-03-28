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

// Execute transaction
export const executetx = {
  ...createActions('EXECUTETX', {
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

export const fetchArbitrabletx = (arbitrable, id) => ({
  type: arbitrabletx.FETCH,
  payload: { arbitrable, id }
})

// MetaEvidence
export const fetchMetaEvidence = metaEvidenceIPFSHash => ({
  type: metaevidence.FETCH,
  payload: { metaEvidenceIPFSHash }
})

// Dispute
export const createDispute = (arbitrable, id) => ({
  type: dispute.CREATE,
  payload: { arbitrable, id }
})

// Pay
export const createPayOrReimburse = (arbitrable, id, amount) => ({
  type: pay.CREATE,
  payload: { arbitrable, id, amount }
})

// Execute transaction
export const createExecuteTx = (arbitrable, id) => ({
  type: executetx.CREATE,
  payload: { arbitrable, id }
})

// Tiemout
export const createTimeout = (arbitrable, id) => ({
  type: timeout.CREATE,
  payload: { arbitrable, id }
})

// Evidence
export const createEvidence = (evidenceReceived, arbitrable, arbitrableTransactionId) => ({
  type: evidence.CREATE,
  payload: { evidenceReceived, arbitrable, arbitrableTransactionId }
})

// Appeal
export const createAppeal = (arbitrable, id) => ({
  type: appeal.CREATE,
  payload: { arbitrable, id }
})