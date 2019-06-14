import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../../actions/wallet'
import * as tokensActions from '../../../actions/tokens'
import * as walletSelectors from '../../../reducers/wallet'
import * as tokensSelectors from '../../../reducers/tokens'
import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'
import NewInvoiceArbitrableTx from '../../../components/new-invoice-arbitrable-tx'

import './new.css'

class NewArbitrableTxContainer extends PureComponent {
  static propTypes = {
    // Redux State
    balance: walletSelectors.balanceShape.isRequired,
    tokens: tokensSelectors.tokensShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
    fetchTokens: PropTypes.func.isRequired,
    formArbitrabletx: PropTypes.func.isRequired
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    const { fetchBalance, fetchTokens } = this.props
    fetchBalance()
    fetchTokens()
  }

  render() {
    const { formArbitrabletx, balance, accounts, type, tokens } = this.props

    return (
      <>
        {type === 'invoice' ? (
          <NewInvoiceArbitrableTx
            formArbitrabletx={formArbitrabletx}
            balance={balance}
            accounts={accounts.data}
            tokens={tokens.data}
          />
        ) : (
          <NewArbitrableTx
            formArbitrabletx={formArbitrabletx}
            balance={balance}
            accounts={accounts.data}
            tokens={tokens.data}
          />
        )}
      </>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    accounts: state.wallet.accounts,
    tokens: state.tokens.tokens
  }),
  {
    formArbitrabletx: arbitrabletxActions.formArbitrabletx,
    fetchBalance: walletActions.fetchBalance,
    fetchAccounts: walletActions.fetchAccounts,
    fetchTokens: tokensActions.fetchTokens
  }
)(NewArbitrableTxContainer)
