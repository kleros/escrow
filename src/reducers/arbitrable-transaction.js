import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import * as arbitrabletxActions from '../actions/arbitrable-transaction'

// Common Shapes
const arbitrabletxFormShape = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  file: PropTypes.string,
  sender: PropTypes.string,
  email: PropTypes.string,
  timeout: PropTypes.Number
})

export const _arbitrabletxShape = PropTypes.shape({
  address: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disputeId: PropTypes.string,
  email: PropTypes.string,
  timeout: PropTypes.Number,
  evidences: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, url: PropTypes.string })
  ),
  partyB: PropTypes.string,
  _id: PropTypes.string
})
export const _arbitrabletxsShape = PropTypes.arrayOf(
  _arbitrabletxShape.isRequired
)

export const _evidenceShape = PropTypes.string

// Shapes
const {
  shape: arbitrabletxsShape,
  initialState: arbitrabletxsInitialState
} = createResource(_arbitrabletxShape)
const {
  shape: arbitrabletxShape,
  initialState: arbitrabletxInitialState
} = createResource(_arbitrabletxShape, { withCreate: true })
const {
  shape: evidenceShape,
  initialState: evidenceInitialState
} = createResource(_evidenceShape, { withCreate: true })

export {
  arbitrabletxFormShape,
  arbitrabletxsShape,
  arbitrabletxShape,
  evidenceShape
}

// Reducer
export default createReducer(
  {
    arbitrabletxs: arbitrabletxsInitialState,
    arbitrabletx: arbitrabletxInitialState,
    evidence: evidenceInitialState,
    arbitrabletxForm: {},
    arbitrabletxResumeForm: {}
  },
  {
    [arbitrabletxActions.arbitrabletx.FORM]: (
      state,
      { payload: { arbitrabletxForm } }
    ) => ({
      ...state,
      arbitrabletxForm
    }),
    [arbitrabletxActions.arbitrabletx.RESUMEFORM]: (
      state,
      { payload: { arbitrabletxResumeForm } }
    ) => ({
      ...state,
      arbitrabletxResumeForm
    })
  }
)

// Selectors
export const getArbitrabletxs = state => state.arbitrabletx.arbitrabletxs.data
