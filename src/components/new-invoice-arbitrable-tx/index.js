import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, ErrorMessage } from 'formik'
import { Form, Datepicker } from 'react-formik-ui';
import Select from 'react-select'
import Textarea from 'react-textarea-autosize'
import { ClipLoader } from 'react-spinners'

import {
  ARBITRABLE_ADDRESSES
} from '../../bootstrap/dapp-api'
import { ReactComponent as Plus } from '../../assets/plus-purple.svg'
import Button from '../button'
import templates from '../../constants/templates'
import dateToUTC from '../../utils/date-to-utc'

import './new-invoice-arbitrable-tx.css'

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #ccc',
    color: state.isSelected ? '#fff' : '#4a4a4a',
    background: state.isSelected ? '#4d00b4' : state.isFocused ? '#f5f5f5' : null
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'

    return { ...provided, opacity, transition }
  }
}

const NewInvoiceArbitrableTx = ({ formArbitrabletx, accounts, balance }) => (
  <div className='NewInvoiceArbitrableTx'>
    <h1 className='NewInvoiceArbitrableTx-h1'><Plus style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />New Invoice</h1>
    <Formik
      initialValues={{
        arbitrableContractEnv: '',
        title: '',
        timeout: 0,
        amount: '',
        file: '',
        description: ''
      }}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        if (!values.arbitrableContractEnv)
          errors.arbitrableContractEnv = 'Type of escrow Required'
        if (!values.title)
          errors.title = 'Title Required'
        if (values.title.length > 55)
          errors.title = 'Number of characters for the title allowed is exceeded. The maximum is 55 characters.'
        if (!values.timeout)
          errors.timeout = 'Timeout Date Required'
        if (values.timeout < dateToUTC(new Date()))
          errors.timeout = 'Timeout Date must higher than now.'
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
      onSubmit={values => formArbitrabletx({...values, receiver: accounts[0], timeout: Math.round((values.timeout - dateToUTC(new Date())) / 1000), type: 'invoice'})}
    >
      {({ errors, setFieldValue, touched, isSubmitting, values, handleChange }) => (
        <Form className='FormNewInvoiceArbitrableTx'>
          <label htmlFor='arbitrableContractEnv' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-arbitrableAddresses'>Escrow Type</label>
          <div className='FormNewInvoiceArbitrableTx-template-arbitrableAddresses-wrapper'>
            <Field
              render={({ form }) => (
                <Select
                  className='FormNewInvoiceArbitrableTx-template-arbitrableAddresses-wrapper-content'
                  classNamePrefix='select'
                  isClearable={false}
                  isSearchable={false}
                  name='arbitrableContractEnv'
                  options={[...ARBITRABLE_ADDRESSES.map(contractEnv => ({value: contractEnv, label: contractEnv.type}))]}
                  styles={customStyles}
                  placeholder='Escrow Type'
                  onChange={e => form.setFieldValue('arbitrableContractEnv', e.value)}
                />
              )}
            />
          </div>
          <ErrorMessage name='arbitrableContractEnv' component='div' className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-arbitrableAddresses' />
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-arbitrableAddresses'>Eg. Freelancing</div>
          <label htmlFor='title' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-title'>Title</label>
          <Field name='title' className='FormNewInvoiceArbitrableTx-input FormNewInvoiceArbitrableTx-input-title' placeholder='Title' />
          <ErrorMessage name='title' component='div' className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-title' />
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-title'>Eg. Marketing Services Agreement with John</div>
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-receiver'>
            Enter the ETH address of the counterparty to this agreement.
          </div>
          <label htmlFor='timeout' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-timeout'>Timeout Date and Time (UTC)</label>
          <Datepicker
            name='timeout'
            className='FormNewInvoiceArbitrableTx-input-timeout'
            placeholder='Timeout Date and Time'
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="dd.MM.yyyy hh:mm aa"
            timeCaption="time"
            minDate={dateToUTC(new Date())}
          />
          <ErrorMessage name='timeout' component='div' className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-timeout' />
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-timeout'>
            After this timeout, the receiver can execute the arbitrable payment.
          </div>
          <label htmlFor='amount' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-amount'>Amount (ETH)</label>
          <Field name='amount' className='FormNewInvoiceArbitrableTx-input FormNewInvoiceArbitrableTx-input-amount' placeholder='Amount' />
          <ErrorMessage name='amount' component='div' className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-amount' />
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-amount'>
            ETH amount that will be sent to the escrow as payment for the receiver. 
            <br />Funds will stay in the escrow until the transaction 
            is completed.
          </div>
          {/* hack Formik for file type */}
          {/* and store only the path on the file in the redux state */}
          <label htmlFor='file' className='file' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-file'>Agreement Documents (optional)</label>
          <input className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-input-file' id='file' style={{border: '#009AFF', padding: '0.6em 0', fontSize: '1em'}} name='file' type='file' onChange={e => {
              const file = e.currentTarget.files[0]
              return setFieldValue('file', {
                dataURL: (window.URL || window.webkitURL).createObjectURL(file),
                name: file.name,
                size: file.size
              })
            }
          } />
          {errors.file && <div className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-file'>{errors.file}</div>}
          <div className='FormNewInvoiceArbitrableTx-help FormNewInvoiceArbitrableTx-help-file'>
            Upload the files that will be used as evidence in case there is a dispute. 
            <br />If you need to add more than one file, zip them.
          </div>
          <label htmlFor='description' className='FormNewInvoiceArbitrableTx-label FormNewInvoiceArbitrableTx-label-description'>Contract Description (optional)</label>
          <div className='FormNewInvoiceArbitrableTx-template-description-wrapper'>
            <Field
              render={({ form }) => (
                <Select
                  className='FormNewInvoiceArbitrableTx-template-description-wrapper-content'
                  classNamePrefix='select'
                  isClearable={false}
                  isSearchable={true}
                  name='templates'
                  options={templates}
                  styles={customStyles}
                  onChange={e => form.setFieldValue('description', e.content)}
                />
              )}
            />
          </div>
          <Field
            name='description'
            value={values.description}
            render={({ field, form }) => (
              <Textarea
                {...field}
                className='FormNewInvoiceArbitrableTx-textarea FormNewInvoiceArbitrableTx-input-description'
                minRows={10}
                onChange={e => {
                  handleChange(e)
                  form.setFieldValue('description', e.target.value)
                }}
              />
            )}
          />
          <ErrorMessage name='description' component='div' className='FormNewInvoiceArbitrableTx-error FormNewInvoiceArbitrableTx-error-description' />
          <div className='FormNewInvoiceArbitrableTx-submit'>
            {touched.description = true}
            {touched.file = true}
            {values.amount > 0 ? touched.amount = true : null}
            <Button 
              type='submit' 
              disabled={touched.amount === undefined || Object.entries(errors).length > 0 || isSubmitting}
            >
              {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}}><ClipLoader size={20} color={'white'} /></span>} Generate Invoice
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

NewInvoiceArbitrableTx.propTypes = {
  // State
  formArbitrabletx: PropTypes.func
}

NewInvoiceArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewInvoiceArbitrableTx
