import React from 'react'
import { Link } from "@reach/router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

/**
 * Contract Display List Component
 * @param contract
 * @param props - e.g. must receive this.props with a history field
 * @param accounts
 * @returns {*}
 * @constructor
 */
export const ArbitrableTxCards = ({ arbitrabletxs }) => (
  <div className="flex-container">
    {
      arbitrabletxs.length > 0 ? (
        <div>
          {
            arbitrabletxs.map(arbitrabletx => (
              <Link to={`${arbitrabletx.id}`} key={arbitrabletx.id} getProps={() => ({className: "test class"})}>{arbitrabletx.id}</Link>
            ))
          }
        </div>
      ) : (
        <Link to="new">New Transaction <FontAwesomeIcon icon={faPlus} /></Link>
      )
    }
  </div>
)

const isActive = ({ isCurrent }) => {
  return isCurrent ? { className: "active" } : null
}

isActive(true)