import React from 'react'
import { ClimbingBoxLoader } from 'react-spinners'

import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import PayOrReimburseArbitrableTx from '../components/pay-or-reimburse-arbitrable-tx'
import PayFeeArbitrableTx from '../components/pay-fee-arbitrable-tx'
import TimeoutArbitrableTx from '../components/timeout-arbitrable-tx'
import NewEvidenceArbitrableTx from '../components/new-evidence-arbitrable-tx'
import ResumeArbitrableTx from '../components/resume-arbitrable-tx'
import DisputeArbitrableTx from '../components/dispute-arbitrable-tx'
import SuccessArbitrableTx from '../components/success-arbitrable-tx'
import Button from '../components/button'
import { ReactComponent as Dispute } from '../assets/dispute.svg'
import { ReactComponent as Time } from '../assets/time.svg'

export default (
  accounts, 
  arbitrabletx,
  payOrReimburse,
  createPayOrReimburse,
  createDispute,
  createTimeout,
  createEvidence,
  createAppeal
) => {
  switch(arbitrabletx.data.status) {
    case arbitrableTxConstants.NO_DISPUTE:
      return (
        <React.Fragment>
          {
            arbitrabletx.data.amount === '0' ? (
              <ResumeArbitrableTx
                arbitrabletx={arbitrabletx.data}
                title={<React.Fragment>Transaction completed</React.Fragment>}
                footer={
                  <SuccessArbitrableTx
                    message={<p>Transaction completed <b>with success</b>.</p>}
                  />
                }
              />
            ) : (
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
            )
          }
        </React.Fragment>
      )
    case arbitrableTxConstants.WAITING_BUYER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
        arbitrabletx={arbitrabletx.data}
        title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />The buyer has raised a dispute</React.Fragment>}
        footer={
          <MessageArbitrationFee
            arbitrabletx={arbitrabletx}
            createDispute={createDispute}
          />
        }
      />
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment><Time style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />Waiting the arbitration fee from the buyer</React.Fragment>}
        >
          {
            isTimeout(arbitrabletx) &&
            <TimeoutArbitrableTx
                id={arbitrabletx.data.id}
                timeout={createTimeout}
            />
          }
        </ResumeArbitrableTx>
      )
    case arbitrableTxConstants.WAITING_SELLER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />The buyer has raised a dispute</React.Fragment>}
          footer={
            <MessageArbitrationFee 
              arbitrabletx={arbitrabletx}
              createDispute={createDispute}
            />
          }
        />
      ) : (
        <React.Fragment>
          {
            isTimeout(arbitrabletx) ? (
              <ResumeArbitrableTx
                arbitrabletx={arbitrabletx.data}
                title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />Claim the Payment</React.Fragment>}
              >
                <TimeoutArbitrableTx
                    id={arbitrabletx.data.id}
                    timeout={createTimeout}
                    name={accounts[0] === arbitrabletx.data.buyer ? 'Withdraw' : 'Execute Payment' }
                />
              </ResumeArbitrableTx>
            ) : (
              <ResumeArbitrableTx
                arbitrabletx={arbitrabletx.data}
                title={<React.Fragment><Time style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />Waiting the arbitration fee from the seller</React.Fragment>}
              />
            )
          }
        </React.Fragment>
      )
    case arbitrableTxConstants.DISPUTE_CREATED:
      return (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Dispute Ongoing</React.Fragment>}
          footer={
            <NewEvidenceArbitrableTx
              id={arbitrabletx.data.id}
              submitEvidence={createEvidence}
            />
          }
        />
      )
    case arbitrableTxConstants.DISPUTE_RESOLVED:
      return (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Resume</React.Fragment>}
        >
          <DisputeArbitrableTx
            message={
              <React.Fragment>
                {arbitrabletx.data.ruling === '0' && <p>Jurors refused to vote</p>}
                {arbitrabletx.data.ruling === '1' && accounts[0] === arbitrabletx.data.buyer ? (
                  <p>Congratulations! The jurors have decided <b>in your favour</b>.</p>
                ) : (
                  <p>The jurors decided <b>against you</b>.</p>
                )}
                {arbitrabletx.data.appealable === true && (
                  <Button onClick={() => createAppeal(arbitrabletx.data.id)}>Appeal the decision</Button>
                )}
              </React.Fragment>
            }
          />
        </ResumeArbitrableTx>
      )
    default:
      return (
        <ClimbingBoxLoader />
      )
  }
}

const isTimeout = arbitrabletx => {
  const timeout = Number(arbitrabletx.data.lastInteraction) + Number(arbitrabletx.data.timeout)
  const dateTime = Date.now() / 1000 | 0
  return dateTime > timeout
}

const isFeePaid = arbitrabletx => arbitrabletx.data[`${arbitrabletx.data.party}Fee`] > 0

const MessageArbitrationFee = ({arbitrabletx, createDispute}) => (
  <DisputeArbitrableTx
    message={
      <React.Fragment>
        <p>
          In order to not forfeit the dispute <b style={{fontWeight: 'bold'}}>pay the arbitration fee</b>. 
          <br />You will be refunded the fee if you win the dispute.
        </p>
        <Button onClick={() => createDispute(arbitrabletx.data.id)}>Raise a dispute</Button>
      </React.Fragment>
    }
  />
)