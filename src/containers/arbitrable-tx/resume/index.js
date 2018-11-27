import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import * as arbitrabletxSelectors from '../../../reducers/arbitrable-transaction'
import ResumeArbitrableTx from '../../../components/resume-arbitrable-tx'
import Button from '../../../components/button'

import './resume.css'

class Resume extends PureComponent {
  static propTypes = {
    arbitrabletxForm: arbitrabletxSelectors.arbitrabletxFormShape.isRequired,
    
    createArbitrabletx: PropTypes.func.isRequired
  }

  render() {
    const { createArbitrabletx, arbitrabletxForm } = this.props

    return (
      <div className=''>
        <ResumeArbitrableTx 
          arbitrabletx={arbitrabletxForm}
          title={<React.Fragment>Resume</React.Fragment>}
        >
          <Button onClick={() => {createArbitrabletx(arbitrabletxForm)}}>
            Submit Transaction
          </Button>
        </ResumeArbitrableTx>
      </div>
    )
  }
}

export default connect(
  state => ({
    arbitrabletxForm: state.arbitrabletx.arbitrabletxForm
  }),
  {
    createArbitrabletx: arbitrabletxActions.createArbitrabletx
  }
)(Resume)