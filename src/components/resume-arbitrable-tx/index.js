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
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-title'>Title</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-title'>{arbitrabletx.title}</div>
{console.log({arbitrabletx})}
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-sender'>{arbitrabletx.otherParty}</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-sender'>{arbitrabletx.otherPartyAddress}</div>

          {arbitrabletx.amount > 0 && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-amount'>Amount</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content  ResumeArbitrableTx-ContentNewArbitrableTx-content-amount'>{arbitrabletx.amount} ETH</div>
            </>
          )}


          {arbitrabletx.file && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-file'>Primary Document</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-file' style={{border: '0'}}>
                <a href={arbitrabletx.file} alt='Primary Document' target='_blank' rel='noopener noreferrer'>
                  <PrimaryDocument />
                </a>
              </div>
            </>
          )}

          {arbitrabletx.description && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-description'>Description</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-content-description'>{arbitrabletx.description}</div>
            </>
          )}


          {arbitrabletx.shareLink && (
            <>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name ResumeArbitrableTx-ContentNewArbitrableTx-name-share'>Share Transaction</div>
              <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content ResumeArbitrableTx-ContentNewArbitrableTx-link-share'>
                {arbitrabletx.shareLink}
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

          <div className= 'ResumeArbitrableTx-ContentNewArbitrableTx-submit'>
            {children}
          </div>
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