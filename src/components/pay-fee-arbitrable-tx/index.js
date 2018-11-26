import React from 'react'
import PropTypes from 'prop-types'

import './pay-fee-arbitrable-tx.css'

const PayFeeArbitrableTx = ({ id, payFee }) => (
  <div>
    <button type="submit" onClick={() => payFee(id)}>
      Raise a dispute
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
  id: '',
  payFee: v => v
  // TODO
}

export default PayFeeArbitrableTx
