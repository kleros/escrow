import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { RenderIf } from 'lessdux'

import * as walletActions from '../../actions/wallet'
import * as arbitrabletxActions from '../../actions/arbitrable-transaction'
import * as walletSelectors from '../../reducers/wallet'
import ArbitrableTxCards from '../../components/arbitrable-tx-cards'
import RequiresMetaMaskPage from '../requires-meta-mask-page'

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
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
    const { fetchBalance, fetchArbitrabletxs } = this.props
    fetchBalance()
    fetchArbitrabletxs()
  }

  render() {
    const { arbitrabletx, accounts, arbitrabletxs } = this.props

    return (
      <div className="Home">
        <RenderIf
          resource={arbitrabletxs}
          loading={<BeatLoader className="loader" color={'#fff'} />}
          done={
            arbitrabletxs.data && (
              <ArbitrableTxCards
                arbitrabletxs={arbitrabletxs.data}
                arbitrabletx={arbitrabletx}
                accounts={accounts}
              />
            )
          }
          failedLoading={<RequiresMetaMaskPage needsUnlock={false} />}
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
