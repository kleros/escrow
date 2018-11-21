import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as arbitrabletxActions from '../../actions/arbitrable-transaction'

const NewArbitrableTx = ({ createArbitrabletx }) => (
  <div>
    <h1>Create arbitrable transaction</h1>
    <Formik
      initialValues={{title: '', description: '', file: '', arbitrator: '', seller: '', payment: '', email: ''}}
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
      onSubmit={arbitrabletx => createArbitrabletx(arbitrabletx)} 
    >
      {({ setFieldValue }) => (
        <Form>
          <Field name="title" placeholder="title" />
          <ErrorMessage name="title" component="div" />

          <Field type="textarea" name="description" />
          <ErrorMessage name="description" component="div" className="def" />

          {/* hack Formik for file type */}
          {/* and store only the path on the file in the redux state */}
          <input id="file" name="file" type="file" onChange={e =>
            setFieldValue("file", window.URL.createObjectURL(e.currentTarget.files[0]))
          } />

          <Field name="arbitrator" />
          <ErrorMessage name="arbitrator" component="div" />

          <Field name="seller" />
          <ErrorMessage name="seller" component="div" />

          <Field name="payment" />
          <ErrorMessage name="payment" component="div" />

          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" className="error class" />

          <button type="submit">
            Save Transaction
          </button>
        </Form>
      )}
    </Formik>
  </div>
)

export default NewArbitrableTx
