import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Common Shapes
const _tokensShape = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    ticker: PropTypes.string,
    address: PropTypes.string,
    symbolURI: PropTypes.string,
    erc20Verified: PropTypes.bool,
  })
)

// Shapes
const {
  shape: tokensShape,
  initialState: tokensInitialState
} = createResource(_tokensShape)

export {
  tokensShape
}

// Reducer
export default createReducer(
  {
    tokens: tokensInitialState
  }
)

// Selectors
export const getTokens = state => state.tokens.tokens.data
