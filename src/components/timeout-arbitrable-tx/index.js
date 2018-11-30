import React from 'react'
import PropTypes from 'prop-types'

import Button from '../button'

const TimeoutArbitrableTx = ({ id, timeout, name }) => (
  <Button type="submit" onClick={() => timeout(id)}>
    {name}
  </Button>
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
