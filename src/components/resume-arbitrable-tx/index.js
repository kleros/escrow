import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ createArbitrabletx, arbitrabletxForm }) => (
  <div className='ResumeArbitrableTx'>
    <h1 className='ResumeArbitrableTx-h1'>Resume</h1>
    <div className='ResumeArbitrableTx-ContentNewArbitrableTx'>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Title</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletxForm.title}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Description</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletxForm.description}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Seller</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletxForm.seller}</div>

      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>Amount (ETH)</div>
      <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletxForm.payment}</div>

      {arbitrabletxForm.email && (
        <React.Fragment>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-name'>My Email</div>
          <div className='ResumeArbitrableTx-ContentNewArbitrableTx-content'>{arbitrabletxForm.email}</div>
        </React.Fragment>
      )}
    </div>
    <div className= 'ResumeArbitrableTx-section-submit'>
      <span className= 'ResumeArbitrableTx-section-submit-btn' onClick={() => {createArbitrabletx(arbitrabletxForm)}}>
        Submit Transaction
      </span>
    </div>
  </div>
)

ResumeArbitrableTx.propTypes = {
  // State
  arbitrabletxForm: arbitrabletxSelectors.arbitrabletxFormShape.isRequired
}
  
ResumeArbitrableTx.defaultProps = {
  // State
  arbitrableTxForm: {}
}
  
export default ResumeArbitrableTx