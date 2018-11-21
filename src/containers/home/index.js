import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BarLoader } from 'react-spinners'
import { RenderIf } from 'lessdux'

import * as walletActions from '../../actions/wallet'
import * as arbitrabletxActions from '../../actions/arbitrable-transaction'
import * as walletSelectors from '../../reducers/wallet'
import ArbitrableTxCards from '../../components/arbitrable-tx-cards'

import './home.css'

class Home extends PureComponent {
  state = {
    arbitrabletxs: []
  }

  static propTypes = {
    loadingArbitrabletxs: PropTypes.bool,
    fetchArbitrabletxs: PropTypes.func.isRequired,

    balance: walletSelectors.balanceShape.isRequired,
    fetchBalance: PropTypes.func.isRequired
  }

  static defaultProps = {
    loadingArbitrableTxs: false
  }

  componentDidMount() {
    const { fetchBalance, fetchArbitrabletxs } = this.props
    fetchBalance()
    fetchArbitrabletxs()
  }

  render() {
    const { arbitrabletx, accounts, arbitrabletxs } = this.props

    return (
      <div className="container">
        <RenderIf
          resource={arbitrabletxs}
          loading={
            <div className="loader">
              <BarLoader color={'gray'} />
            </div>
          }
          done={
            arbitrabletxs.data && (
              <ArbitrableTxCards
                arbitrabletxs={arbitrabletxs.data}
                arbitrabletx={arbitrabletx}
                accounts={accounts}
              />
            )
          }
          failedLoading="There was an error fetching the arbitrable transactions. Make sure you are connected to the right Ethereum network."
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    arbitrabletxs: state.arbitrabletx.arbitrabletxs,
    accounts: state.wallet.accounts
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchArbitrabletxs: arbitrabletxActions.fetchArbitrabletxs
  }
)(Home)