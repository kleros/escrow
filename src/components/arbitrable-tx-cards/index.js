import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "@reach/router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

/**
 * Contract Display List Component
 * @param arbitrabletxs - list of arbitrable transactions
 * @returns {*}
 */
const ArbitrableTxCards = ({ arbitrabletxs }) => (
  <div className="">
    {
      arbitrabletxs.length > 0 ? (
        <div>
          {
            arbitrabletxs.map(arbitrabletx => (
              <span>
                <Link to={`${arbitrabletx.id}`} key={arbitrabletx.id} getProps={() => ({className: "test class"})}>{arbitrabletx.id}</Link>
                {` `}
              </span>
            ))
          }
        </div>
      ) : (
        <Link to="new">New Transaction <FontAwesomeIcon icon={faPlus} /></Link>
      )
    }
  </div>
)

ArbitrableTxCards.propTypes = {
  // State
  arbitrabletxs: PropTypes.array
}

ArbitrableTxCards.defaultProps = {
  // State
  arbitrabletxs: []
}

export default ArbitrableTxCards