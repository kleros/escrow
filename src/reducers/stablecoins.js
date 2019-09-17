import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Common Shapes
const _stablecoinsShape = PropTypes.arrayOf(
  PropTypes.shape({
    address: PropTypes.string
  })
)

// Shapes
const {
  shape: stablecoinsShape,
  initialState: stablecoinsInitialState
} = createResource(_stablecoinsShape)

export {
  stablecoinsShape
}

// Reducer
export default createReducer(
  {
    stablecoins: stablecoinsInitialState
  }
)

// Selectors
export const getStablecoins = state => state.stablecoins.stablecoins.data
