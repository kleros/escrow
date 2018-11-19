import { combineReducers } from 'redux'

import arbitrableTx from './arbitrable-transaction'
import wallet from './wallet'

// Export root reducer
export default combineReducers({
  arbitrableTx,
  wallet
})