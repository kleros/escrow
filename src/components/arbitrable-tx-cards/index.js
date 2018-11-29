import React from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { shortAddress } from '../../utils/short-address'

import Identicon from '../identicon'

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
              <section className='ArbitrableTxCards-cards-section' key={arbitrabletx.id} onClick={() => navigate(arbitrabletx.id)}>
                <div className='ArbitrableTxCards-cards-section-header'>
                  <Identicon scale={3} round={true} address={arbitrabletx[arbitrabletx.party]} />
                  <div className='ArbitrableTxCards-cards-section-header-address'>{shortAddress(arbitrabletx[arbitrabletx.party])}</div>
                  <div className='ArbitrableTxCards-cards-section-header-party'>{arbitrabletx.party}</div>
                </div>
                <h2 className='ArbitrableTxCards-cards-section-h2'>Title</h2> {/* FIXME replace by arbitrabletx.title */}
                <p className='ArbitrableTxCards-cards-section-p'>Description</p>  {/* FIXME replace by arbitrabletx.description */}
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