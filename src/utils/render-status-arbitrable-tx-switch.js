import React from 'react'

import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import PayOrReimburseArbitrableTx from '../components/pay-or-reimburse-arbitrable-tx'
import PayFeeArbitrableTx from '../components/pay-fee-arbitrable-tx'
import TimeoutArbitrableTx from '../components/timeout-arbitrable-tx'
import NewEvidenceArbitrableTx from '../components/new-evidence-arbitrable-tx'

export default (
  accounts, 
  arbitrabletx,
  payOrReimburse,
  createPayOrReimburse,
  amount,
  createDispute,
  createTimeout,
  createEvidence
) => {
  switch(arbitrabletx.data.status) {
    case arbitrableTxConstants.WAITING_BUYER:
      return <PayFeeArbitrableTx
        id={arbitrabletx.data.id}
        payFee={createDispute}
      />
    case arbitrableTxConstants.WAITING_SELLER:
      return <PayFeeArbitrableTx
        id={arbitrabletx.data.id}
        payFee={createDispute}
      />
    case arbitrableTxConstants.DISPUTE_CREATED:
      return (
        <div>
          {
            isTimeout(arbitrabletx) && 
            <TimeoutArbitrableTx
                id={arbitrabletx.data.id}
                timeout={createTimeout}
            />
          }
          <NewEvidenceArbitrableTx
          id={arbitrabletx.data.id}
          submitEvidence={createEvidence}
          />
        </div>
      )
    case arbitrableTxConstants.DISPUTE_RESOLVED:
      return <div>{arbitrabletx.data.ruling}</div>
    default:
      return <PayOrReimburseArbitrableTx
        payOrReimburse={payOrReimburse}
        payOrReimburseFn={createPayOrReimburse}
        amount={amount}
        id={arbitrabletx.data.id}
      />
  }
}

const isTimeout = arbitrabletx => {
  const timeout = arbitrabletx.data.lastInteraction + arbitrabletx.data.timeout
  const dateTime = (Date.now() / 1000) | 0
  return dateTime > timeout
}