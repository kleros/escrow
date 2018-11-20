import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BarLoader } from 'react-spinners'
import { connect } from 'react-redux'
import { Link } from "@reach/router"
import { RenderIf } from 'lessdux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import * as walletActions from '../../actions/wallet'
import * as arbitrabletxActions from '../../actions/arbitrable-transaction'
import * as arbitrabletxSelectors from '../../reducers/arbitrable-transaction'
import { DISPUTE_CREATED, DISPUTE_RESOLVED } from '../../constants/arbitrable-tx'
import * as arbitratorConstants from '../../constants/arbitrator'

import './arbitrable-tx.css'

class ArbitrableTx extends PureComponent {
  state = {
    open: false,
    party: {
      name: 'buyer',
      method: 'Pay'
    },
    partyOther: {
      name: 'seller',
      method: 'Reimburse'
    },
    arbitrableTransaction: {},
    amount: 0
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

//   componentWillReceiveProps(nextProps) {
//     const { contract: prevContract } = this.props
//     const { contract, accounts = [] } = nextProps
//     if (prevContract !== contract) {
//       if (
//         contract.data &&
//         contract.data.buyer === accounts.data[0].toLowerCase()
//       ) {
//         this.setState({
//           party: {
//             name: 'buyer',
//             method: 'Pay'
//           }
//         })
//         this.setState({
//           partyOther: {
//             name: 'seller',
//             method: 'Reimburse'
//           }
//         })
//       } else if (
//         contract.data &&
//         contract.data.seller === accounts.data[0].toLowerCase()
//       ) {
//         this.setState({
//           partyOther: {
//             name: 'buyer',
//             method: 'Pay'
//           }
//         })
//         this.setState({
//           party: {
//             name: 'seller',
//             method: 'Reimburse'
//           }
//         })
//       }
//     }
//   }

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
      arbitrabletx,
      arbitrableTxId

    //   accounts,
    //   arbitrator,
    //   appeal,
    //   evidence,
    } = this.props
    const { partyOther, party } = this.state
    const ruling = ['no ruling', 'buyer', 'seller']
    return (
      
    <RenderIf
      resource={arbitrabletx}
      loading={
        <div className="loader">
          Ethereum<BarLoader color={'gray'} />Computer
        </div>
      }
      done={
        arbitrabletx.data && (
          <div>
            {arbitrabletx.data.seller}
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
    // accounts: state.wallet.accounts
  }),
  {
    fetchArbitrabletx: arbitrabletxActions.fetchArbitrabletx
    // createDispute: contractActions.createDispute,
    // createAppeal: contractActions.createAppeal,
    // createPay: contractActions.createPay,
    // createReimburse: contractActions.createReimburse,
    // fetchAccounts: walletActions.fetchAccounts,
    // fetchArbitrator: contractActions.fetchArbitrator,
    // createTimeout: contractActions.createTimeout
  }
)(ArbitrableTx)