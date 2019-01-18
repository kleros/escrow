import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { ReactComponent as PrimaryDocument } from '../../assets/primary-document.svg'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ arbitrabletx, title, children, footer }) => (
  <React.Fragment>
    <div className='ResumeArbitrableTx'>
      <h1 className='ResumeArbitrableTx-h1'>{title}</h1>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx'>
        <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Title</div>
        <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.title}</div>

        {arbitrabletx.description && (
          <React.Fragment>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Description</div>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.description}</div>
          </React.Fragment>
        )}

        <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Seller</div>
        <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.seller}</div>
        
        {arbitrabletx.amount > 0 && (
          <React.Fragment>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Amount</div>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.amount} ETH</div>
          </React.Fragment>
        )}

        {arbitrabletx.file && (
          <React.Fragment>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Primary Document</div>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content' style={{border: '0'}}>
              <a href={arbitrabletx.file} alt='Primary Document' target='_blank' rel='noopener noreferrer'>
                <PrimaryDocument />
              </a>
            </div>
          </React.Fragment>
        )}

        {arbitrabletx.shareLink && (
          <React.Fragment>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Share Transaction</div>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>
              {arbitrabletx.shareLink}
              {
              /* Logical shortcut for only displaying the
                  button if the copy command exists */
              document.queryCommandSupported('copy') &&
                <button style={{marginLeft: '1em'}} onClick={() => {navigator.clipboard.writeText(arbitrabletx.shareLink)}}>Copy</button> 
              }
            </div>
          </React.Fragment>
        )}

        {arbitrabletx.evidences && (
          <React.Fragment>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Evidences</div>
            <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content' style={{border: '0'}}>
              {
                arbitrabletx.evidences.map(evidence => (
                  <a style={{paddingRight: '1em'}} href={`https://ipfs.io${evidence.evidenceJSON.fileURI}`} alt={evidence.evidenceJSON.name} title={evidence.evidenceJSON.name} target='_blank' rel='noopener noreferrer'>
                    <PrimaryDocument />
                  </a>
                ))
              }
            </div>
          </React.Fragment>
        )}
      </div>
      <div className= 'ResumeArbitrableTx-section-submit'>
        {children}
      </div>
    </div>
    {footer}
  </React.Fragment>
)

ResumeArbitrableTx.propTypes = {
  // State
  arbitrabletx: arbitrabletxSelectors.arbitrabletxFormShape.isRequired
}

ResumeArbitrableTx.defaultProps = {
  // State
  arbitrableTx: {}
}

export default ResumeArbitrableTx