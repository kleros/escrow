import React from 'react'
import PropTypes from 'prop-types'

import './button.css'

const Button = ({
  children,
  onClick,
  disabled,
  type,
  className,
  ...rest
}) => (
  <button
      onClick={onClick}
      type={type}
      className={`Button ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
  </button>
)

Button.propTypes = {
  // State
  children: PropTypes.node.isRequired,

  // Handlers
  onClick: PropTypes.func,

  // Modifiers
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

Button.defaultProps = {
  // Handlers
  onClick: null,

  // Modifiers
  disabled: false,
  type: '',
  className: ''
}

export default Button