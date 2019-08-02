import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import Button from '../button'
import Modal from 'react-responsive-modal'
import Countdown from 'react-countdown-now'
import { ClipLoader } from 'react-spinners'

import MAX_TIMEOUT from '../../constants/timeout'
import CountdownRenderer from '../countdown-renderer'
import PayOrReimburseArbitrableTx from '../pay-or-reimburse-arbitrable-tx'

import truncateAmount from '../../utils/eth-amount'

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
  const [amount, setAmount] = useState(0) // set Percent
  const setAmountFromInput = amount => {
    const _amount = Number(amount)
    const _amountInEscrow = Number(arbitrabletx.data.amount)
    if (!_amount) setAmount(amount)

    if (_amount <= _amountInEscrow) {
      if (_amount < 0) setAmount(0)
      else setAmount(amount)
    } else if (_amount > _amountInEscrow) {
      setAmount(_amountInEscrow)
    } else {
      setAmount(_amount)
    }
  }

  const asset = (arbitrabletx.data.token ? arbitrabletx.data.token.ticker : 'ETH')

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
          Propose a settlement by giving up part of the payment to the other party.
          <br />A dispute can still be raised over the remaining balance.
        </p>
        <p className="AgreementFully-modal-description">
          Current Payment Balance: {arbitrabletx.data.amount} {asset}
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
              onChangeAmount={setAmountFromInput}
              asset={asset}
            />
          </div>
          <p className="AgreementFully-modal-offer">
            Remaining balance will be {' '}
            <span style={{ color: '#009aff' }}>{truncateAmount(arbitrabletx.data.amount - amount, 2)} {asset}</span>
          </p>
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
              {arbitrabletx.data.arbitrationCost} ETH. This fee is refunded if
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
            1. If you select Yes, you'll pay the amount in full.
            <br />
            2. If you select No, you will be directed to a settlement screen
            where you can waive part of the payment to the other party or raise
            a dispute.
            <br />
            <br />
            {arbitrabletx.data.timeout === MAX_TIMEOUT ? '' : (
              <>
                Payment times out in{' '}
                <Countdown
                  date={
                    arbitrabletx.data.lastInteraction * 1000 +
                    arbitrabletx.data.timeoutPayment * 1000
                  }
                  renderer={CountdownRenderer}
                />
                .
              </>
            )}
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
              {arbitrabletx.data.timeout === MAX_TIMEOUT ? '' : (
                <>
                  Payment times out in{' '}
                  <Countdown
                    date={
                      arbitrabletx.data.lastInteraction * 1000 +
                      arbitrabletx.data.timeoutPayment * 1000
                    }
                    renderer={CountdownRenderer}
                  />
                  .
                </>
              )}
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
