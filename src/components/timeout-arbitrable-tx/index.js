import React from 'react'
import PropTypes from 'prop-types'
import Countdown from 'react-countdown-now'

import Button from '../button'

const TimeoutArbitrableTx = ({ id, timeout, time, name }) => (
  <React.Fragment>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '0.9em'}}>Timeout</div>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '1.2em', paddingBottom: '10px'}}><Countdown date={time} /></div>
    <Button type="submit" onClick={() => timeout(id)}>
      {name}
    </Button>
  </React.Fragment>

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
