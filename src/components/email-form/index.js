import React from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'
import { ReactComponent as Bell } from '../../assets/bell.svg'

import './email-form.css'

const EmailForm = ({updateEmail, msg}) => (
  <div className='EmailForm'>
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
        <Form className='EmailForm-Form'>
          <div className='section-title'>
            <Field name='email' placeholder='Email' className='EmailForm-input' />
            <ErrorMessage name='email' component='div' className='EmailForm-error'/>
            <Button type='submit' disabled={isSubmitting || touched.email === undefined || Object.entries(errors).length > 0}>
              {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Enable Notifications
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

export default EmailForm
