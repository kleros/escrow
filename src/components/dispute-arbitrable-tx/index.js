import React from 'react'
import PropTypes from 'prop-types'

import './dispute-arbitrable-tx.css'

const DisputeArbitrableTx = ({ message, children, footer }) => (
  <div className='DisputeArbitrableTx'>
    <div className='DisputeArbitrableTx-message'>{message}</div>
    {children}
    <div className='DisputeArbitrableTx-footer'>{footer}</div>
  </div>
)

DisputeArbitrableTx.propTypes = {
  // State
  message: PropTypes.object,
  // TODO
}

DisputeArbitrableTx.defaultProps = {
  // State
  message: {},
  // TODO
}

export default DisputeArbitrableTx
