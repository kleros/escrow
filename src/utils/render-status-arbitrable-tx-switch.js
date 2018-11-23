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
    case arbitrableTxConstants.NO_DISPUTE:
      return <div>
        { 
          amount > 0 ? (
            <div>
              <PayOrReimburseArbitrableTx
                payOrReimburse={payOrReimburse}
                payOrReimburseFn={createPayOrReimburse}
                amount={amount}
                id={arbitrabletx.data.id}
              />
              <PayFeeArbitrableTx
                id={arbitrabletx.data.id}
                payFee={createDispute}
              />
            </div>
          ) : (
            <div>Transaction completed</div>
          )
        }
      </div>
    case arbitrableTxConstants.WAITING_BUYER:
      return !isFeePaid ? (
        <MessageSellerArbitrationFee 
          arbitrabletx={arbitrabletx}
          createDispute={createDispute}
        />
      ) : (
        <div>Waiting the arbitration fee from the buyer.</div>
      )
    case arbitrableTxConstants.WAITING_SELLER:
      return !isFeePaid ? (
        <MessageSellerArbitrationFee 
          arbitrabletx={arbitrabletx}
          createDispute={createDispute}
        />
      ) : (
        <div>Waiting the arbitration fee from the seller.</div>
      )
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
      return (
        <div>
          {arbitrabletx.data.ruling === '0' && 'No ruling.'}
          {arbitrabletx.data.ruling === '1' && 'Buyer wins the current dispute.'}
          {arbitrabletx.data.ruling === '2' && 'Seller wins the current dispute.'}
        </div>
      )
    default:
    return <div>Wainting Transaction...</div>
  }
}

const isTimeout = arbitrabletx => {
  const timeout = arbitrabletx.data.lastInteraction + arbitrabletx.data.timeout
  const dateTime = (Date.now() / 1000) | 0
  return dateTime > timeout
}

const isFeePaid = arbitrabletx => arbitrabletx.data[`${arbitrabletx.data.party}Fee`] > 0

const MessageSellerArbitrationFee = ({arbitrabletx, createDispute}) => (
  <React.Fragment>
    The other party has raised a dispute.<br />
    In order to not forfeit the dispute pay the arbitration
    fee. You will be refunded the fee if you win the
    dispute.
    <PayFeeArbitrableTx
      id={arbitrabletx.data.id}
      payFee={createDispute}
    />
  </React.Fragment>
)