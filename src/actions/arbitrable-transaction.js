import { createActions } from 'lessdux'

/* Actions */

// Arbitrator
export const arbitrator = createActions('ARBITRATOR')

// Arbitrable Transactions
export const arbitrabletxs = createActions('ARBITRABLETXS')

// Arbitrable Transaction
export const arbitrabletx = {
  ...createActions('ARBITRABLETX', {
    withCreate: true
  })
}

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

// Arbitrator
export const fetchArbitrator = () => ({
  type: arbitrator.FETCH
})

// Arbitrable Transactions
export const fetchArbitrabletxs = () => ({ type: arbitrabletxs.FETCH })

// Arbitrable Transaction
export const createArbitrabletx = arbitrabletxReceived => ({
  type: arbitrabletx.CREATE,
  payload: { arbitrabletxReceived }
})

export const fetchArbitrabletx = id => ({
  type: arbitrabletx.FETCH,
  payload: { id }
})

// Dispute
export const fetchDispute = disputeId => ({
  type: dispute.FETCH,
  payload: { disputeId }
})

export const createDispute = id => ({
  type: dispute.CREATE,
  payload: { id }
})

// Pay
export const createPay = (id, amount) => ({
  type: pay.CREATE,
  payload: { id, amount }
})

// Reimburse
export const createReimburse = (id, amount) => ({
  type: reimburse.CREATE,
  payload: { id, amount }
})

// Tiemout
export const createTimeout = (id, buyer, seller) => ({
  type: timeout.CREATE,
  payload: { id, buyer, seller }
})

// Evidence
export const createEvidence = evidenceReceived => ({
  type: evidence.CREATE,
  payload: { evidenceReceived }
})

// Appeal
export const createAppeal = (id, disputeId) => ({
  type: appeal.CREATE,
  payload: { id, disputeId }
})