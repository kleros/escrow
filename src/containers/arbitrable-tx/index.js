import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ClimbingBoxLoader } from 'react-spinners'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as arbitrabletxActions from '../../actions/arbitrable-transaction'
import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import renderStatusArbitrableTxSwitch from '../../utils/render-status-arbitrable-tx-switch'


import './arbitrable-tx.css'

class ArbitrableTx extends PureComponent {
  state = {
    payOrReimburse: 'payOrReimburse',
    arbitrabletx: {
      data: {
        appealable: false,
        evidences: []
      }
    }
  }
  static propTypes = {
    arbitrabletx: arbitrabletxSelectors.arbitrabletxShape.isRequired,
    fetchArbitrabletx: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createAppeal: PropTypes.func.isRequired,
    createTimeout: PropTypes.func.isRequired,
    createPayOrReimburse: PropTypes.func.isRequired,
    createExecuteTx: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchArbitrabletx, arbitrableTxId } = this.props
    fetchArbitrabletx(arbitrableTxId)
  }

  static getDerivedStateFromProps(props, state) {
    const { arbitrabletx, accounts } = props
    if (arbitrabletx !== state.arbitrabletx)
      if (arbitrabletx.data) {
        return {
          ...state,
          arbitrabletx,
          payOrReimburse: arbitrabletx.data.receiver !== accounts.data[0] ? 'Reimburse' : 'Pay'
        }
      }
    return null
  }

  render() {
    const {
      createPayOrReimburse,
      createExecuteTx,
      createDispute,
      createTimeout,
      createAppeal,
      createEvidence,
      accounts
    } = this.props
    const { arbitrabletx, payOrReimburse } = this.state

    return (
      <RenderIf
        resource={arbitrabletx}
        loading={
          <div className='loader'>
            <ClimbingBoxLoader color={'gray'} />
          </div>
        }
        done={
          arbitrabletx.data && (
            <React.Fragment>
              {
                renderStatusArbitrableTxSwitch(
                  accounts.data,
                  arbitrabletx,
                  payOrReimburse,
                  createPayOrReimburse,
                  createExecuteTx,
                  createDispute,
                  createTimeout,
                  createEvidence,
                  createAppeal
                )
              }
            </React.Fragment>
          )
        }
        failedLoading={
          <div className='loader'>
            <ClimbingBoxLoader color={'gray'} />
          </div>
        }
      />
    )
  }
}

export default connect(
  state => ({
    arbitrabletx: state.arbitrabletx.arbitrabletx,
    accounts: state.wallet.accounts
  }),
  {
    fetchArbitrabletx: arbitrabletxActions.fetchArbitrabletx,
    createAppeal: arbitrabletxActions.createAppeal,
    createDispute: arbitrabletxActions.createDispute,
    createPayOrReimburse: arbitrabletxActions.createPayOrReimburse,
    createExecuteTx: arbitrabletxActions.createExecuteTx,
    createTimeout: arbitrabletxActions.createTimeout,
    createEvidence: arbitrabletxActions.createEvidence
  }
)(ArbitrableTx)