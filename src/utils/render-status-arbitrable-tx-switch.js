import React from 'react'
import { BeatLoader } from 'react-spinners'
import { Formik, Form } from 'formik'

import { FEE_TIMEOUT } from '../bootstrap/dapp-api'
import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import * as disputeConstants from '../constants/dispute'
import TimeoutArbitrableTx from '../components/timeout-arbitrable-tx'
import NewEvidenceArbitrableTx from '../components/new-evidence-arbitrable-tx'
import ResumeArbitrableTx from '../components/resume-arbitrable-tx'
import DisputeArbitrableTx from '../components/dispute-arbitrable-tx'
import SuccessArbitrableTx from '../components/success-arbitrable-tx'
import AgreementFully from '../components/agreement_fully'
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
        <>
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
              <>
                {
                  accounts[0] === arbitrabletx.data.sender && Date.now() - arbitrabletx.data.lastInteraction * 1000 >= arbitrabletx.data.timeoutPayment * 1000 ? (
                    <ResumeArbitrableTx
                      arbitrabletx={arbitrabletx.data}
                      title={<React.Fragment>Resume - Execute Payment</React.Fragment>}
                    >
                      <Formik onSubmit={() => createExecuteTx(arbitrabletx.data.id)}>
                        {({isSubmitting}) => (
                          <Form className={'PayOrReimburseArbitrableTx'}>
                            <Button type='submit' disabled={isSubmitting}>
                              Execute Payment
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </ResumeArbitrableTx>
                  ) : (
                    <ResumeArbitrableTx
                      arbitrabletx={arbitrabletx.data}
                      title={<React.Fragment>Transaction Ongoing</React.Fragment>}
                      footer={
                        <AgreementFully
                          payOrReimburse={payOrReimburse}
                          payOrReimburseFn={createPayOrReimburse}
                          amount={arbitrabletx.data.amount}
                          id={arbitrabletx.data.id}
                          createDispute={createDispute}
                          arbitrabletx={arbitrabletx}
                          accounts={accounts}
                        />
                      }
                    />
                  )
                }
              </>
            )
          }
        </>
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
      return arbitrabletx.data.disputeStatus === disputeConstants.WAITING.toString() ? (
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
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<React.Fragment>Dispute Ongoing</React.Fragment>}
          footer={
            <DisputeArbitrableTx
              message={
                <>
                  {
                    arbitrabletx.data.ruling === '0' && (
                      <>
                        <p>Jurors refused to vote</p>
                        <Formik onSubmit={() => createAppeal(arbitrabletx.data.id)}>
                          {({isSubmitting}) => (
                            <Form className={'PayOrReimburseArbitrableTx'}>
                              <Button type='submit' disabled={isSubmitting}>
                                Appeal the decision
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      </>
                    )
                  }
                  {accounts[0] === arbitrabletx.data.receiver && (
                    <>
                      {arbitrabletx.data.ruling === '1' ? (
                        <>
                          <p>Congratulations! You <b>won</b> the dispute.</p>
                          <p style={{fontSize: '0.8em'}}>
                            For information, the other party can appeal the decision.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>You <b>lost</b> the dispute.</p>
                          <Formik onSubmit={() => createAppeal(arbitrabletx.data.id)}>
                            {({isSubmitting}) => (
                              <Form className={'PayOrReimburseArbitrableTx'}>
                                <Button type='submit' disabled={isSubmitting}>
                                  Appeal the decision
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </>
                  )}
                  {accounts[0] === arbitrabletx.data.sender && (
                    <>
                      {arbitrabletx.data.ruling === '2' ? (
                        <>
                          <p>Congratulations! You <b>won</b> the dispute.</p>
                          <p style={{fontSize: '0.8em'}}>For information, the other party can appeal the decision.</p>
                        </>
                      ) : (
                        <>
                          <p>You <b>lost</b> the dispute.</p>
                          <Formik onSubmit={() => createAppeal(arbitrabletx.data.id)}>
                            {({isSubmitting}) => (
                              <Form className={'PayOrReimburseArbitrableTx'}>
                                <Button type='submit' disabled={isSubmitting}>
                                  Appeal the decision
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </>
                      )}
                    </>
                  )}
                </>
              }
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
                    <p>Congratulations! You <b>won</b> the dispute.</p>
                  ) : (
                    <p>You <b>lost</b> the dispute.</p>
                  )}
                </React.Fragment>
              }
            />
          }
        />
      )
    default:
      return <BeatLoader className='loader' color={'gray'} />
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