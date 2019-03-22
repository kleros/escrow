import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Formik, Form } from 'formik'
import { ClipLoader } from 'react-spinners'

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
      <>
        {
          arbitrabletxForm.amount !== undefined && (
            <ResumeArbitrableTx 
              arbitrabletx={arbitrabletxForm}
              title={'Summary'}
            >
              <Formik onSubmit={() => createArbitrabletx(arbitrabletxForm, metaEvidenceIPFSHash)}>
                {({isSubmitting}) => (
                  <Form className={'PayOrReimburseArbitrableTx'}>
                    <Button type='submit' disabled={isSubmitting} style={{position: 'relative', top: '2px'}}>
                    {isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}} ><ClipLoader size={20} color={'#fff'} /></span>} Submit Transaction
                    </Button>
                  </Form>
                )}
              </Formik>
            </ResumeArbitrableTx>
          )
        }
      </>
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