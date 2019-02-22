import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import Button from '../button'
import Modal from 'react-responsive-modal'

import 'react-rangeslider/lib/index.css'

import PayOrReimburseArbitrableTx from '../pay-or-reimburse-arbitrable-tx'

import './agreement-fully.css'

const AgreementFully = ({
  message, 
  children, 
  createDispute,
  arbitrabletx,
  payOrReimburse,
  payOrReimburseFn
}) => {
  const [open, setModal] = useState(false)
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
          <br />If this is declined, the case will go to court.
        </p>
        <div style={{textAlign: 'center'}}>
        <Formik onSubmit={() => createDispute(arbitrabletx.data.id)}>
          {({isSubmitting}) => (
            <Form style={{display: 'inline-block'}}>
              <Button type='submit' disabled={isSubmitting} style={{width: '240px'}}>
                Raise a dispute
              </Button>
            </Form>
          )}
        </Formik>
        <span style={{padding: '3em'}}>&nbsp;</span>
        <PayOrReimburseArbitrableTx
          payOrReimburse={payOrReimburse}
          payOrReimburseFn={payOrReimburseFn}
          amount={arbitrabletx.data.amount}
          id={arbitrabletx.data.id}
        />
        </div>
        <p style={{fontStyle: 'italic', color: '#4a4a4a', fontSize: '12px', padding: '3em 0 1em 0'}}>Raise dispute: You will need to pay the arbitration fee of 0.01ETH.</p>
      </Modal>
      <div className='AgreementFully-message'>
        {message}
        <Button onClick={() => payOrReimburseFn(arbitrabletx.data.id, arbitrabletx.data.amount)} style={{width: '220px'}}>Yes</Button>
        <span style={{padding: '3em'}}>&nbsp;</span>
        <Button onClick={() => setModal(!open)} style={{width: '220px'}}>No</Button>
      </div>
      <div className='AgreementFully-footer' style={{fontSize: '14px', paddingTop: '1em'}}>
        1. If you say yes, you'll pay the final amount  in full.
        <br />2. If you say no, you will be directly to a settlement screen where you can propose a partial offer to the other party.
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
