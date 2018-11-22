import React from 'react'
import PropTypes from 'prop-types'

const AppealArbitrableTx = ({ id, appeal }) => (
  <div>
    <button type="submit" onClick={() => appeal(id)}>
      Appeal
    </button>
  </div>
)

AppealArbitrableTx.propTypes = {
  // State
  appeal: PropTypes.func,
  id: PropTypes.string
}

AppealArbitrableTx.defaultProps = {
  // State
  appeal: v => v,
  id: ''
}

export default AppealArbitrableTx
