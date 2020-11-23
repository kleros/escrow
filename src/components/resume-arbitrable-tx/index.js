import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { ReactComponent as PrimaryDocument } from '../../assets/primary-document.svg'
import MAX_TIMEOUT from '../../constants/timeout'
import { displayDateUTC } from '../../utils/date'

import Attachment from '../attachment'
import DetailsArea from '../details-area'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ arbitrabletx, title, children, footer }) => (
  <>
    <div className="ResumeArbitrableTx">
      <h1 className="ResumeArbitrableTx-h1">{title}</h1>
      <DetailsArea
        title={'Payment Info'}
        inputs={
          <>
            <div className="ResumeArbitrableTx-ContentNewArbitrableTx">
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-title">
                Title
              </div>
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-title">
                {arbitrabletx.title}
              </div>
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-otherParty">
                Fund Receiver
              </div>
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-otherParty">
                {arbitrabletx.receiver || arbitrabletx.otherPartyAddress}
              </div>
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-category">
                Escrow Type
              </div>
              {arbitrabletx.timeout === MAX_TIMEOUT ? (
                ''
              ) : (
                <>
                  <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-timeout">
                    Automatic Payment
                  </div>
                  <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content  ResumeArbitrableTx-ContentNewArbitrableTx-content-timeout">
                    {title === 'Invoice Details' ||
                    title === 'Payment Details' ? (
                      <>
                        {displayDateUTC(
                          new Date(Date.now() + arbitrabletx.timeout * 1000)
                            .toString()
                            .replace(/GMT.+/g, '')
                            .slice(0, -4)
                        )}
                      </>
                    ) : (
                      <>
                        {new Date(
                          (Number(arbitrabletx.lastInteraction) +
                            Number(arbitrabletx.timeout)) *
                            1000
                        )
                          .toString()
                          .replace(/GMT.+/g, '')
                          .slice(0, -4)}
                      </>
                    )}
                  </div>
                </>
              )}
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-category">
                {arbitrabletx.subCategory}
              </div>
              {arbitrabletx.file && (
                <>
                  <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-file">
                    Agreement Documents
                  </div>
                  <div
                    className="ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-file"
                    style={{ border: '0' }}
                  >
                    <a
                      href={arbitrabletx.file}
                      alt="Agreement Documents"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PrimaryDocument />
                    </a>
                  </div>
                </>
              )}
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-amount">
                Amount
              </div>
              {arbitrabletx.id ? (
                <div className="ResumeArbitrableTx-ContentNewArbitrableTx-amount">
                  <iframe
                    id="amount-iframe"
                    className="ResumeArbitrableTx-ContentNewArbitrableTx-amount-frame"
                    frameBorder="0"
                    src={`https://ipfs.kleros.io/ipfs/QmUzYw68A7EnpRkSQAk8N3Cm72ba9qY4xnAjQSuGLgMWS3/index.html?${encodeURIComponent(
                      JSON.stringify({
                        arbitrableContractAddress:
                          arbitrabletx.arbitrableAddress,
                        arbitratorContractAddress:
                          arbitrabletx.arbitratorAddress,
                        transactionID: arbitrabletx.id,
                      })
                    )}`}
                    title="Amount Display"
                  />
                  {arbitrabletx.warnings && arbitrabletx.warnings.length ? (
                    <div className="ResumeArbitrableTx-ContentNewArbitrableTx-amount-warning">
                      TOKEN WARNINGS: Please asses these warnings carefully
                      before continuing.
                    </div>
                  ) : (
                    ''
                  )}
                  {arbitrabletx.warnings &&
                    arbitrabletx.warnings.map((_warning, i) => (
                      <div
                        className="ResumeArbitrableTx-ContentNewArbitrableTx-amount-warning"
                        key={`warning-${i}`}
                      >
                        {_warning}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="ResumeArbitrableTx-ContentNewArbitrableTx-amount">
                  {`${arbitrabletx.amount} ${
                    arbitrabletx.token ? arbitrabletx.token.ticker : ''
                  } (${arbitrabletx.token.name})`}
                  {arbitrabletx.warnings.length ? (
                    <div className="ResumeArbitrableTx-ContentNewArbitrableTx-amount-warning">
                      WARNINGS: Please asses these warnings carefully before
                      continuing.
                    </div>
                  ) : (
                    ''
                  )}
                  {arbitrabletx.warnings.map((_warning, i) => (
                    <div
                      className="ResumeArbitrableTx-ContentNewArbitrableTx-amount-warning"
                      key={`warning-${i}`}
                    >
                      {_warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {arbitrabletx.token && !arbitrabletx.token.decimals ? (
              <div style={{ fontSize: '14px', color: 'red' }}>
                WARNING: The decimal precision is being assumed at 18 places. We
                were unable to verify this from the smart contract. If this is
                incorrect, please re-create this transaction using a Custom
                Token with the correct decimal value.
              </div>
            ) : (
              ''
            )}
          </>
        }
      />
      {Object.keys(arbitrabletx.extraData).length > 0 && (
        <DetailsArea
          title={'Extra Details'}
          inputs={Object.keys(arbitrabletx.extraData).map((dataTitle, i) => (
            <div key={`extra-details-${i}`}>
              <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name">
                {dataTitle}
              </div>
              {arbitrabletx.extraData[dataTitle].slice(-8) === ':00.000Z' ? (
                <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content">
                  {displayDateUTC(new Date(arbitrabletx.extraData[dataTitle]))}
                </div>
              ) : (
                <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content">
                  {arbitrabletx.extraData[dataTitle]}
                </div>
              )}
            </div>
          ))}
        />
      )}
      {arbitrabletx.description && (
        <>
          <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name-description">
            Contract Information
          </div>
          <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content-description">
            {arbitrabletx.description}
          </div>
        </>
      )}

      {arbitrabletx.evidences && (
        <>
          <div className="ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-evidence-name">
            Evidence
          </div>
          <div className="ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-evidence-container">
            {arbitrabletx.evidences.map((evidence, index) => (
              <Attachment
                className={
                  'ResumeArbitrableTx-ContentNewArbitrableTx-evidence-container-item'
                }
                URI={evidence.evidenceJSON.fileURI}
                title={evidence.evidenceJSON.name}
                description={evidence.evidenceJSON.description}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      <div className="ResumeArbitrableTx-ContentNewArbitrableTx-submit">
        {children}
      </div>
    </div>
    {footer}
  </>
)

ResumeArbitrableTx.propTypes = {
  // State
  arbitrabletx: arbitrabletxSelectors.arbitrabletxFormShape.isRequired,
}

ResumeArbitrableTx.defaultProps = {
  // State
  arbitrableTx: {},
}

export default ResumeArbitrableTx
