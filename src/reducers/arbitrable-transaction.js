import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import * as arbitrabletxActions from '../actions/arbitrable-transaction'

// Common Shapes
const arbitrabletxFormShape = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  file: PropTypes.string,
  arbitrator: PropTypes.string,
  seller: PropTypes.string,
  email: PropTypes.string,
})

export const _arbitrabletxShape = PropTypes.shape({
  address: PropTypes.string,
  arbitrator: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disputeId: PropTypes.string,
  email: PropTypes.string,
  evidences: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, url: PropTypes.string })
  ),
  partyB: PropTypes.string,
  timeout: PropTypes.string,
  _id: PropTypes.string
})
export const _arbitrabletxsShape = PropTypes.arrayOf(_arbitrabletxShape.isRequired)

export const _evidenceShape = PropTypes.string

// Shapes
const {
  shape: arbitrabletxsShape,
  initialState: arbitrabletxsInitialState
} = createResource(_arbitrabletxShape)
const { shape: arbitrabletxShape, initialState: arbitrabletxInitialState } = createResource(
    _arbitrabletxShape,
  { withCreate: true }
)
const { shape: evidenceShape, initialState: evidenceInitialState } = createResource(
  _evidenceShape,
  { withCreate: true }
)

export { arbitrabletxFormShape, arbitrabletxsShape, arbitrabletxShape }

// Reducer
export default createReducer(
  {
    arbitrabletxs: arbitrabletxsInitialState,
    arbitrabletx: arbitrabletxInitialState,
    evidence: evidenceInitialState,
    arbitrabletxForm: {}
  },
  {
    [arbitrabletxActions.arbitrabletx.FORM]: (state, { payload: { arbitrabletxForm } }) => ({
      ...state,
      arbitrabletxForm
    })
  }
)

// Selectors
export const getArbitrabletxs = state => state.arbitrabletx.arbitrabletxs.data