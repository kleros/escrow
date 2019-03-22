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
          modal: 'Attachment-modal',
        }}
      >
        <h2 className='Attachment-modal-title' style={{textAlign: 'center'}}>Propose Settlement or Raise Dispute</h2>
        <p style={{textAlign: 'center', color: '#4a4a4a', fontSize: '14px', paddingBottom: '2em'}}>
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
        <p style={{fontStyle: 'italic', color: '#4a4a4a', fontSize: '12px', padding: '3em 0 1em 2em'}}>
          You are offering <span style={{color: '#009aff'}}>{percent.toFixed()}%</span>.
        </p>
        <div style={{textAlign: 'center'}}>
        <Formik onSubmit={() => createDispute(arbitrabletx.data.id)}>
          {({isSubmitting}) => (
            <Form style={{display: 'inline-block'}}>
              <Button type='submit' disabled={isSubmitting} style={{width: '240px'}}>
                {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Raise a dispute
              </Button>
            </Form>
          )}
        </Formik>
        <span style={{padding: '1em'}}>&nbsp;</span>
        <PayOrReimburseArbitrableTx
          payOrReimburse={payOrReimburse}
          payOrReimburseFn={payOrReimburseFn}
          amount={amount}
          amountMax={arbitrabletx.data.amount}
          id={arbitrabletx.data.id}
          onChangeAmount={setPercentByAmount}
        />
        </div>
        <p style={{fontStyle: 'italic', color: '#4a4a4a', fontSize: '12px', padding: '3em 0 1em 2em'}}>Raise dispute: You will need to pay the arbitration fee of 0.01ETH.</p>
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
        <Formik onSubmit={() => payOrReimburseFn(arbitrabletx.data.id, arbitrabletx.data.amount)}>
          {({isSubmitting}) => (
            <Form className={'PayOrReimburseArbitrableTx'}>
              <Button type='submit' disabled={isSubmitting || arbitrabletx.data.party === 'none'} style={{width: '220px'}}>
                {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Yes
              </Button>
            </Form>
          )}
        </Formik>
        <span style={{padding: '3em'}}>&nbsp;</span>
        <Button onClick={() => setModal(!open)} disabled={arbitrabletx.data.party === 'none'} style={{width: '220px'}}>No</Button>
      </div>
      <div className='AgreementFully-footer' style={{fontSize: '14px', paddingTop: '1em'}}>
        {
          arbitrabletx.data.sender === accounts[0] && (
            <>
              1. If you say yes, you'll pay the final amount  in full.
              <br />2. If you say no, you will be directly to a settlement screen where you can propose a partial offer to the other party.
              <br /><br />Timeout to execute the arbitrable payment transaction <Countdown date={arbitrabletx.data.lastInteraction * 1000 + arbitrabletx.data.timeoutPayment * 1000} />.
            </>
          )
        }
        {
          arbitrabletx.data.receiver === accounts[0] && (
            <>
              1. If you say yes, you'll reimburse the final amount  in full.
              <br />2. If you say no, you will be directly to a settlement screen where you can propose a partial offer to the other party.
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
