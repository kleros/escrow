import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../../actions/wallet'
import * as walletSelectors from '../../../reducers/wallet'
import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'
import NewInvoiceArbitrableTx from '../../../components/new-invoice-arbitrable-tx'

import './new.css'

class New extends PureComponent {
  static propTypes = {
    // Redux State
    balance: walletSelectors.balanceShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
    formArbitrabletx: PropTypes.func.isRequired
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    const { fetchBalance } = this.props
    fetchBalance()
  }

  render() {
    const { formArbitrabletx, balance, accounts, type } = this.props

    return (
      <>
        {
          type === 'invoice' ? (
            <NewInvoiceArbitrableTx
              formArbitrabletx={formArbitrabletx}
              balance={balance}
              accounts={accounts.data}
            />
          ) : (
            <NewArbitrableTx
              formArbitrabletx={formArbitrabletx}
              balance={balance}
              accounts={accounts.data}
            />
          )
        }

      </>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    accounts: state.wallet.accounts
  }),
  {
    formArbitrabletx: arbitrabletxActions.formArbitrabletx,
    fetchBalance: walletActions.fetchBalance,
    fetchAccounts: walletActions.fetchAccounts
  }
)(New)