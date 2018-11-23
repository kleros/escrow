import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { ARBITRATOR_DEFAULT_ADDRESS } from '../../bootstrap/dapp-api'

const NewArbitrableTx = ({ formArbitrabletx }) => (
  <div>
    <h1>Create arbitrable transaction</h1>
    <br />
    <br />
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
          errors.email = 'Required';
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
        <Form>
          <label for='title'>Title</label>
          <Field name='title' placeholder='' />
          <ErrorMessage name='title' component='div' />
          <br />
          <label for='description'>Description</label>
          <Field name='description' component='textarea' />
          <ErrorMessage name='description' component='div' className='def' />
          <br />
          {/* hack Formik for file type */}
          {/* and store only the path on the file in the redux state */}
          <label for='file'>Primary document</label>
          <input id='file' name='file' type='file' onChange={e =>
            setFieldValue('file', window.URL.createObjectURL(e.currentTarget.files[0]))
          } />
          <br />
          <label for='arbitrator'>Arbitrator (Kleros by default)</label>
          <Field name='arbitrator' />
          <ErrorMessage name='arbitrator' component='div' />
          <br />
          <label for='seller'>Seller</label>
          <Field name='seller' />
          <ErrorMessage name='seller' component='div' />
          <br />
          <label for='payment'>Payment</label>
          <Field name='payment' />
          <ErrorMessage name='payment' component='div' />
          <br />
          <label for='email'>Email</label>
          <Field type='email' name='email' />
          <ErrorMessage name='email' component='div' className='error class' />
          <br />
          <br />
          <button type='submit'>
            Save Transaction
          </button>
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
