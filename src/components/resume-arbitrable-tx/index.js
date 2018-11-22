import React from 'react'

import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'

const ResumeArbitrableTx = ({ createArbitrabletx, arbitrabletxForm }) => (
  <div>
    <h1>Resume arbitrable transaction</h1>
    {arbitrabletxForm.title}
    <button onClick={() => {createArbitrabletx(arbitrabletxForm)}}>
      Submit
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