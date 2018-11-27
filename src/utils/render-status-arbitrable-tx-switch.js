import React from 'react'
import { ClimbingBoxLoader } from 'react-spinners'

import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import PayOrReimburseArbitrableTx from '../components/pay-or-reimburse-arbitrable-tx'
import PayFeeArbitrableTx from '../components/pay-fee-arbitrable-tx'
import TimeoutArbitrableTx from '../components/timeout-arbitrable-tx'
import NewEvidenceArbitrableTx from '../components/new-evidence-arbitrable-tx'
import ResumeArbitrableTx from '../components/resume-arbitrable-tx'
import Button from '../components/button'

export default (
  accounts, 
  arbitrabletx,
  payOrReimburse,
  createPayOrReimburse,
  createDispute,
  createTimeout,
  createEvidence
) => {
  switch(arbitrabletx.data.status) {
    case arbitrableTxConstants.NO_DISPUTE:
      return <React.Fragment>
        {
          arbitrabletx.data.amount > 0 ? (
            <ResumeArbitrableTx
              arbitrabletx={arbitrabletx.data}
              title={<React.Fragment>Resume</React.Fragment>}
            >
              <Button onClick={() => createDispute(arbitrabletx.data.id)}>Raise a dispute</Button>
              <span style={{fontSize: '0.9em', padding: '0 2em', color: '#4a4a4a'}}>Or</span>
              <PayOrReimburseArbitrableTx
                payOrReimburse={payOrReimburse}
                payOrReimburseFn={createPayOrReimburse}
                amount={arbitrabletx.data.amount}
                id={arbitrabletx.data.id}
              />
            </ResumeArbitrableTx>
          ) : (
            <ResumeArbitrableTx
              arbitrabletx={arbitrabletx.data}
              title={<React.Fragment>Resume</React.Fragment>}
            >
              <div>Transaction completed</div>
            </ResumeArbitrableTx>
          )
        }
      </React.Fragment>
    case arbitrableTxConstants.WAITING_BUYER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Resume</React.Fragment>}
        >
          <MessageSellerArbitrationFee 
            arbitrabletx={arbitrabletx}
            createDispute={createDispute}
          />
        </ResumeArbitrableTx>
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Waiting the arbitration fee from the buyer</React.Fragment>}
        />
      )
    case arbitrableTxConstants.WAITING_SELLER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Resume</React.Fragment>}
        >
          <MessageSellerArbitrationFee 
            arbitrabletx={arbitrabletx}
            createDispute={createDispute}
          />
        </ResumeArbitrableTx>
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Waiting the arbitration fee from the seller</React.Fragment>}
        />
      )
    case arbitrableTxConstants.DISPUTE_CREATED:
      return (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Resume</React.Fragment>}
        >
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
        </ResumeArbitrableTx>
      )
    case arbitrableTxConstants.DISPUTE_RESOLVED:
      return (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Resume</React.Fragment>}
        >
          {arbitrabletx.data.ruling === '0' && 'No ruling.'}
          {arbitrabletx.data.ruling === '1' && 'Buyer wins the current dispute.'}
          {arbitrabletx.data.ruling === '2' && 'Seller wins the current dispute.'}
        </ResumeArbitrableTx>
      )
    default:
      return (
        <ClimbingBoxLoader />
      )
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