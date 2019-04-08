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
const {
  shape: settingsShape,
  initialState: settingsInitialState
} = createResource(
  PropTypes.shape({
    email: PropTypes.string.isRequired
  }),
  {
    withUpdate: true
  }
)
export { accountsShape, balanceShape, settingsShape }

// Reducer
export default createReducer({
  accounts: accountsInitialState,
  balance: balanceInitialState,
  settings: {
    ...settingsInitialState,
    data: {
      email: '',
      disputeEmailNotification: false,
      appealEmailNotification: false,
      rulingGivenEmailNotification: false
    }
  }
})

// Selectors
export const getAccount = state =>
  state.wallet.accounts.data && state.wallet.accounts.data[0]
