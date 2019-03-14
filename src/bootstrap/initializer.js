import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { PulseLoader } from 'react-spinners'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import RequiresMetaMaskPage from '../containers/requires-meta-mask-page'

import { web3 } from './dapp-api'

class Initializer extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,

    // Action Dispatchers
    fetchAccounts: PropTypes.func.isRequired,

    // State
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element.isRequired)
    ]).isRequired
  }

  componentDidMount() {
    const { fetchAccounts } = this.props
    fetchAccounts()
  }

  render() {
    const { accounts, children } = this.props
    return (
      <RenderIf
        resource={accounts}
        loading={
          <PulseLoader className='loader' color='gray' />
        }
        done={children}
        failedLoading={<RequiresMetaMaskPage needsUnlock={Boolean(web3.eth)} />}
        extraValues={[
          accounts.data && (accounts.data[0] || null)
        ]}
        extraFailedValues={[!web3.eth]}
      />
    )
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts
  }),
  { fetchAccounts: walletActions.fetchAccounts }
)(Initializer)