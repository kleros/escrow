import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'

import './pay-or-reimburse-arbitrable-tx.css'

const PayOrReimburseArbitrableTx = ({
  payOrReimburse,
  arbitrable,
  id,
  amount,
  amountMax,
  payOrReimburseFn,
  onChangeAmount
}) => {
  return (
    <Formik
      initialValues={{ id, amount, amountMax }}
      validate={values => {
        {
          /* TODO use Yup */
        }
        {
          /* NOTE we use amount instead of `values.amount` */
        }
        let errors = {}
        if (!amount) errors.amount = 'Amount Required'
        if (amount <= 0) errors.amount = 'Amount must be positive.'
        if (amount > amountMax)
          errors.amount = `Amount must be less or equal than ${amountMax} ETH`
        if (isNaN(amount)) errors.amount = 'Number Required'
        return errors
      }}
      onSubmit={() => payOrReimburseFn(arbitrable, id, amount.toString())}
    >
      {({ isSubmitting }) => (
        <>
          <Form
            className={
              'PayOrReimburseArbitrableTx PayOrReimburseArbitrableTx-pay'
            }
          >
            <Field
              name="amount"
              placeholder="amount"
              value={amount}
              className="PayOrReimburseArbitrableTx-pay-field"
              onChange={e => onChangeAmount(e.target.value)}
            />
            <Button
              className="PayOrReimburseArbitrableTx-pay-Button"
              type="submit"
              disabled={isSubmitting}
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
              {payOrReimburse}
            </Button>
          </Form>
          <ErrorMessage
            name="amount"
            component="div"
            className="error"
            style={{
              paddingTop: '10px',
              paddingRight: '30px',
              color: 'red',
              fontSize: '0.9em',
              textAlign: 'right'
            }}
          />
        </>
      )}
    </Formik>
  )
}

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
