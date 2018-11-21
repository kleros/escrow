import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'

import './new.css'

class New extends PureComponent {
  static propTypes = {
    createArbitrabletx: PropTypes.func.isRequired
  }

  state = {
  }

  render() {
    const { createArbitrabletx } = this.props

    const { } = this.state

    return (
      <div className="container">
        dvfb
        <NewArbitrableTx createArbitrabletx={createArbitrabletx} />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {
    createArbitrabletx: arbitrabletxActions.formArbitrabletx
  }
)(New)