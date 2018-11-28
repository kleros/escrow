import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { ReactComponent as PrimaryDocument } from '../../assets/primary-document.svg'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ createArbitrabletx, arbitrabletx, title, children }) => (
  <div className='ResumeArbitrableTx'>
    <h1 className='ResumeArbitrableTx-h1'>{title}</h1>
    <div className='ResumeArbitrableTx-ContentNewArbitrableTx'>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Title</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.title}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Description</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.description}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Seller</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.seller}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Amount</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.amount} ETH</div>

      {arbitrabletx.email && (
        <React.Fragment>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>My Email</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletx.email}</div>
        </React.Fragment>
      )}

      {arbitrabletx.file && (
        <React.Fragment>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Primary Document</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content' style={{border: '0'}}>
            <a href={arbitrabletx.file} alt='Primary Document'><PrimaryDocument /></a>
          </div>
        </React.Fragment>
      )}
    </div>
    <div className= 'ResumeArbitrableTx-section-submit'>
      {children}
    </div>
  </div>
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