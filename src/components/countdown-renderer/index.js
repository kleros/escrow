import React from 'react'
import PropTypes from 'prop-types'

const CountdownRenderer = ({ days, hours, minutes, seconds }) => (
  <span>
    {days > 0 ? `${days} Days, ` : ''}
    {hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:
    {minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:
    {seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
  </span>
)

CountdownRenderer.propTypes = {
  days: PropTypes.number.isRequired,
  hours: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired
}

export default CountdownRenderer
