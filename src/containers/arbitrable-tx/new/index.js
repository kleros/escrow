import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as arbitrabletxActions from '../../../actions/arbitrable-transaction'
import NewArbitrableTx from '../../../components/new-arbitrable-tx'

import './new.css'

class New extends PureComponent {
  static propTypes = {
    formArbitrabletx: PropTypes.func.isRequired
  }

  render() {
    const { formArbitrabletx } = this.props

    return (
      <div className=''>
        <NewArbitrableTx formArbitrabletx={formArbitrabletx} />
      </div>
    )
  }
}

export default connect(
  v => v,
  {
    formArbitrabletx: arbitrabletxActions.formArbitrabletx
  }
)(New)