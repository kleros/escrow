import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { ARBITRATOR_DEFAULT_ADDRESS } from '../../bootstrap/dapp-api'
import { ReactComponent as Plus } from '../../assets/plus-purple.svg'
import Button from '../button'

import './new-arbitrable-tx.css'

const NewArbitrableTx = ({ formArbitrabletx }) => (
  <div className='NewArbitrableTx'>
    <h1 className='NewArbitrableTx-h1'><Plus style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />New Transaction</h1>
    <Formik
      initialValues={{
        title: '',
        description: '', file: '',
        arbitrator: ARBITRATOR_DEFAULT_ADDRESS,
        seller: '',
        payment: '',
        email: ''
      }}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        if (!values.email) {
          errors.email = 'Email Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors
      }}
      onSubmit={arbitrabletx => formArbitrabletx(arbitrabletx) && navigate('resume')}
    >
      {({ setFieldValue }) => (
        <Form className='FormNewArbitrableTx'>
          <div className='section-title'>
            <label for='title'>Title</label>
            <Field name='title' placeholder='Title' />
            <ErrorMessage name='title' component='div' />
            <label for='arbitrator'>Arbitrator (Kleros)</label>
            <Field name='arbitrator' />
            <ErrorMessage name='arbitrator' component='div' />
            <label for='seller'>Seller</label>
            <Field name='seller' placeholder='Seller Address' />
            <ErrorMessage name='seller' component='div' />
            <label for='amount'>Amount (ETH)</label>
            <Field name='amount' placeholder='Amount' />
            <ErrorMessage name='payment' component='div' />
            <label for='email'>Email</label>
            <Field type='email' name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' className='error class' />
            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <label for='file' className='file'>Primary document</label>
            <input id='file' style={{border: '#009AFF', padding: '0.6em 0'}} name='file' type='file' onChange={e =>
              setFieldValue('file', window.URL.createObjectURL(e.currentTarget.files[0]))
            } />
          </div>
          <div className='section-description'>
            <label for='description'>Description</label>
            <Field name='description' component='textarea' />
            <ErrorMessage name='description' component='div' className='def' />
          </div>
          <div className='section-submit'>
            <Button type='submit'>Save Transaction</Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

NewArbitrableTx.propTypes = {
  // State
  formArbitrabletx: PropTypes.func
}

NewArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewArbitrableTx
