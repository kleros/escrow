import React from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'

import './email-form.css'

// Input feedback
const InputFeedback = ({ error }) =>
  error ? <div className="InputFeedback">{error}</div> : null

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
        type="checkbox"
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
        className="Checkbox"
      />
      <label htmlFor={id}>{label}</label>
      {touched[name] && <InputFeedback error={errors[name]} />}
    </div>
  )
}

const EmailForm = ({ updateEmail, msg, settingsAcc }) => (
  <div className="EmailForm">
    <h1 className="NewArbitrableTx-h1">Email Notifications</h1>
    <p className="EmailForm-msg">{msg}</p>
    <Formik
      initialValues={{
        email: settingsAcc.data.email,
        dispute: settingsAcc.data.disputeEmailNotification,
        appeal: settingsAcc.data.appealEmailNotification,
        rulingGiven: settingsAcc.data.rulingGivenEmailNotification
      }}
      validate={values => {
        {
          /* TODO use Yup */
        }
        let errors = {}
        if (!values.email) errors.email = 'Email Required'
        if (
          values.email &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
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
              `escrowNotificationSetting${`${v[0].toUpperCase()}${v.slice(1)}`}`
            ] = {
              BOOL: rest[v] || false
            }
            return acc
          }, {})
        }
        updateEmail({ settings })
      }}
    >
      {({ isSubmitting, touched, errors, values }) => (
        <Form className="EmailForm-Form">
          <Field
            component={Checkbox}
            name="dispute"
            id="dispute"
            label="A transaction is disputed."
          />
          <Field
            component={Checkbox}
            name="appeal"
            id="appeal"
            label="A transaction is appealed."
          />
          <Field
            component={Checkbox}
            name="rulingGiven"
            id="rulingGiven"
            label="A ruling is given."
          />
          <Field name="email" placeholder="Email" className="EmailForm-input" />
          {(touched.email = true)}
          <Button
            type="submit"
            disabled={
              values.email === '' ||
              isSubmitting ||
              Object.entries(errors).length > 0
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
                <ClipLoader size={20} color={'#fff'} />
              </span>
            )}{' '}
            Enable Notifications
          </Button>
          <ErrorMessage
            name="email"
            component="div"
            className="EmailForm-error"
          />
          <div>
            {settingsAcc.data.email !== '' && (
              <div
                style={{
                  display: 'inline-block',
                  color: '#270',
                  margin: '2em 0',
                  padding: '0 1em',
                  lineHeight: '40px',
                  background: '#dff2bf',
                  borderRadius: '5px',
                  fontSize: '0.9em'
                }}
              >
                Settings notifications saved.
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

export default EmailForm
