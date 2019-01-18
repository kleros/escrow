import React from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'

import Button from '../button'
import { ReactComponent as Email } from '../../assets/plus-purple.svg'

import './notifications.css'

const Notifications = () => (
  <div className='NewArbitrableTx'>
    <h1 className='NewArbitrableTx-h1'><Email style={{width: '20px', height: '35px', position: 'relative', top: '11px', paddingRight: '8px'}} />Notifications</h1>
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
      onSubmit={email => {}}
    >
      {({ setFieldValue }) => (
        <Form className='FormNewArbitrableTx'>
          <div className='section-title'>
            <label htmlFor='email'>Email</label>
            <Field name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' className='error'/>
          </div>
          <div className='section-submit'>
            <Button type='submit'>Enable Notifications</Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

export default Notifications
