import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: accountsShape,
  initialState: accountsInitialState
} = createResource(PropTypes.arrayOf(PropTypes.string.isRequired))
const {
  shape: balanceShape,
  initialState: balanceInitialState
} = createResource(PropTypes.string)
export { accountsShape, balanceShape }

// Reducer
export default createReducer({
  accounts: accountsInitialState,
  balance: balanceInitialState
})

// Selectors
export const getAccount = state =>
  state.wallet.accounts.data && state.wallet.accounts.data[0]