import React from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import './arbitrable-tx-cards.css'

/**
 * Contract Display List Component
 * @param arbitrabletxs - list of arbitrable transactions
 * @returns {*}
 */
const ArbitrableTxCards = ({ arbitrabletxs }) => (
  <div className='ArbitrableTxCards'>
    <h1 className='ArbitrableTxCards-h1'>My Transactions</h1>
    {
      arbitrabletxs.length > 0 ? (
        <div className='ArbitrableTxCards-cards'>
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