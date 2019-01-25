import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../../actions/wallet'
import * as walletSelectors from '../../../reducers/wallet'
import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'

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
    const { fetchBalance } = this.props
    fetchBalance()
  }

  render() {
    const { formArbitrabletx, balance } = this.props

    return (
      <div className=''>
        <NewArbitrableTx formArbitrabletx={formArbitrabletx} balance={balance} />
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance
  }),
  {
    formArbitrabletx: arbitrabletxActions.formArbitrabletx,
    fetchBalance: walletActions.fetchBalance
  }
)(New)