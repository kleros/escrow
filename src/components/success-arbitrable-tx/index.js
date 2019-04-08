import React from 'react'
import PropTypes from 'prop-types'

import './success-arbitrable-tx.css'

const SuccessArbitrableTx = ({ message, children, footer }) => (
  <div className="SuccessArbitrableTx">
    <div className="SuccessArbitrableTx-message">{message}</div>
    {children}
    <div className="SuccessArbitrableTx-footer">{footer}</div>
  </div>
)

SuccessArbitrableTx.propTypes = {
  // State
  message: PropTypes.string
  // TODO
}

SuccessArbitrableTx.defaultProps = {
  // State
  message: ''
  // TODO
}

export default SuccessArbitrableTx
