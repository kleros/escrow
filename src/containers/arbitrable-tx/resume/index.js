import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import * as arbitrabletxSelectors from '../../../reducers/arbitrable-transaction'
import ResumeArbitrableTx from '../../../components/resume-arbitrable-tx'

import './resume.css'

class Resume extends PureComponent {
  static propTypes = {
    arbitrabletxForm: arbitrabletxSelectors.arbitrabletxFormShape.isRequired,
    
    createArbitrabletx: PropTypes.func.isRequired
  }

  render() {
    const { createArbitrabletx, arbitrabletxForm } = this.props

    return (
      <div className="container">
        <ResumeArbitrableTx createArbitrabletx={createArbitrabletx} arbitrabletxForm={arbitrabletxForm} />
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