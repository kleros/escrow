import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../../actions/wallet'
import * as tokensActions from '../../../actions/tokens'
import * as stablecoinsActions from '../../../actions/stablecoins'
import * as walletSelectors from '../../../reducers/wallet'
import * as tokensSelectors from '../../../reducers/tokens'
import * as stablecoinsSelectors from '../../../reducers/stablecoins'
import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import SelectArbitrableTxType from '../../../components/select-arbitrable-tx-type'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'

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

  state = {
    template: null,
    showInputs: false
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    this.templates = require('../../../constants/templates').default
    this.setState({template: this.templates[0]})

    const { fetchBalance, fetchTokens, fetchStablecoins } = this.props
    fetchBalance()
    fetchTokens()
    fetchStablecoins()
  }

  submitTemplateType(template) {
    this.setState(prevState => ({
      template,
      showInputs: true
    }))
  }

  previousScreen() {
    this.setState({showInputs: false})
  }

  render() {
    const { formArbitrabletx, balance, accounts, type, tokens, stablecoins } = this.props

    if (this.state.showInputs)
      return (
        <NewArbitrableTx
          formArbitrabletx={formArbitrabletx}
          balance={balance}
          accounts={accounts}
          invoice={type === 'invoice'}
          tokens={tokens.data}
          template={this.state.template}
          back={this.previousScreen.bind(this)}
          stablecoins={stablecoins.data}
        />
      )
    else
      return (
        <>
          <SelectArbitrableTxType
            templates={this.templates}
            selectedTemplate={this.state.template}
            submit={this.submitTemplateType.bind(this)}
            invoice={type === 'invoice'}
          />
        </>
      )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    accounts: state.wallet.accounts,
    tokens: state.tokens.tokens,
    stablecoins: state.stablecoins.stablecoins
  }),
  {
    formArbitrabletx: arbitrabletxActions.formArbitrabletx,
    fetchBalance: walletActions.fetchBalance,
    fetchAccounts: walletActions.fetchAccounts,
    fetchTokens: tokensActions.fetchTokens,
    fetchStablecoins: stablecoinsActions.fetchStablecoins
  }
)(NewArbitrableTxContainer)
