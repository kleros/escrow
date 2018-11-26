import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const PayOrReimburseArbitrableTx = ({ payOrReimburse, id, amount, payOrReimburseFn }) => (
  <div style={{float: 'right'}}>
    <Formik
      initialValues={{amount, id}}
      validate = {values => {
        {/* TODO use Yup */}
        let errors = {}
        return errors
      }}
      onSubmit={values => payOrReimburseFn(id, values.amount)}
    >
      {({ setFieldValue }) => (
        <Form>
          <Field name="amount" placeholder="amount" />
          <ErrorMessage name="title" component="div" />

          <button type="submit">
            {payOrReimburse}
          </button>
        </Form>
      )}
    </Formik>
  </div>
)

PayOrReimburseArbitrableTx.propTypes = {
  // State
  payOrReimburseFn: PropTypes.func
  // TODO
}

PayOrReimburseArbitrableTx.defaultProps = {
  // State
  payOrReimburseFn: v => v
  // TODO
}

export default PayOrReimburseArbitrableTx
