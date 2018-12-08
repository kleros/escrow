import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { ReactComponent as Plus } from '../../assets/plus-purple.svg'
import Button from '../button'

import './new-arbitrable-tx.css'

const NewArbitrableTx = ({ formArbitrabletx }) => (
  <div className='NewArbitrableTx'>
    <h1 className='NewArbitrableTx-h1'><Plus style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />New Transaction</h1>
    <Formik
      initialValues={{
        title: '',
        description: '', 
        file: '',
        seller: '',
        amount: '',
        email: ''
      }}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        if (!values.seller)
          errors.seller = 'Seller Address Required'
        if (!values.amount)
          errors.amount = 'Amount Required'
        if (
          values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        return errors
      }}
      onSubmit={arbitrabletx => formArbitrabletx(arbitrabletx)}
    >
      {({ setFieldValue }) => (
        <Form className='FormNewArbitrableTx'>
          <div className='section-title'>
            <label htmlFor='title'>Title</label>
            <Field name='title' placeholder='Title' />
            <ErrorMessage name='title' component='div' />
            <ErrorMessage name='arbitrator' component='div' />
            <label htmlFor='seller'>Seller</label>
            <Field name='seller' placeholder='Seller Address' />
            <ErrorMessage name='seller' component='div' className='error' />
            <label htmlFor='amount'>Amount (ETH)</label>
            <Field name='amount' placeholder='Amount' />
            <ErrorMessage name='amount' component='div' className='error'/>
            <label htmlFor='email'>Email</label>
            <Field type='email' name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' className='error' />
            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <label htmlFor='file' className='file'>Primary document</label>
            <input id='file' style={{border: '#009AFF', padding: '0.6em 0'}} name='file' type='file' onChange={e => {
                const file = e.currentTarget.files[0]
                return setFieldValue('file', {
                  dataURL: window.URL.createObjectURL(file),
                  name: file.name
                })
              }
            } />
          </div>
          <div className='section-description'>
            <label htmlFor='description'>Description</label>
            <Field name='description' component='textarea' className='section-description-textarea' />
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
