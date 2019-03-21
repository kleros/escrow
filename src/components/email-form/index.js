import React from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'
import { ReactComponent as Bell } from '../../assets/bell.svg'

import './email-form.css'

// Input feedback
const InputFeedback = ({ error }) =>
  error ? <div className='InputFeedback'>{error}</div> : null

// Checkbox input
const Checkbox = ({
  field: { name, value, onChange, onBlur },
  form: { errors, touched, setFieldValue },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <input
        name={name}
        id={id}
        type='checkbox'
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
        className='Checkbox'
      />
      <label htmlFor={id}>{label}</label>
      {touched[name] && <InputFeedback error={errors[name]} />}
    </div>
  )
}

const EmailForm = ({updateEmail, msg, settingsAcc}) => (
  <div className='EmailForm'>
    <h1 className='NewArbitrableTx-h1'><Bell style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />Email Notifications</h1>
    <p className='EmailForm-msg'>
      {msg}
    </p>
    <Formik
      initialValues={{ 
        email: settingsAcc.data.email,
        dispute: settingsAcc.data.disputeEmailNotification,
        appeal: settingsAcc.data.appealEmailNotification,
        rulingGiven: settingsAcc.data.rulingGivenEmailNotification
      }}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        if (!values.email)
          errors.email = 'Email Required'
        if (
          values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        return errors
      }}
      onSubmit={async values => {
        const { email, ...rest } = values
        const settings = {
          email: { S: email },
          ...Object.keys(rest).reduce((acc, v) => {
            acc[
              `escrowNotificationSetting${`${v[0].toUpperCase()}${v.slice(
                1
              )}`}`
            ] = {
              BOOL: rest[v] || false
            }
            return acc
          }, {})
        }
        updateEmail({settings})
      }}
    >
      {({ isSubmitting, touched, errors }) => (
        <Form className='EmailForm-Form'>
            <div className='EmailForm-title-b'>I wish to be notified when:</div>
            <Field
              component={Checkbox}
              name="dispute"
              id="dispute"
              label="When the arbitrable payment transaction is disputed."
            />
            <Field
              component={Checkbox}
              name="appeal"
              id="appeal"
              label="When the arbitrable payment transaction is appealed."
            />
            <Field
              component={Checkbox}
              name="rulingGiven"
              id="rulingGiven"
              label="When a ruling is given."
            />
            <Field name='email' placeholder='Email' className='EmailForm-input' />
            <Button type='submit' disabled={!touched.email || isSubmitting || Object.entries(errors).length > 0}>
              {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Enable Notifications
            </Button>
            <ErrorMessage name='email' component='div' className='EmailForm-error'/>
            <div>
              {settingsAcc.data.email !== '' && <div style={{display: 'inline-block', color: '#270', margin: '2em 0', padding: '0 1em', lineHeight: '40px', background: '#dff2bf', borderRadius: '5px', fontSize: '0.9em'}}>Settings notifications saved.</div>}
            </div>
        </Form>
      )}
    </Formik>
  </div>
)

export default EmailForm
