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
  const [percent, setPercent] = useState(50) // set Percent
  const [amount, setAmount] = useState(0.5 * arbitrabletx.data.amount) // set Percent
  const setPercentByAmount = amount => {
    if (amount <= arbitrabletx.data.amount) {
      setAmount(amount)
      setPercent(amount * 100 / arbitrabletx.data.amount)
    } else {
      setAmount(arbitrabletx.data.amount)
      setPercent(100)
    }
  }

  const setAmountByPercent = percent => {
    setPercent(percent)
    setAmount(1 * Number(percent / 100 * arbitrabletx.data.amount).toFixed(18))
  }

  return (
    <div className='AgreementFully'>
      <Modal
        open={open} 
        onClose={() => setModal(!open)} 
        center
        classNames={{
          modal: 'AgreementFully-modal',
        }}
      >
        <h2 className='AgreementFully-modal-title'>Propose Settlement or Raise Dispute</h2>
        <p className='AgreementFully-modal-description'>
          Propose a settlement by choosing the escrow amount percentage to send to the other party.
          <br />If this is declined, the counter party can raise a dispute.
        </p>
        <Slider
          min={0}
          max={100}
          labels={{0: '0%', 100: '100%'}}
          value={percent}
          onChange={setAmountByPercent}
        />
        <p className='AgreementFully-modal-offer'>
          You are offering <span style={{color: '#009aff'}}>{percent.toFixed()}%</span>.
        </p>
        <div className='AgreementFully-modal-buttons'>
          <div className='AgreementFully-modal-buttons-raise-dispute'>
            <Formik onSubmit={() => createDispute(arbitrabletx.data.arbitrableAddress, arbitrabletx.data.id)}>
              {({isSubmitting}) => (
                <Form style={{display: 'inline-block'}}>
                  <Button type='submit' disabled={isSubmitting} className='AgreementFully-modal-buttons-raise-dispute-button'>
                    {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Raise a dispute
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
          <div className='AgreementFully-modal-buttons-pay-reimburse'>
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
        <p className='AgreementFully-modal-dispute-description'>Raise dispute: you will need to pay the arbitration fee of {arbitrabletx.data.arbitrationCost}ETH.</p>
      </Modal>
      <div className='AgreementFully-message'>
        <p>
          {
            arbitrabletx.data.sender === accounts[0] ? (
              <>Did the other party <b>fully comply with the {arbitrabletx.data.amount === arbitrabletx.data.originalAmount ? 'agreement' : 'settlement'}</b>?</>
            ) : (
              <>Do you want to <b>fully reimburse</b> the sender?</>
            )
          }
        </p>

        <Formik onSubmit={() => payOrReimburseFn(arbitrabletx.data.arbitrableAddress, arbitrabletx.data.id, arbitrabletx.data.amount)}>
          {({isSubmitting}) => (
            <Form className='PayOrReimburseArbitrableTx'>
              <Button className='PayOrReimburseArbitrableTx-yes' type='submit' disabled={isSubmitting || arbitrabletx.data.party === 'none'}>
                {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Yes
              </Button>
            </Form>
          )}
        </Formik>
        <Button className='PayOrReimburseArbitrableTx-no' onClick={() => setModal(!open)} disabled={arbitrabletx.data.party === 'none'}>No</Button>
      </div>
      <div className='AgreementFully-footer'>
        {
          arbitrabletx.data.sender === accounts[0] && (
            <>
              1. If you say yes, you'll pay the final amount in full.
              <br />2. If you say no, you will be directed to a settlement screen where you can propose a partial offer to the other party.
              <br /><br />Timeout to execute the arbitrable payment transaction <Countdown date={arbitrabletx.data.lastInteraction * 1000 + arbitrabletx.data.timeoutPayment * 1000} />.
            </>
          )
        }
        {
          arbitrabletx.data.receiver === accounts[0] && (
            <>
              1. If you say yes, you'll reimburse the final amount in full.
              <br />2. If you say no, you will be directed to a settlement screen where you can propose a partial offer to the other party.
              <br /><br />Timeout to execute the arbitrable payment <Countdown date={arbitrabletx.data.lastInteraction * 1000 + arbitrabletx.data.timeoutPayment * 1000} />.
            </>
          )
        }
        {
          arbitrabletx.data.party === 'none' && (
            <span style={{color: 'red'}}>You Ethereum address does not match with this transaction.</span>
          )
        }
      </div>
    </div>
  )
}

AgreementFully.propTypes = {
  // State
  message: PropTypes.string,
  // TODO
}

AgreementFully.defaultProps = {
  // State
  message: '',
  // TODO
}

export default AgreementFully
