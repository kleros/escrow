import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, ErrorMessage } from 'formik'
import { Form, Datepicker } from 'react-formik-ui'
import DateInput from 'react-datepicker'
import Textarea from 'react-textarea-autosize'
import { ClipLoader } from 'react-spinners'

import { web3 } from '../../bootstrap/dapp-api'
import Button from '../button'
import InputArea from '../details-area'
import TokenSelectInput from '../token-select-input'
import ETH from '../../constants/eth'
import MAX_TIMEOUT from '../../constants/timeout'
import { displayDateUTC } from '../../utils/date'

import './new-arbitrable-tx.css'

const substituteTextOptionalInputs = (inputs, text) => {
  for (let key of Object.keys(inputs)) {
    if (inputs[key]) {
      text = text.replace(`[${key}]`, inputs[key])
    }
  }

  return text
}

const NewArbitrableTx = ({ formArbitrabletx, accounts, balance, tokens, template, invoice, back, stablecoins }) => {
  const [showAutomaticPayment, setShowAutomaticPayment] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const initialAddress = invoice ? accounts.data[0] : ''
  return (
    <div className="NewArbitrableTx">
      <h1 className="NewArbitrableTx-h1">New {invoice ? 'Invoice' : 'Payment'}</h1>
        <Formik
          initialValues={{
            arbitrableContractAddress: template.address,
            subCategory: template.label,
            title: '',
            receiver: initialAddress,
            timeout: 0,
            amount: '',
            invoice,
            file: '',
            description: template.content,
            tips: template.tips,
            extraData: {},
            substitutions: {},
            token: ETH
          }}
          // eslint-disable-next-line react/jsx-no-bind
          validate={values => {
            const errors = {}
            if (!values.title) errors.title = 'Title Required.'
            if (values.title.length > 55)
              errors.title =
                'The title is too long. The maximum length is 55 characters.'
            if (!values.receiver)
              errors.receiver = "Receiver's ETH Address Required"
            if (!web3.utils.isAddress(values.receiver))
              errors.receiver = "Receiver's ETH Address must be valid."
            if (showAutomaticPayment && values.timeout <= new Date())
              errors.timeout = 'Timeout Date and Time cannot be in the past.'
            if (!values.amount) errors.amount = 'Amount Required.'
            if (values.amount <= 0) errors.amount = 'Amount must be more than 0.'
            if (isNaN(values.amount)) errors.amount = 'Number Required.'
            if (values.description.length > 1000000)
              errors.description =
                'The description is too long. The maximum length is 1,000,000 characters.'
            if (values.description.length < 1)
              errors.description =
                'Description is required.'
            if (showFileUpload && values.file.size > 1024 * 1024 * 4)
              errors.file = 'The file is too big. The maximum size is 4MB.'
            for (let extraDetailsKeys of Object.keys(template.optionalInputs)) {
              if (!values.extraData[extraDetailsKeys])
                errors[extraDetailsKeys] = 'Field required'
            }
            return errors
          }}
          onSubmit={values => {
            if (!showAutomaticPayment)
              values.timeout = MAX_TIMEOUT // Max Timeout
            else
              values.timeout = Math.round((values.timeout - new Date()) / 1000)

            if (!showFileUpload)
              values.file = ''

            return formArbitrabletx({
              ...values
            })
          }}
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
              <InputArea title={'Payment Info'} headerSpacing={true} inputs={(
                    <div className="FormNewArbitrableTx-PaymentDetails">
                      <label
                        htmlFor="title"
                        className="FormNewArbitrableTx-label FormNewArbitrableTx-label-title"
                      >
                        Title*
                      </label>
                      <Field
                        name="title"
                        id="title"
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
                        Fund Receiver*
                      </label>
                      <Field
                        name="receiver"
                        id="receiver"
                        className="FormNewArbitrableTx-input FormNewArbitrableTx-input-receiver"
                      />
                      <ErrorMessage
                        name="receiver"
                        component="div"
                        className="FormNewArbitrableTx-error FormNewArbitrableTx-error-receiver"
                      />
                      <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-receiver">
                        ETH address that will receive the funds <span style={{fontWeight: 800}}>(Do not use an exchange address)</span>.
                      </div>
                      <label
                        htmlFor="amount"
                        className="FormNewArbitrableTx-label FormNewArbitrableTx-label-amount"
                      >
                        Amount*
                      </label>
                      <div className="FormNewArbitrableTx-input-amount">
                        <Field
                          name="amount"
                          id="amount"
                          className="FormNewArbitrableTx-input"
                        />
                        <div className="FormNewArbitrableTx-amount-select">
                          <TokenSelectInput tokens={tokens} onSubmit={(token) => {
                              setFieldValue('token', token)
                            }} stablecoins={stablecoins} />
                        </div>
                      </div>
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="FormNewArbitrableTx-error FormNewArbitrableTx-error-amount"
                      />
                      <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-amount">
                        Amount of the asset that will be held in escrow.
                        <br />
                        Funds will stay in the escrow until the payment is completed.
                      </div>
                      <label
                        htmlFor="timeout"
                        className="FormNewArbitrableTx-label FormNewArbitrableTx-label-timeout"
                      >
                        <input
                          type="checkbox"
                          className="FormNewArbitrableTx-label-optional-checkbox"
                          onChange= {(e) => {
                            setShowAutomaticPayment(e.target.checked)
                          }}
                        />
                      Automatic Payment (Local Time)
                      </label>
                      { showAutomaticPayment ? (
                        <>
                          <Datepicker
                            name="timeout"
                            className="FormNewArbitrableTx-input-timeout"
                            placeholder="-- Select --"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={30}
                            dateFormat="dd.MM.yyyy HH:mm"
                            timeCaption="time"
                            minDate={new Date()}
                          />
                          <ErrorMessage
                            name="timeout"
                            component="div"
                            className="FormNewArbitrableTx-error FormNewArbitrableTx-error-timeout"
                          />
                          <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-timeout">
                            If a dispute isn't raised, escrowed funds will be automatically sent on this date.
                          </div>
                        </>
                      ) : ''}
                      {/* hack Formik for file type */}
                      {/* and store only the path on the file in the redux state */}
                      <label
                        htmlFor="file"
                        className="FormNewArbitrableTx-label FormNewArbitrableTx-label-file"
                      >
                        <input
                          type="checkbox"
                          className="FormNewArbitrableTx-label-optional-checkbox"
                          onChange={(e) => {
                            setShowFileUpload(e.target.checked)
                          }}
                        />
                      Agreement Document (Optional)
                      </label>
                      { showFileUpload ? (
                        <>
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
                          <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-file">
                            Upload a contract or document that specifies the terms of
                            agreement of this payment.
                            <br />
                            If you need to add more than one file, zip them.
                          </div>
                        </>
                      ) : ''}
                  </div>
              )} />
            <InputArea className="FormNewArbitrableTx-ExtraDetails" headerSpacing={true} title={`Extra Details | ${template.label}`} inputs={
                  Object.keys(template.optionalInputs).map((inputKey, i) => (
                        <div key={i}>
                          <label
                            htmlFor={inputKey}
                            className="FormNewArbitrableTx-label"
                          >{inputKey + '*'}</label>
                        { template.optionalInputs[inputKey].type === 'date' ? (
                            <DateInput
                              disabledKeyboardNavigation
                              autoComplete="off"
                              placeholder="--Select--"
                              selected={values.extraData[inputKey]}
                              id={inputKey}
                              name={inputKey}
                              className="FormNewArbitrableTx-input FormNewArbitrableTx-ExtraDetails-input"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={30}
                              dateFormat="dd.MM.yyyy HH:mm"
                              minDate={new Date()}
                              onChange={(e) => {
                                const _extraData = values.extraData
                                const _substitutions = values.substitutions
                                _extraData[inputKey] = e
                                _substitutions[inputKey] = displayDateUTC(e)
                                setFieldValue('extraData', _extraData)
                                setFieldValue('substitutions', _substitutions)
                                setFieldValue('description', substituteTextOptionalInputs(_substitutions, template.content))
                              }}
                            />
                        ) : (template.optionalInputs[inputKey].type === 'textarea' ? (
                          <textarea
                            rows={8}
                            id={inputKey}
                            className="FormNewArbitrableTx-input FormNewArbitrableTx-ExtraDetails-input"
                            onChange={(e) => {
                              const _extraData = values.extraData
                              const _substitutions = values.substitutions
                              _extraData[inputKey] = e.target.value
                              _substitutions[inputKey] = e.target.value
                              setFieldValue('extraData', _extraData)
                              setFieldValue('substitutions', _substitutions)
                              setFieldValue('description', substituteTextOptionalInputs(_substitutions, template.content))
                            }}
                          />
                        ) : (
                          <input
                            type={template.optionalInputs[inputKey].type}
                            id={inputKey}
                            className="FormNewArbitrableTx-input FormNewArbitrableTx-ExtraDetails-input"
                            onChange={(e) => {
                              const _extraData = values.extraData
                              const _substitutions = values.substitutions
                              _extraData[inputKey] = e.target.value
                              _substitutions[inputKey] = e.target.value
                              setFieldValue('extraData', _extraData)
                              setFieldValue('substitutions', _substitutions)
                              setFieldValue('description', substituteTextOptionalInputs(_substitutions, template.content))
                            }}
                          />
                        ))}
                        <div className="FormNewArbitrableTx-help">{template.optionalInputs[inputKey].tip}</div>
                        <ErrorMessage
                          name={inputKey}
                          component="div"
                          className="FormNewArbitrableTx-error"
                        />
                      </div>
                      )
                    )
                  }
              />
              <div className="FormNewArbitrableTx-Bottom">
                <label
                  htmlFor="description"
                  className="FormNewArbitrableTx-label FormNewArbitrableTx-label-description FormNewArbitrableTx-Bottom-title"
                >
                  Contract Information*
                </label>
                <Field
                  name="description"
                  value={values.description}
                  render={({ field, form }) => (
                    <Textarea
                      {...field}
                      className="FormNewArbitrableTx-Bottom-textarea FormNewArbitrableTx-input-description"
                      minRows={10}
                      disabled="disabled"
                    />
                  )}
                />
                {
                  values.tips && (
                    <div className="FormNewArbitrableTx-help FormNewArbitrableTx-help-tips">
                      {values.tips.map((tip, i) => (
                          <div className="FormNewArbitrableTx-help-tips-tip" key={i}>
                            {tip}
                          </div>
                        )
                      )}
                    </div>
                  )
                }
                <ErrorMessage
                  name="description"
                  component="div"
                  className="FormNewArbitrableTx-error FormNewArbitrableTx-error-description"
                />
                <div className="FormNewArbitrableTx-Bottom-buttons">
                  <span>
                    <div className="FormNewArbitrableTx-Bottom-buttons-back" onClick={back}>
                      Back
                    </div>
                    <div className="FormNewArbitrableTx-Bottom-buttons-submit">
                        {(touched.description = true)}
                        {(touched.file = true)}
                        {values.amount > 0 ? (touched.amount = true) : null}
                        <Button
                          type="submit"
                          disabled={
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
                    </span>
                  </div>
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
