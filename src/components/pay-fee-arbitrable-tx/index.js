import React from 'react'
import PropTypes from 'prop-types'

import './pay-fee-arbitrable-tx.css'

const PayFeeArbitrableTx = ({ arbitrable, id, payFee }) => (
  <div>
    <button
      type="submit"
      style={{ float: 'right' }}
      onClick={() => payFee(arbitrable, id)}
    >
      Raise a Dispute
    </button>
  </div>
)

PayFeeArbitrableTx.propTypes = {
  // State
  id: PropTypes.string,
  payFee: PropTypes.func
  // TODO
}

PayFeeArbitrableTx.defaultProps = {
  // State
  arbitrable: '',
  id: '',
  payFee: v => v
  // TODO
}

export default PayFeeArbitrableTx
