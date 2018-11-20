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
export const createArbitrabletx = ArbitrableTxReceived => ({
  type: arbitrabletx.CREATE,
  payload: { ArbitrableTxReceived }
})

export const fetchArbitrabletx = arbitrableTransactionId => ({
  type: arbitrabletx.FETCH,
  payload: { arbitrableTransactionId }
})

// Dispute
export const fetchDispute = disputeId => ({
  type: dispute.FETCH,
  payload: { disputeId }
})

export const createDispute = arbitrableTransactionId => ({
  type: dispute.CREATE,
  payload: { arbitrableTransactionId }
})

// Pay
export const createPay = (arbitrableTransactionId, amount) => ({
  type: pay.CREATE,
  payload: { arbitrableTransactionId, amount }
})

// Reimburse
export const createReimburse = (arbitrableTransactionId, amount) => ({
  type: reimburse.CREATE,
  payload: { arbitrableTransactionId, amount }
})

// Tiemout
export const createTimeout = (arbitrableTransactionId, buyer, seller) => ({
  type: timeout.CREATE,
  payload: { arbitrableTransactionId, buyer, seller }
})

// Evidence
export const createEvidence = evidenceReceived => ({
  type: evidence.CREATE,
  payload: { evidenceReceived }
})

// Appeal
export const createAppeal = (arbitrableTransactionId, disputeId) => ({
  type: appeal.CREATE,
  payload: { arbitrableTransactionId, disputeId }
})