import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const NewArbitrableTx = ({ createArbitrabletx }) => (
  <div>
    <h1>Create arbitrable transaction</h1>
    <Formik
      initialValues={{ title: '', description: '', file: '', arbitrator: '', seller: '', payment: '', email: '' }}
      validate = {values => {
        let errors = {}
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors
      }}
      onSubmit={values => {
        createArbitrabletx(values)
      }} 
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field name="title" placeholder="title" />
          <ErrorMessage name="title" component="div" />

          <Field type="textarea" name="description" />
          <ErrorMessage name="description" component="div" />

          {/* hack Formik for file type */}
          <input id="file" name="file" type="file" onChange={e => {
            setFieldValue("file", e.currentTarget.files[0]);
          }} />

          <Field name="arbitrator" />
          <ErrorMessage name="arbitrator" component="div" />

          <Field name="seller" />
          <ErrorMessage name="seller" component="div" />

          <Field name="payment" />
          <ErrorMessage name="payment" component="div" />

          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
)

export default NewArbitrableTx
