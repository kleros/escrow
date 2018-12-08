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
                <h2 className='ArbitrableTxCards-cards-section-h2'>{arbitrabletx.metaEvidence && arbitrabletx.metaEvidence.title} sea vapours; you can sleep under it beneath the stars which shine so re</h2>
                <p className='ArbitrableTxCards-cards-section-p'>{arbitrabletx.metaEvidence && arbitrabletx.metaEvidence.description}he subject of towels. A towel, it says, is about the most massivelyuseful thing an interstellar hitch hiker can have. Partly it has great practical value - you can wrap it around you for warmth as you bound across the cold moons of Jaglan Beta; you can lie on it on the brilliant marble-sanded beaches of Santraginus V, inhaling the heady sea vapours; you can sleep under it beneath the stars which shine so redly on the desert world of Kakrafoon; use it to sail</p>
              </section>
            ))
          }
        </div>
      ) : (
        <div className='ArbitrableTxCards-new' onClick={() => navigate('/new')}>
          <FontAwesomeIcon icon={faPlus} size={'5x'} color={'#ccc'} />
        </div>
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
