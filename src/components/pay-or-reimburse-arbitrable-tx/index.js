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
      if (!values.amount)
        errors.amount = 'Amount Required'
      if (values.amount <= 0)
        errors.amount = 'Amount must be positive.'
      if (values.amount > amount)
        errors.amount = `Amount must be less or equal than ${amount} ETH`
      if (isNaN(values.amount))
        errors.amount = 'Number Required'
      return errors
    }}
    onSubmit={values => payOrReimburseFn(id, values.amount)}
  >
    {({isSubmitting}) => (
      <>
        <Form className={'PayOrReimburseArbitrableTx PayOrReimburseArbitrableTx-pay'}>
          <Field name='amount' placeholder='amount' className='PayOrReimburseArbitrableTx-pay-field' />
          <Button type='submit' disabled={isSubmitting}>
            {payOrReimburse}
          </Button>
        </Form>
        <ErrorMessage name='amount' component='div' className='error' style={{paddingTop: '10px', paddingRight: '30px', color: 'red', fontSize: '0.9em', textAlign: 'right'}} />
      </>
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
