import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Button from '../button'

import './pay-or-reimburse-arbitrable-tx.css'

const PayOrReimburseArbitrableTx = ({ payOrReimburse, id, amount, payOrReimburseFn }) => (
  <Formik
    initialValues={{amount, id}}
    validate = {values => {
      {/* TODO use Yup */}
      let errors = {}
      return errors
    }}
    onSubmit={values => payOrReimburseFn(id, values.amount)}
  >
    {() => (
      <Form className={'PayOrReimburseArbitrableTx'}>
        <Field name='amount' placeholder='amount' style={{padding: '11px 22px 11px 12px', fontSize: '14px', marginRight: '-3px'}} />
        <ErrorMessage name='title' component='div' />

        <Button type='submit'>
          {payOrReimburse}
        </Button>
      </Form>
    )}
  </Formik>
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
