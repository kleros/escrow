import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import Button from '../button'
import Modal from 'react-responsive-modal'
import Countdown from 'react-countdown-now'
import { ClipLoader } from 'react-spinners'

import PayOrReimburseArbitrableTx from '../pay-or-reimburse-arbitrable-tx'

import Slider from 'react-rangeslider'

import 'react-rangeslider/lib/index.css'

import './agreement-fully.css'

const AgreementFully = ({
  message,
  createDispute,
  arbitrabletx,
  payOrReimburse,
  payOrReimburseFn,
  accounts
}) => {
  const [open, setModal] = useState(false)
  const [percent, setPercent] = useState(0) // set Percent
  const [amount, setAmount] = useState(0) // set Percent
  const setPercentByAmount = amount => {
    if (amount <= arbitrabletx.data.amount) {
      setAmount(amount)
      setPercent((amount * 100) / arbitrabletx.data.amount)
    } else {
      setAmount(arbitrabletx.data.amount)
      setPercent(100)
    }
  }

  const setAmountByPercent = percent => {
    setPercent(percent)
    setAmount(
      1 * Number((percent / 100) * arbitrabletx.data.amount).toFixed(18)
    )
  }

  return (
    <div className="AgreementFully">
      <Modal
        open={open}
        onClose={() => setModal(!open)}
        center
        classNames={{
          modal: 'AgreementFully-modal'
        }}
      >
        <h2 className="AgreementFully-modal-title">
          Waive Part of the Payment
        </h2>
        <p className="AgreementFully-modal-description">
          Propose a settlement by giving a percentage of the payment to the
          other party.
          <br />A dispute can still be raised over the remaining balance.
        </p>
        <Slider
          min={0}
          max={100}
          labels={{ 0: '0%', 100: '100%' }}
          value={percent}
          onChange={setAmountByPercent}
        />
        <p className="AgreementFully-modal-offer">
          You are waiving{' '}
          <span style={{ color: '#009aff' }}>{percent.toFixed()}%</span>.
        </p>
        <div className="AgreementFully-modal-buttons">
          <div className="AgreementFully-modal-buttons-pay-reimburse">
            <PayOrReimburseArbitrableTx
              arbitrable={arbitrabletx.data.arbitrableAddress}
              payOrReimburse={payOrReimburse}
              payOrReimburseFn={payOrReimburseFn}
              amount={amount}
              amountMax={arbitrabletx.data.amount}
              id={arbitrabletx.data.id}
              onChangeAmount={setPercentByAmount}
            />
          </div>
        </div>
        <div className="divider" />
        <div style={{ textAlign: 'center' }}>
          <h2 className="AgreementFully-modal-title">Raise a Dispute</h2>
          <p className="AgreementFully-modal-description">
            By raising a dispute you are petitioning for the full remaining
            balance.
            <br />
            The dispute will be evaluated by the Kleros jurors.
          </p>
          <div className="AgreementFully-modal-buttons-raise-dispute">
            <Formik
              onSubmit={() =>
                createDispute(
                  arbitrabletx.data.arbitrableAddress,
                  arbitrabletx.data.id
                )
              }
            >
              {({ isSubmitting }) => (
                <Form style={{ display: 'inline-block' }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="AgreementFully-modal-buttons-raise-dispute-button"
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
                    )}{' '}
                    Raise a Dispute
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="AgreementFully-modal-dispute-description">
              You will need to pay the arbitration fee of{' '}
              {arbitrabletx.data.arbitrationCost}ETH. This fee is refunded if
              you win the dispute.
            </p>
          </div>
        </div>
      </Modal>
      {arbitrabletx.data.party !== 'none' ? (
        <div className="AgreementFully-message">
          <p>
            {arbitrabletx.data.sender === accounts[0] ? (
              <>
                Did the other party{' '}
                <b>
                  fully comply with the{' '}
                  {arbitrabletx.data.amount === arbitrabletx.data.originalAmount
                    ? 'agreement'
                    : 'settlement'}
                </b>
                ?
              </>
            ) : (
              <>
                Do you want to <b>fully reimburse</b> the sender?
              </>
            )}
          </p>

          <Formik
            onSubmit={() =>
              payOrReimburseFn(
                arbitrabletx.data.arbitrableAddress,
                arbitrabletx.data.id,
                arbitrabletx.data.amount
              )
            }
          >
            {({ isSubmitting }) => (
              <Form className="PayOrReimburseArbitrableTx">
                <Button
                  className="PayOrReimburseArbitrableTx-yes"
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
                  )}{' '}
                  Yes
                </Button>
              </Form>
            )}
          </Formik>
          <Button
            className="PayOrReimburseArbitrableTx-no"
            onClick={() => setModal(!open)}
            disabled={arbitrabletx.data.party === 'none'}
          >
            No
          </Button>
        </div>
      ) : (
        ''
      )}

      <div className="AgreementFully-footer">
        {arbitrabletx.data.sender === accounts[0] && (
          <>
            1. If you select Yes, you'll pay the remaining amount in full.
            <br />
            2. If you select No, you will be directed to a settlement screen
            where you can waive part of the payment to the other party or raise
            a dispute.
            <br />
            <br />
            Payment times out in{' '}
            <Countdown
              date={
                arbitrabletx.data.lastInteraction * 1000 +
                arbitrabletx.data.timeoutPayment * 1000
              }
            />
            .
          </>
        )}
        {arbitrabletx.data.receiver === accounts[0] && (
          <>
            1. If you select Yes, you'll reimburse the remaining amount in full.
            <br />
            2. If you select No, you will be directed to a settlement screen
            where you can waive part of the payment to the other party or raise
            a dispute.
            <br />
            <br />
            Payment times out in{' '}
            <Countdown
              date={
                arbitrabletx.data.lastInteraction * 1000 +
                arbitrabletx.data.timeoutPayment * 1000
              }
            />
            .
          </>
        )}
      </div>
    </div>
  )
}

AgreementFully.propTypes = {
  // State
  message: PropTypes.string
  // TODO
}

AgreementFully.defaultProps = {
  // State
  message: ''
  // TODO
}

export default AgreementFully
