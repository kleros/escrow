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

  componentDidMount() {
    const { fetchMetaEvidenceArbitrabletx, metaEvidenceIPFSHash } = this.props
    fetchMetaEvidenceArbitrabletx(metaEvidenceIPFSHash)
  }

  render() {
    const { createArbitrabletx, arbitrabletxForm, metaEvidenceIPFSHash } = this.props

    return (
      <div className=''>
        {
          arbitrabletxForm.amount !== undefined && (
            <ResumeArbitrableTx 
              arbitrabletx={arbitrabletxForm}
              title={<React.Fragment>Summary</React.Fragment>}
            >
              <Button onClick={() => {createArbitrabletx(arbitrabletxForm, metaEvidenceIPFSHash)}}>
                Submit Transaction
              </Button>
            </ResumeArbitrableTx>
          
          )
        }
      </div>
    )
  }
}

export default connect(
  state => ({
    arbitrabletxForm: state.arbitrabletx.arbitrabletxResumeForm
  }),
  {
    createArbitrabletx: arbitrabletxActions.createArbitrabletx,
    fetchMetaEvidenceArbitrabletx: arbitrabletxActions.fetchMetaEvidence
  }
)(Resume)