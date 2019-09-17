import { combineReducers } from 'redux'

import arbitrabletx from './arbitrable-transaction'
import wallet from './wallet'
import tokens from './tokens'
import stablecoins from './stablecoins'

// Export root reducer
export default combineReducers({
  arbitrabletx,
  wallet,
  tokens,
  stablecoins
})
