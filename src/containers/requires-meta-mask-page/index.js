import React from 'react'
import PropTypes from 'prop-types'

import RequiresMetaMask from '../../components/requires-meta-mask'

import './requires-meta-mask-page.css'

const RequiresMetaMaskPage = ({ needsUnlock }) => (
  <div className="RequiresMetaMaskPage">
    <RequiresMetaMask needsUnlock={needsUnlock} />
  </div>
)

RequiresMetaMaskPage.propTypes = {
  // State
  needsUnlock: PropTypes.bool.isRequired
}

export default RequiresMetaMaskPage