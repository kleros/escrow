import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'

import './resume-arbitrable-tx.css'

const ResumeArbitrableTx = ({ createArbitrabletx, arbitrabletxForm }) => (
  <div className='ResumeArbitrableTx'>
    <p>Title: {arbitrabletxForm.title}</p>
    <p>Description: {arbitrabletxForm.title}</p>
    <p>Seller: {arbitrabletxForm.seller}</p>
    <p>Payment: {arbitrabletxForm.payment}</p>
    <p>My email: {arbitrabletxForm.email}</p>
    <br />
    <br />
    <button style={{float: 'right'}} onClick={() => {createArbitrabletx(arbitrabletxForm)}}>
      Submit Transaction
    </button>
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