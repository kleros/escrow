import React from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

/**
 * Contract Display List Component
 * @param arbitrabletxs - list of arbitrable transactions
 * @returns {*}
 */
const ArbitrableTxCards = ({ arbitrabletxs }) => (
  <div className=''>
    {
      arbitrabletxs.length > 0 ? (
        <div>
          {
            arbitrabletxs.map(arbitrabletx => (
              <section onClick={() => navigate(arbitrabletx.id)}>
                <h2>{arbitrabletx.buyer.substring(0, 7)} (TODO title)</h2> {/* FIXME replace by arbitrabletx.title */}
                <p>{arbitrabletx.seller.substring(0, 7)} (TODO description)</p>  {/* FIXME replace by arbitrabletx.description */}
              </section>
            ))
          }
        </div>
      ) : (
        <Link to='new'>New Transaction <FontAwesomeIcon icon={faPlus} /></Link>
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