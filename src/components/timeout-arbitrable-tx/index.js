import React from 'react'
import PropTypes from 'prop-types'

const TimeoutArbitrableTx = ({ id, timeout }) => (
  <div>
    <button type="submit" onClick={() => timeout(id)}>
      Timeout
    </button>
  </div>
)

TimeoutArbitrableTx.propTypes = {
  // State
  timeout: PropTypes.func,
  id: PropTypes.string
}

TimeoutArbitrableTx.defaultProps = {
  // State
  timeout: v => v,
  id: ''
}

export default TimeoutArbitrableTx
