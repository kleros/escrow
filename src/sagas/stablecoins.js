import { call, takeLatest } from 'redux-saga/effects'
import ArbitrableAddressList from '@kleros/kleros-interaction/build/contracts/ArbitrableAddressList.json'

import {
  web3,
  STABLECOIN_ADDRESS,
} from '../bootstrap/dapp-api'
import * as stablecoinsActions from '../actions/stablecoins'
import { lessduxSaga } from '../utils/saga'

/**
 * Fetches the addresses of stablecoins from the stablecoin badge contract.
 * @returns {Array} - The token addresses.
 */
export function* fetchStablecoins() {
  if (window.ethereum) yield call(window.ethereum.enable)

  const StablecoinBadgeInstance = new web3.eth.Contract(
    ArbitrableAddressList.abi,
    STABLECOIN_ADDRESS
  )
  const stablecoins = []

  let moreStablecoins = true
  let lastAddress = '0x0000000000000000000000000000000000000000'
  while(moreStablecoins) {
    const query = yield call(StablecoinBadgeInstance.methods.queryAddresses(
      lastAddress,
      1000,
      [false,true,false,false,false,false,false,false],
      true
    ).call)
    moreStablecoins = query.hasMore

    for (let address of query.values) {
      if (address === '0x0000000000000000000000000000000000000000') break // Went through whole list
      stablecoins.push(address)
    }
    lastAddress = stablecoins.length > 0 ? stablecoins[stablecoins.length - 1] : lastAddress
  }

  return stablecoins
}

/**
 * The root of the stablecoin saga.
 * @export default stablecoinSaga
 */
export default function* stablecoinSaga() {
  yield takeLatest(
    stablecoinsActions.stablecoins.FETCH,
    lessduxSaga,
    'fetch',
    stablecoinsActions.stablecoins,
    fetchStablecoins
  )
}
