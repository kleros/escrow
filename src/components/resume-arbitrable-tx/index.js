import React, { useState } from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { ReactComponent as PrimaryDocument } from '../../assets/primary-document.svg'
import Attachment from '../../components/attachment'
import { ReactComponent as Copy } from '../../assets/copy.svg'
import { ReactComponent as MailBill } from '../../assets/mail_bill.svg'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ arbitrabletx, title, children, footer }) => {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <div className='ResumeArbitrableTx'>
        <h1 className='ResumeArbitrableTx-h1'>{title}</h1>
        <div className='ResumeArbitrableTx-ContentNewArbitrableTx'>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Title</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.title}</div>

          {arbitrabletx.description && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Description</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.description}</div>
            </>
          )}

          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Sender</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.sender}</div>
          
          {arbitrabletx.amount > 0 && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Amount</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.amount} ETH</div>
            </>
          )}

          {arbitrabletx.file && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Primary Document</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content' style={{border: '0'}}>
                <a href={arbitrabletx.file} alt='Primary Document' target='_blank' rel='noopener noreferrer'>
                  <PrimaryDocument />
                </a>
              </div>
            </>
          )}

          {arbitrabletx.shareLink && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Share Transaction</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>
                {arbitrabletx.shareLink}
                {
                /* Logical shortcut for only displaying the
                    button if the copy command exists */
                  document.queryCommandSupported('copy') && (
                    !copied ? (
                      <Copy 
                        style={{marginLeft: '1em', cursor: 'pointer'}}
                        onClick={() => {navigator.clipboard.writeText(arbitrabletx.shareLink) && setCopied(true)}} 
                      /> 
                    ) : (
                      <span style={{marginLeft: '1em', color: '#4004a3'}}>Copied</span>
                    )
                  ) 
                }
                <a
                  href=
                    {`
                      mailto:client%40example.com
                      ?subject=Invoice ${encodeURIComponent(arbitrabletx.title)}
                      &body=Hi%2C%0A%0AHere%20is%20the%20link%20to%20the%20${encodeURIComponent(arbitrabletx.title)}%20invoice: ${arbitrabletx.shareLink}.%0A%0ABest%2C%0A
                    `}
                  >
                    <MailBill
                      style={{marginLeft: '0.7em', cursor: 'pointer'}}
                    />
                </a>
              </div>
            </>
          )}

          {arbitrabletx.evidences && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Evidences</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content' style={{border: '0'}}>
                {
                  arbitrabletx.evidences.map((evidence, index) => (
                    <Attachment
                      URI={evidence.evidenceJSON.fileURI}
                      title={evidence.evidenceJSON.name}
                      description={evidence.evidenceJSON.description}
                      key={index}
                    />
                  ))
                }
              </div>
            </>
          )}
        </div>
        <div className= 'ResumeArbitrableTx-section-submit'>
          {children}
        </div>
      </div>
      {footer}
    </>
  )
}

ResumeArbitrableTx.propTypes = {
  // State
  arbitrabletx: arbitrabletxSelectors.arbitrabletxFormShape.isRequired
}

ResumeArbitrableTx.defaultProps = {
  // State
  arbitrableTx: {}
}

export default ResumeArbitrableTx