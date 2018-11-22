import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BarLoader } from 'react-spinners'
import { connect } from 'react-redux'
import { Link } from "@reach/router"
import { RenderIf } from 'lessdux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


import { web3 } from '../../bootstrap/dapp-api'
import * as walletActions from '../../actions/wallet'
import * as arbitrabletxActions from '../../actions/arbitrable-transaction'
import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { DISPUTE_CREATED, DISPUTE_RESOLVED } from '../../constants/arbitrable-tx'
import * as arbitratorConstants from '../../constants/arbitrator'
import PayOrReimburseArbitrableTx from '../../components/pay-or-reimburse-arbitrable-tx'
import PayFeeArbitrableTx from '../../components/pay-fee-arbitrable-tx'

import './arbitrable-tx.css'

class ArbitrableTx extends PureComponent {
  state = {
    payOrReimburse: 'payOrReimburse',
    arbitrabletx: {}
  }
  static propTypes = {
    arbitrabletx: arbitrabletxSelectors.arbitrabletxShape.isRequired,
    fetchArbitrabletx: PropTypes.func.isRequired,
    // createDispute: PropTypes.func.isRequired,
    // createAppeal: PropTypes.func.isRequired,
    // createTimeout: PropTypes.func.isRequired,
    // createPay: PropTypes.func.isRequired,
    // createReimburse: PropTypes.func.isRequired,
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
          payOrReimburse: arbitrabletx.data.buyer === accounts.data[0] ? 'Pay' : 'Reimburse'
        }

      }
    
    return null
  }

//   createDispute = () => {
//     const { createDispute, match } = this.props
//     createDispute(match.params.contractAddress)
//   }

//   createAppeal = () => {
//     const { contract, createAppeal, match } = this.props
//     createAppeal(match.params.contractAddress, contract.data.disputeId)
//   }

//   createPay = () => {
//     const { accounts, contract, createPay, createReimburse, match } = this.props
//     const { amount } = this.state
//     if (contract.data.seller === accounts.data[0].toLowerCase())
//       createReimburse(match.params.contractAddress, amount)
//     else createPay(match.params.contractAddress, amount)
//   }

//   timeout = () => {
//     const { contract, createTimeout, match } = this.props
//     createTimeout(
//       match.params.contractAddress,
//       contract.data.buyer,
//       contract.data.seller
//     )
//   }

//   showEmptyContractEl = contract =>
//     contract.data.amount && contract.data.amount.e === 0

//   hideEmptyContractEl = contract => ({
//     display: contract.data.amount === 0 ? 'none' : 'block'
//   })

//   isTimeout = contract => {
//     const timeout = contract.data.lastInteraction + contract.data.timeout
//     const dateTime = (Date.now() / 1000) | 0
//     return dateTime > timeout
//   }

  onChangeAmount = e => this.setState({ amount: e.target.value })

  render() {
    const {
      createPayOrReimburse,
      createDispute

    //   accounts,
    //   arbitrator,
    //   appeal,
    //   evidence,
    } = this.props
    const { arbitrabletx, payOrReimburse } = this.state
    const ruling = ['no ruling', 'buyer', 'seller']
    let amount = 0
    if (arbitrabletx.data && arbitrabletx.data.amount)
      amount = web3.utils.fromWei(arbitrabletx.data.amount.toString(), 'ether')
    return (
    <RenderIf
      resource={arbitrabletx}
      loading={
        <div className="loader">
          <BarLoader color={'gray'} />
        </div>
      }
      done={
        arbitrabletx.data && (
          <div>
            seller: {arbitrabletx.data.seller}
            <br />
            arbitrator: {arbitrabletx.data.arbitrator}
            <br />
            {arbitrabletx.data.payment}
            <br />
            {arbitrabletx.data.email}
            <br />
            sellerFee: {arbitrabletx.data.sellerFee}
            <br />
            buyerFee: {arbitrabletx.data.buyerFee}
            <br />
            status: {arbitrabletx.data.status}
            <br />
            <PayOrReimburseArbitrableTx
              payOrReimburse={payOrReimburse}
              payOrReimburseFn={createPayOrReimburse}
              amount={amount}
              id={arbitrabletx.data.id}
            />
            <PayFeeArbitrableTx
              id={arbitrabletx.data.id}
              payFee={createDispute}
            />
          </div>
        )
      }
      failedLoading="There was an error fetching the arbitrable transaction. Make sure you are connected to the right Ethereum network."
    />
    )
  }
}

export default connect(
  state => ({
    arbitrabletx: state.arbitrabletx.arbitrabletx,
    // dispute: state.contract.dispute,
    // arbitrator: state.contract.arbitrator,
    // pay: state.contract.pay,
    // reimburse: state.contract.reimburse,
    // appeal: state.contract.appeal,
    // evidence: state.contract.evidence,
    // timeout: state.contract.timeout,
    accounts: state.wallet.accounts
  }),
  {
    fetchArbitrabletx: arbitrabletxActions.fetchArbitrabletx,
    // createAppeal: contractActions.createAppeal,
    createDispute: arbitrabletxActions.createDispute,
    createPayOrReimburse: arbitrabletxActions.createPayOrReimburse,
    // createReimburse: contractActions.createReimburse,
    // fetchAccounts: walletActions.fetchAccounts,
    // fetchArbitrator: contractActions.fetchArbitrator,
    // createTimeout: contractActions.createTimeout
  }
)(ArbitrableTx)