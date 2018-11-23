import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'

const ResumeArbitrableTx = ({ createArbitrabletx, arbitrabletxForm }) => (
  <div>
    <h1>Resume arbitrable transaction</h1>
    <br />
    <br />
    <p>Title: {arbitrabletxForm.title}</p>
    <p>Description: {arbitrabletxForm.title}</p>
    <p>Seller: {arbitrabletxForm.seller}</p>
    <p>Payment: {arbitrabletxForm.payment}</p>
    <p>My email: {arbitrabletxForm.email}</p>
    <br />
    <br />
    <button onClick={() => {createArbitrabletx(arbitrabletxForm)}}>
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