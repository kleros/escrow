import React from 'react'
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
}) => (
  <Formik
    initialValues={{ id, amount, amountMax }}
    // eslint-disable-next-line react/jsx-no-bind
    validate={() => {
      const errors = {}
      if (!amount) errors.amount = 'Amount Required.'
      if (amount <= 0) errors.amount = 'Amount must be more than 0.'
      if (amount > amountMax)
        errors.amount = `Amount must be less than or equal to ${amountMax} ETH.`
      if (isNaN(amount)) errors.amount = 'Number Required.'
      return errors
    }}
    // eslint-disable-next-line react/jsx-no-bind
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
            // eslint-disable-next-line react/jsx-no-bind
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
                  paddingRight: '4px' // stylelint-disable-line declaration-block-trailing-semicolon
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
            textAlign: 'right' // stylelint-disable-line declaration-block-trailing-semicolon
          }}
        />
      </>
    )}
  </Formik>
)

PayOrReimburseArbitrableTx.propTypes = {
  payOrReimburseFn: PropTypes.func,
  payOrReimburse: PropTypes.string.isRequired,
  arbitrable: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  amountMax: PropTypes.number.isRequired,
  onChangeAmount: PropTypes.func.isRequired
}

PayOrReimburseArbitrableTx.defaultProps = {
  payOrReimburseFn: v => v
}

export default PayOrReimburseArbitrableTx
