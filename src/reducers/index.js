import { combineReducers } from 'redux'

import arbitrabletx from './arbitrable-transaction'
import wallet from './wallet'

// Export root reducer
export default combineReducers({
  arbitrabletx,
  wallet
})
