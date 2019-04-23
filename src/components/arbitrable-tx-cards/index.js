import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { shortAddress } from '../../utils/short-address'
import * as statusArbitrableTxConstants from '../../constants/status-arbitrable-tx'

import Identicon from '../identicon'

import './arbitrable-tx-cards.css'

/**
 * Contract Display List Component
 * @param arbitrabletxs - list of arbitrable transactions
 * @returns {*}
 */
const ArbitrableTxCards = ({ arbitrabletxs }) => (
  <div className="ArbitrableTxCards">
    <h1 className="ArbitrableTxCards-h1">My Payments</h1>
    {arbitrabletxs.length > 0 ? (
      <div className="ArbitrableTxCards-cards">
        {arbitrabletxs.map((arbitrabletx, index) => (
          <section
            className="ArbitrableTxCards-cards-section"
            key={index}
            onClick={() =>
              navigate(
                `contract/${arbitrabletx.arbitrableAddress}/payment/${
                  arbitrabletx.id
                }`
              )
            }
          >
            <div className="ArbitrableTxCards-cards-section-header">
              <Identicon
                scale={3}
                round={true}
                address={
                  arbitrabletx[arbitrabletx.otherParty] &&
                  arbitrabletx[arbitrabletx.otherParty]
                }
              />
              <div className="ArbitrableTxCards-cards-section-header-address">
                {shortAddress(arbitrabletx[arbitrabletx.otherParty])}
              </div>
              <div className="ArbitrableTxCards-cards-section-header-party">
                {arbitrabletx.otherParty === 'sender' ? 'receiver' : 'sender'}
              </div>
            </div>
            <div className="ArbitrableTxCards-cards-section-h2">
              {arbitrabletx.metaEvidence && arbitrabletx.metaEvidence.title}
            </div>
            <div className="ArbitrableTxCards-cards-section-description">
              <p className="ArbitrableTxCards-cards-section-description-p">
                {arbitrabletx.metaEvidence &&
                  arbitrabletx.metaEvidence.description}
              </p>
            </div>
            <div className="ArbitrableTxCards-cards-section-footer">
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.ONGOING_TRANSACTION && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Payment in Progress
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.TRANSACTION_COMPLETED && (
                <div className="ArbitrableTxCards-cards-section-footer-completed">
                  Payment Completed
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.EXECUTE_PAYMENT && (
                <div className="ArbitrableTxCards-cards-section-footer-make-payment">
                  Make Payment
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.ONGOING_SETTLEMENT && (
                <div className="ArbitrableTxCards-cards-section-footer-settlement-in-progress">
                  Settlement in Progress
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.WAITING_RECEIVER && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Waiting on Receiver
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.WAITING_SENDER && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Waiting on Sender
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.HAS_TO_PAY_RECEIVER && (
                <div className="ArbitrableTxCards-cards-section-footer-make-payment">
                  Receiver Has to Pay
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.HAS_TO_PAY_SENDER && (
                <div className="ArbitrableTxCards-cards-section-footer-make-payment">
                  Sender Has to Pay
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.TIMEOUT_SENDER && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Time Left for Receiver to Respond
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.TIMEOUT_RECEIVER && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Time Left for Sender to Respond
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.ONGOING_DISPUTE && (
                <div className="ArbitrableTxCards-cards-section-footer-dispute">
                  Ongoing Dispute
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.APPEALABLE_LOOSER && (
                <div className="ArbitrableTxCards-cards-section-footer-dispute">
                  Appeal Possible
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.APPEALABLE_WINNER && (
                <div className="ArbitrableTxCards-cards-section-footer-waiting">
                  Waiting for an Appeal
                </div>
              )}
              {arbitrabletx.detailsStatus ===
                statusArbitrableTxConstants.DISPUTE_RESOLVED && (arbitrabletx.disputeId === '0' ? (
                <div className="ArbitrableTxCards-cards-section-footer-completed">
                  Payment Complete
                </div>
              ) : (
                <div className="ArbitrableTxCards-cards-section-footer-completed">
                  Dispute Resolved
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    ) : (
      <div className="ArbitrableTxCards-cards">
        <section
          className="ArbitrableTxCards-cards-section ArbitrableTxCards-cards-section-new"
          onClick={() => navigate('/new/payment')}
        >
          <div className="ArbitrableTxCards-cards-section-new-content">
            <div>Create New Payment</div>
            <div className="ArbitrableTxCards-cards-section-new-content-plus">
              <FontAwesomeIcon icon={faPlus} size="1x" />
            </div>
          </div>
        </section>
      </div>
    )}
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
