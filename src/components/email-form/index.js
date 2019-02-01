import React from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'

import Button from '../button'
import { ReactComponent as Bell } from '../../assets/bell.svg'

import './email-form.css'

const EmailForm = ({updateEmail, msg}) => (
  <div className='NewArbitrableTx'>
    <h1 className='NewArbitrableTx-h1'><Bell style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />Notifications</h1>
    <p className='EmailForm-msg'>
      {msg}
    </p>
    <Formik
      initialValues={{ email: '' }}
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
      onSubmit={email => updateEmail(email)}
    >
      {({ isSubmitting, touched, errors }) => (
        <Form className='FormNewArbitrableTx'>
          <div className='section-title'>
            <label htmlFor='email'>Email</label>
            <Field name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' className='error'/>
          </div>
          <div className='section-submit'>
            <Button type='submit' disabled={isSubmitting || touched.email === undefined || Object.entries(errors).length > 0}>Enable Notifications</Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

export default EmailForm
