import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, ErrorMessage } from 'formik'
import { Form, Datepicker } from 'react-formik-ui'
import Select from 'react-select'
import Textarea from 'react-textarea-autosize'
import { ClipLoader } from 'react-spinners'

import { web3, ARBITRABLE_ADDRESSES } from '../../bootstrap/dapp-api'
import Button from '../button'
import templates from '../../constants/templates'

import './new-arbitrable-tx.css'

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #ccc',
    color: state.isSelected ? '#fff' : '#4a4a4a',
    background: state.isSelected
      ? '#4d00b4'
      : state.isFocused
      ? '#f5f5f5'
      : null
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'

    return { ...provided, opacity, transition }
  }
}

const NewArbitrableTx = ({ formArbitrabletx, accounts, balance }) => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="NewArbitrableTx">
      <h1 className="NewArbitrableTx-h1">New Payment</h1>
      <Formik
        initialValues={{
          arbitrableContractEnv: '',
          title: '',
          receiver: '',
          timeout: 0,
          amount: '',
          file: '',
          description: ''
        }}
        // eslint-disable-next-line react/jsx-no-bind
        validate={values => {
          const errors = {}
          if (!values.arbitrableContractEnv)
            errors.arbitrableContractEnv = 'Escrow Type Required.'
          if (!values.title) errors.title = 'Title Required.'
          if (values.title.length > 55)
            errors.title =
              'The title is too long. The maximum length is 55 characters.'
          if (!values.receiver)
            errors.receiver = "Receiver's ETH Address Required"
          if (!web3.utils.isAddress(values.receiver))
            errors.receiver = "Receiver's ETH Address must be valid."
          if (!values.timeout)
            errors.timeout = 'Timeout Date and Time Required.'
          if (values.timeout <= new Date())
            errors.timeout = 'Timeout Date and Time cannot be in the past.'
          if (!values.amount) errors.amount = 'Amount Required.'
          if (values.amount <= 0) errors.amount = 'Amount must be more than 0.'
          if (isNaN(values.amount)) errors.amount = 'Number Required.'
          if (values.amount > balance.data)
            errors.amount =
              'Amount must be equal to or lower than your ETH balance.'
          if (values.description.length > 1000000)
            errors.description =
              'The description is too long. The maximum length is 1,000,000 characters.'
          if (values.file.size > 5000000)
            errors.file = 'The file is too big. The maximum size is 5MB.'
          return errors
        }}
        onSubmit={values =>
          formArbitrabletx({
            ...values,
            timeout: Math.round((values.timeout - new Date()) / 1000)
          })
        }
      >
        {({
          errors,
          setFieldValue,
          touched,
          isSubmitting,
          values,
          handleChange
        }) => (
          <Form className="FormNewArbitrableTx">
            <label
              htmlFor="arbitrableContractEnv"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-arbitrableAddresses"
            >
              Escrow Type*
            </label>
            <div className="FormNewArbitrableTx-template-arbitrableAddresses-wrapper">
              <Field
                render={({ form }) => (
                  <Select
                    className="FormNewArbitrableTx-template-arbitrableAddresses-wrapper-content"
                    classNamePrefix="select"
                    isClearable={false}
                    isSearchable={false}
                    name="arbitrableContractEnv"
                    options={[
                      ...ARBITRABLE_ADDRESSES.map(contractEnv => ({
                        value: contractEnv,
                        label: contractEnv.type
                      }))
                    ]}
                    styles={customStyles}
                    placeholder="-- Select --"
                    onChange={e =>
                      form.setFieldValue('arbitrableContractEnv', e.value)
                    }
                  />
                )}
              />
            </div>
            <ErrorMessage
              name="arbitrableContractEnv"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-arbitrableAddresses"
            />
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-arbitrableAddresses">
              Eg. Freelancing
            </div>
            <label
              htmlFor="title"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-title"
            >
              Title*
            </label>
            <Field
              name="title"
              className="FormNewArbitrableTx-input FormNewArbitrableTx-input-title"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-title"
            />
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-title">
              Eg. Marketing Services Agreement with John
            </div>
            <label
              htmlFor="receiver"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-receiver"
            >
              Receiver's ETH Address*
            </label>
            <Field
              name="receiver"
              className="FormNewArbitrableTx-input FormNewArbitrableTx-input-receiver"
            />
            <ErrorMessage
              name="receiver"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-receiver"
            />
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-receiver">
              Enter the ETH address of the counterparty to this agreement.
            </div>
            <label
              htmlFor="timeout"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-timeout"
            >
              Timeout Date and Time (Local Time)*
            </label>
            <Datepicker
              name="timeout"
              className="FormNewArbitrableTx-input-timeout"
              placeholder="-- Select --"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="dd.MM.yyyy hh:mm aa"
              timeCaption="time"
              minDate={new Date()}
            />
            <ErrorMessage
              name="timeout"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-timeout"
            />
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-timeout">
              If no disputes are raised before this deadline, the transaction
              will be automatically processed.
            </div>
            <label
              htmlFor="amount"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-amount"
            >
              Amount (ETH)*
            </label>
            <Field
              name="amount"
              className="FormNewArbitrableTx-input FormNewArbitrableTx-input-amount"
            />
            <ErrorMessage
              name="amount"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-amount"
            />
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-amount">
              ETH amount that will be sent to the escrow as payment for the
              receiver.
              <br />
              Funds will stay in the escrow until the transaction is completed.
            </div>
            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <label
              htmlFor="file"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-file"
            >
              Agreement Documents (optional)
            </label>
            <div className="FormNewArbitrableTx-label FormNewArbitrableTx-input-file FileInput">
              <input
                id="file"
                style={{
                  border: '#009AFF',
                  padding: '0.6em 0',
                  fontSize: '1em'
                }}
                name="file"
                type="file"
                onChange={e => {
                  const file = e.currentTarget.files[0]
                  return setFieldValue('file', {
                    dataURL: (window.URL || window.webkitURL).createObjectURL(
                      file
                    ),
                    name: file.name,
                    size: file.size
                  })
                }}
              />
              <div className="FileInput-filename">
                {values.file ? values.file.name : '-- Upload --'}
              </div>
            </div>
            {errors.file && (
              <div className="FormNewArbitrableTx-error FormNewArbitrableTx-error-file">
                {errors.file}
              </div>
            )}
            <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-file">
              Upload a contract or document that specifies the terms of
              agreement of this payment.
              <br />
              If you need to add more than one file, zip them.
            </div>
            <label
              htmlFor="description"
              className="FormNewArbitrableTx-label FormNewArbitrableTx-label-description"
            >
              Contract Description (optional)
            </label>
            <div className="FormNewArbitrableTx-template-description-wrapper">
              <Field
                render={({ form }) => (
                  <Select
                    className="FormNewArbitrableTx-template-description-wrapper-content"
                    classNamePrefix="select"
                    isClearable={false}
                    isSearchable={true}
                    name="templates"
                    options={templates}
                    styles={customStyles}
                    onChange={e => form.setFieldValue('description', e.content)}
                  />
                )}
              />
            </div>
            <Field
              name="description"
              value={values.description}
              render={({ field, form }) => (
                <Textarea
                  {...field}
                  className="FormNewArbitrableTx-textarea FormNewArbitrableTx-input-description"
                  minRows={10}
                  onChange={e => {
                    handleChange(e)
                    form.setFieldValue('description', e.target.value)
                  }}
                />
              )}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="FormNewArbitrableTx-error FormNewArbitrableTx-error-description"
            />
            <div className="FormNewArbitrableTx-submit">
              {(touched.description = true)}
              {(touched.file = true)}
              {values.amount > 0 ? (touched.amount = true) : null}
              <Button
                type="submit"
                disabled={
                  touched.receiver === undefined ||
                  touched.amount === undefined ||
                  Object.entries(errors).length > 0 ||
                  isSubmitting
                }
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
                    <ClipLoader size={20} color={'white'} />
                  </span>
                )}{' '}
                Next
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

NewArbitrableTx.propTypes = {
  // State
  formArbitrabletx: PropTypes.func
}

NewArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewArbitrableTx
