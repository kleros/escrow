import React from 'react'
import { BeatLoader, ClipLoader } from 'react-spinners'
import { Formik, Form } from 'formik'

import * as arbitrableTxConstants from '../constants/arbitrable-tx'
import * as disputeConstants from '../constants/dispute'
import TimeoutArbitrableTx from '../components/timeout-arbitrable-tx'
import NewEvidenceArbitrableTx from '../components/new-evidence-arbitrable-tx'
import ResumeArbitrableTx from '../components/resume-arbitrable-tx'
import DisputeArbitrableTx from '../components/dispute-arbitrable-tx'
import SuccessArbitrableTx from '../components/success-arbitrable-tx'
import AgreementFully from '../components/agreement_fully'
import Button from '../components/button'

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
  switch (arbitrabletx.data.status) {
    case arbitrableTxConstants.NO_DISPUTE:
      return (
        <>
          {arbitrabletx.data.amount === '0' ? (
            <ResumeArbitrableTx
              arbitrabletx={arbitrabletx.data}
              title={<>Payment Completed</>}
              footer={
                <SuccessArbitrableTx
                  message={
                    <p>
                      Payment completed <b>successfully</b>.
                    </p>
                  }
                  footer={<>The funds were transferred to the receiver.</>}
                />
              }
            />
          ) : (
            <>
              {(accounts[0] === arbitrabletx.data.sender ||
                accounts[0] === arbitrabletx.data.receiver) &&
              Date.now() - arbitrabletx.data.lastInteraction * 1000 >=
                arbitrabletx.data.timeoutPayment * 1000 ? (
                <ResumeArbitrableTx
                  arbitrabletx={arbitrabletx.data}
                  title={arbitrabletx.data.invoice ? <>Invoice Details</> : <>Payment Details</>}
                >
                  <Formik
                    onSubmit={() =>
                      createExecuteTx(
                        arbitrabletx.data.arbitrableAddress,
                        arbitrabletx.data.id
                      )
                    }
                  >
                    {({ isSubmitting }) => (
                      <Form className={'PayOrReimburseArbitrableTx'}>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <span
                              style={{
                                position: 'relative',
                                top: '4px',
                                lineHeight: '40px',
                                paddingRight: '4px'
                              }}
                            >
                              <ClipLoader size={20} color={'#fff'} />
                            </span>
                          )}{' '}
                          {accounts[0] === arbitrabletx.data.sender
                            ? 'Send'
                            : 'Claim'}{' '}
                          Payment
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </ResumeArbitrableTx>
              ) : (
                <ResumeArbitrableTx
                  arbitrabletx={arbitrabletx.data}
                  title={arbitrabletx.data.invoice ? <>Invoice Details</> : <>Payment Details</>}
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
              )}
            </>
          )}
        </>
      )
    case arbitrableTxConstants.WAITING_RECEIVER:
      return (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<>Waiting for Receiver to Pay Arbitration Fees</>}
        >
          <TimeoutArbitrableTx
            arbitrable={arbitrabletx.data.arbitrableAddress}
            id={arbitrabletx.data.id}
            timeout={createTimeout}
            time={time(arbitrabletx)}
            name={'Withdraw Funds'}
            paid={isFeePaid(arbitrabletx)}
          />
        </ResumeArbitrableTx>
      )
    case arbitrableTxConstants.WAITING_SENDER:
      return !isFeePaid(arbitrabletx) ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<>A Dispute Is Being Raised</>}
          footer={
            <MessageArbitrationFee
              arbitrabletx={arbitrabletx}
              createDispute={createDispute}
            />
          }
        />
      ) : (
        <>
          <ResumeArbitrableTx
            arbitrabletx={arbitrabletx.data}
            title={<>Waiting for Sender to Pay Arbitration Fees</>}
          >
            <TimeoutArbitrableTx
              arbitrable={arbitrabletx.data.arbitrableAddress}
              id={arbitrabletx.data.id}
              timeout={createTimeout}
              time={time(arbitrabletx)}
              name={'Execute Payment'}
            />
          </ResumeArbitrableTx>
        </>
      )
    case arbitrableTxConstants.DISPUTE_CREATED:
      return arbitrabletx.data.disputeStatus ===
        disputeConstants.WAITING.toString() ? (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<>Dispute in Progress</>}
          footer={
            <NewEvidenceArbitrableTx
              arbitrable={arbitrabletx.data.arbitrableAddress}
              id={arbitrabletx.data.id}
              submitEvidence={createEvidence}
            />
          }
        />
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<>Dispute in Progress</>}
          footer={
            <DisputeArbitrableTx
              message={
                <>
                  {'none' !== arbitrabletx.data.party &&
                    arbitrabletx.data.ruling === '0' && (
                      <>
                        <p>Jurors refused to vote.</p>
                        <Formik
                          onSubmit={() =>
                            createAppeal(
                              arbitrabletx.data.arbitrableAddress,
                              arbitrabletx.data.id
                            )
                          }
                        >
                          {({ isSubmitting }) => (
                            <Form className={'PayOrReimburseArbitrableTx'}>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                  <span
                                    style={{
                                      position: 'relative',
                                      top: '4px',
                                      lineHeight: '40px',
                                      paddingRight: '4px'
                                    }}
                                  >
                                    <ClipLoader size={20} color={'#fff'} />
                                  </span>
                                )}{' '}
                                Appeal the decision
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      </>
                    )}
                  {arbitrabletx.data.ruling !== '0' &&
                    accounts[0] === arbitrabletx.data.sender && (
                      <>
                        {arbitrabletx.data.ruling === '1' ? (
                          <>
                            <p>
                              Congratulations! You <b>won</b> the dispute.
                            </p>
                            <p style={{ fontSize: '0.8em' }}>
                              For information, the other party can appeal the
                              decision.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              You <b>lost</b> the dispute.
                            </p>
                            <Formik
                              onSubmit={() =>
                                createAppeal(
                                  arbitrabletx.data.arbitrableAddress,
                                  arbitrabletx.data.id
                                )
                              }
                            >
                              {({ isSubmitting }) => (
                                <Form className={'PayOrReimburseArbitrableTx'}>
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                      <span
                                        style={{
                                          position: 'relative',
                                          top: '4px',
                                          lineHeight: '40px',
                                          paddingRight: '4px'
                                        }}
                                      >
                                        {
                                          <ClipLoader
                                            size={20}
                                            color={'#fff'}
                                          />
                                        }
                                      </span>
                                    )}{' '}
                                    Appeal the decision
                                  </Button>
                                </Form>
                              )}
                            </Formik>
                          </>
                        )}
                      </>
                    )}
                  {arbitrabletx.data.ruling !== '0' &&
                    accounts[0] === arbitrabletx.data.receiver && (
                      <>
                        {arbitrabletx.data.ruling === '2' ? (
                          <>
                            <p>
                              Congratulations! You <b>won</b> the dispute.
                            </p>
                            <p style={{ fontSize: '0.8em' }}>
                              For information, the other party can appeal the
                              decision.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              You <b>lost</b> the dispute.
                            </p>
                            <Formik
                              onSubmit={() =>
                                createAppeal(
                                  arbitrabletx.data.arbitrableAddress,
                                  arbitrabletx.data.id
                                )
                              }
                            >
                              {({ isSubmitting }) => (
                                <Form className={'PayOrReimburseArbitrableTx'}>
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                      <span
                                        style={{
                                          position: 'relative',
                                          top: '4px',
                                          lineHeight: '40px',
                                          paddingRight: '4px'
                                        }}
                                      >
                                        {
                                          <ClipLoader
                                            size={20}
                                            color={'#fff'}
                                          />
                                        }
                                      </span>
                                    )}{' '}
                                    Appeal the decision
                                  </Button>
                                </Form>
                              )}
                            </Formik>
                          </>
                        )}
                      </>
                    )}
                  {'none' === arbitrabletx.data.party && (
                    <>
                      {arbitrabletx.data.ruling === '0' && (
                        <p>Jurors refused to vote.</p>
                      )}
                      {arbitrabletx.data.ruling === '1' && (
                        <p>Sender wins the dispute.</p>
                      )}
                      {arbitrabletx.data.ruling === '2' && (
                        <p>Receiver wins the dispute.</p>
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
          title={<>Payment Completed</>}
          footer={
            <SuccessArbitrableTx
              message={
                <p>
                  Payment completed <b>successfully</b>.
                </p>
              }
              footer={
                <p>
                  The funds were distributed according to the dispute's ruling.
                </p>
              }
            />
          }
        />
      ) : (
        <ResumeArbitrableTx
          arbitrabletx={arbitrabletx.data}
          title={<>Payment Details</>}
          footer={
            <DisputeArbitrableTx
              message={
                arbitrabletx.data.party !== 'none' &&
                arbitrabletx.data.ruling !== '0' ? (
                  <>
                    {arbitrabletx.data.ruling === '1' &&
                    accounts[0] === arbitrabletx.data.sender ? (
                      <p>
                        Congratulations! You <b>won</b> the dispute.
                      </p>
                    ) : (
                      <p>
                        You <b>lost</b> the dispute.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {arbitrabletx.data.ruling === '0' &&
                      (arbitrabletx.data.disputeId !== '0' ? (
                        <p>Jurors refused to arbitrate.</p>
                      ) : (
                        <p>Payment Completed</p>
                      ))}
                    {arbitrabletx.data.ruling === '1' && (
                      <p>Sender won the dispute.</p>
                    )}
                    {arbitrabletx.data.ruling === '2' && (
                      <p>Receiver won the dispute.</p>
                    )}
                  </>
                )
              }
            />
          }
        />
      )
    default:
      return <BeatLoader className="loader" color={'#fff'} />
  }
}

const time = arbitrabletx =>
  (Number(arbitrabletx.data.lastInteraction) +
    Number(arbitrabletx.data.feeTimeout)) *
  1000

const isFeePaid = arbitrabletx =>
  arbitrabletx.data[`${arbitrabletx.data.party}Fee`] > 0

const MessageArbitrationFee = ({ arbitrabletx, createDispute }) => (
  <DisputeArbitrableTx
    message={
      <>
        <p>
          In order to not forfeit the dispute,{' '}
          <b style={{ fontWeight: 'bold' }}>pay the arbitration fee</b>.
          <br />
          It will be refunded if you win the dispute.
        </p>
        <Formik
          onSubmit={() =>
            createDispute(
              arbitrabletx.data.arbitrableAddress,
              arbitrabletx.data.id
            )
          }
        >
          {({ isSubmitting }) => (
            <Form className={'PayOrReimburseArbitrableTx'}>
              <Button
                type="submit"
                disabled={isSubmitting || arbitrabletx.data.party === 'none'}
              >
                {isSubmitting && (
                  <span
                    style={{
                      position: 'relative',
                      top: '4px',
                      lineHeight: '40px',
                      paddingRight: '4px'
                    }}
                  >
                    <ClipLoader size={20} color={'#fff'} />
                  </span>
                )}
                Pay Fee
              </Button>
            </Form>
          )}
        </Formik>
        {arbitrabletx.data.party === 'none' && (
          <div style={{ margin: '1em', color: 'red' }}>
            Your ETH address is not a party in this payment.
          </div>
        )}
      </>
    }
  />
)
