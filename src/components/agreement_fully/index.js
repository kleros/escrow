import React from 'react'
import PropTypes from 'prop-types'

import './agreement-fully.css'

const AgreementFully = ({ message, children, footer }) => (
  <div className='AgreementFully'>
    <div className='AgreementFully-message'>
      {message}
      {children}
    </div>
    <div className='AgreementFully-footer'>
      {footer}
    </div>
  </div>
)

AgreementFully.propTypes = {
  // State
  message: PropTypes.string,
  // TODO
}

AgreementFully.defaultProps = {
  // State
  message: '',
  // TODO
}

export default AgreementFully
