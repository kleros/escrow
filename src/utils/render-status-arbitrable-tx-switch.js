import React from 'react'
import { ClimbingBoxLoader } from 'react-spinners'
import { Formik, Form } from 'formik'

import { FEE_TIMEOUT } from '../bootstrap/dapp-api'
import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import PayOrReimburseArbitrableTx from '../components/pay-or-reimburse-arbitrable-tx'
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
  createExecuteTx,
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
              <React.Fragment>
                <ResumeArbitrableTx
                  arbitrabletx={arbitrabletx.data}
                  title={<React.Fragment>Resume</React.Fragment>}
                >
                  {
                    accounts[0] === arbitrabletx.data.sender && Date.now() - arbitrabletx.data.lastInteraction * 1000 >= arbitrabletx.data.timeoutPayment * 1000 ? (
                      <Formik onSubmit={() => createExecuteTx(arbitrabletx.data.id)}>
                        {({isSubmitting}) => (
                          <Form className={'PayOrReimburseArbitrableTx'}>
                            <Button type='submit' disabled={isSubmitting}>
                              Execute Payment
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <React.Fragment>
                        <Formik onSubmit={() => createDispute(arbitrabletx.data.id)}>
                          {({isSubmitting}) => (
                            <Form className={'PayOrReimburseArbitrableTx'}>
                              <Button type='submit' disabled={isSubmitting}>
                                Raise a dispute
                              </Button>
                            </Form>
                          )}
                        </Formik>
                        <span style={{fontSize: '0.9em', padding: '0 2em', color: '#4a4a4a'}}>Or</span>
                        <PayOrReimburseArbitrableTx
                          payOrReimburse={payOrReimburse}
                          payOrReimburseFn={createPayOrReimburse}
                          amount={arbitrabletx.data.amount}
                          id={arbitrabletx.data.id}
                        />
                      </React.Fragment>
                    )
                  }
                </ResumeArbitrableTx>
              </React.Fragment>
            )
          }
        </React.Fragment>
      )
    case arbitrableTxConstants.WAITING_RECEIVER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />The receiver has raised a dispute</React.Fragment>}
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
          title={<React.Fragment><Time style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />Waiting the arbitration fee from the receiver</React.Fragment>}
        >
          <TimeoutArbitrableTx
            id={arbitrabletx.data.id}
            timeout={createTimeout}
            time={time(arbitrabletx)}
            name={accounts[0] === arbitrabletx.data.receiver ? 'Withdraw' : 'Execute Payment' }
          />
        </ResumeArbitrableTx>
      )
    case arbitrableTxConstants.WAITING_SENDER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />The receiver has raised a dispute</React.Fragment>}
          footer={
            <MessageArbitrationFee 
              arbitrabletx={arbitrabletx}
              createDispute={createDispute}
            />
          }
        />
      ) : (
        <React.Fragment>
          <ResumeArbitrableTx
            arbitrabletx={arbitrabletx.data}
            title={<React.Fragment><Dispute style={{width: '26px', height: '35px', position: 'relative', top: '12px', paddingRight: '8px'}} />Waiting the arbitration fee from the sender</React.Fragment>}
          >
            <TimeoutArbitrableTx
                id={arbitrabletx.data.id}
                timeout={createTimeout}
                time={time(arbitrabletx)}
                name={accounts[0] === arbitrabletx.data.receiver ? 'Withdraw' : 'Execute Payment' }
            />
          </ResumeArbitrableTx>
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
      return arbitrabletx.data.ruling === null ? (
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
          footer={
            <DisputeArbitrableTx
              message={
                <React.Fragment>
                  {arbitrabletx.data.ruling === '0' && <p>Jurors refused to vote</p>}
                  {arbitrabletx.data.ruling === '1' && accounts[0] === arbitrabletx.data.receiver ? (
                    <>
                      <p>Congratulations! You <b>won</b> the dispute.</p>
                      {arbitrabletx.data.appealable === true && (
                        <p style={{fontSize: '0.8em'}}>For information, the other party can appeal the decision.</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p>You <b>lost</b> the dispute.</p>
                      {arbitrabletx.data.appealable === true && (
                        <Formik onSubmit={() => createAppeal(arbitrabletx.data.id)}>
                          {({isSubmitting}) => (
                            <Form className={'PayOrReimburseArbitrableTx'}>
                              <Button type='submit' disabled={isSubmitting}>
                                Appeal the decision
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      )}
                    </>
                  )}
                </React.Fragment>
              }
            />
          }
        />
      )
    default:
      return (
        <div className='loader'>
          <ClimbingBoxLoader color={'gray'} />
        </div>
      )
  }
}

const time = arbitrabletx => ((Number(arbitrabletx.data.lastInteraction) + Number(FEE_TIMEOUT)) * 1000)

const isFeePaid = arbitrabletx => arbitrabletx.data[`${arbitrabletx.data.party}Fee`] > 0

const MessageArbitrationFee = ({arbitrabletx, createDispute}) => (
  <DisputeArbitrableTx
    message={
      <React.Fragment>
        <p>
          In order to not forfeit the dispute <b style={{fontWeight: 'bold'}}>pay the arbitration fee</b>. 
          <br />You will be refunded the fee if you win the dispute.
        </p>
        <Formik onSubmit={() => createDispute(arbitrabletx.data.id)}>
          {({isSubmitting}) => (
            <Form className={'PayOrReimburseArbitrableTx'}>
              <Button type='submit' disabled={isSubmitting}>
                Raise a dispute
              </Button>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    }
  />
)