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
      if (values.amount > amount)
        errors.amount = `Amount must be less than ${amount} ETH`
      if (isNaN(values.amount))
        errors.amount = 'Number Required'
      return errors
    }}
    onSubmit={values => payOrReimburseFn(id, values.amount)}
  >
    {({isSubmitting}) => (
      <>
        <Form className={'PayOrReimburseArbitrableTx'}>
          <Field name='amount' placeholder='amount' style={{padding: '11px 22px 11px 12px', fontSize: '14px', marginRight: '-3px'}} />
          <Button type='submit' disabled={isSubmitting}>
            {payOrReimburse}
          </Button>
        </Form>
        <ErrorMessage name='amount' component='div' className='error' style={{paddingTop: '10px', color: 'red', fontSize: '0.9em'}} />
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
