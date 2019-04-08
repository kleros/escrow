import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

/**
 * Evidence Display List Component
 * @param evidenceArbitrabletxs - list of arbitrable transaction evidences
 * @returns {*}
 */
const EvidenceArbitrableTxList = ({ evidenceArbitrabletxs }) => (
  <div className="">
    {
      <div>
        {evidenceArbitrabletxs.map((evidence, i) => (
          <span key={i}>
            <a
              href={evidence.fileURI}
              target="_blank"
              rel="noopener noreferrer"
              className="test class"
            >
              <div>
                <p>Name: {evidence.id}</p>
                <p>Description: {evidence.description}</p>
              </div>
            </a>
          </span>
        ))}
      </div>
    }
  </div>
)

EvidenceArbitrableTxList.propTypes = {
  // State
  evidenceArbitrabletxs: PropTypes.array
}

EvidenceArbitrableTxList.defaultProps = {
  // State
  evidenceArbitrabletxs: []
}

export default EvidenceArbitrableTxList
