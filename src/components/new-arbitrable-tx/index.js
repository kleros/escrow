import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Web3 from 'web3'

import { ReactComponent as Plus } from '../../assets/plus-purple.svg'
import Button from '../button'

import './new-arbitrable-tx.css'

const NewArbitrableTx = ({ formArbitrabletx, balance }) => (
  <div className='NewArbitrableTx'>
    <h1 className='NewArbitrableTx-h1'><Plus style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />New Transaction</h1>
    <Formik
      initialValues={{
        title: '',
        description: '', 
        file: '',
        seller: '',
        amount: ''
      }}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        if (values.title.length > 55)
          errors.title = 'Number of characters for the title allowed is exceeded. The maximum is 55 characters.'
        if (!values.seller)
          errors.seller = 'Sender Address Required'
        if (!Web3.utils.isAddress(values.seller))
          errors.seller = 'Valid Address Required'
        if (!values.amount)
          errors.amount = 'Amount Required'
        if (values.amount <= 0)
          errors.amount = 'Amount must be positive.'
        if (isNaN(values.amount))
          errors.amount = 'Number Required'
        if (values.amount > balance.data)
          errors.amount = 'Amount must equal of lower than your ETH balance.'
        if (values.description.length > 1000000)
          errors.description = 'The maximum numbers of the characters for the description is 1,000,000 characters.'
        if (values.file.size > 5000000)
          errors.file = 'The maximum size of the file is 5Mo.'
        return errors
      }}
      onSubmit={arbitrabletx => formArbitrabletx(arbitrabletx)}
    >
      {({ errors, setFieldValue, touched }) => (
        <Form className='FormNewArbitrableTx'>
          <div className='section-title'>
            <label htmlFor='title'>Title</label>
            <Field name='title' placeholder='Title' />
            <ErrorMessage name='title' component='div' className='error' />
            <label htmlFor='seller'>Sender</label>
            <Field name='seller' placeholder='Sender Address' />
            <ErrorMessage name='seller' component='div' className='error' />
            <label htmlFor='amount'>Amount (ETH)</label>
            <Field name='amount' placeholder='Amount' />
            <ErrorMessage name='amount' component='div' className='error'/>
            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <label htmlFor='file' className='file'>Primary document</label>
            <input id='file' style={{border: '#009AFF', padding: '0.6em 0'}} name='file' type='file' onChange={e => {
                const file = e.currentTarget.files[0]
                return setFieldValue('file', {
                  dataURL: (window.URL || window.webkitURL).createObjectURL(file),
                  name: file.name,
                  size: file.size
                })
              }
            } />
            {errors.file && <div className='error'>{errors.file}</div>}
          </div>
          <div className='section-description'>
            <label htmlFor='description'>Description</label>
            <Field name='description' component='textarea' className='section-description-textarea' />
            <ErrorMessage name='description' component='div' className='error' />
          </div>
          <div className='section-submit'>
            <Button type='submit' disabled={touched.seller === undefined || touched.amount === undefined || Object.entries(errors).length > 0}>Save Transaction</Button>
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
