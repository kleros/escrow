import { call, takeLatest } from 'redux-saga/effects'
import ArbitrableTokenList from '@kleros/kleros-interaction/build/contracts/ArbitrableTokenList.json'
import ArbitrableAddressList from '@kleros/kleros-interaction/build/contracts/ArbitrableAddressList.json'

import {
  web3,
  ERC20_ADDRESS,
  T2CR_ADDRESS
} from '../bootstrap/dapp-api'
import * as tokensActions from '../actions/tokens'
import { lessduxSaga } from '../utils/saga'

/**
 * Fetches the tokens in the T2CR.
 * @returns {number} - The balance.
 */
export function* fetchTokens() {
  if (window.ethereum) yield call(window.ethereum.enable)

  const arbitrableTokenListInstance = new web3.eth.Contract(
    ArbitrableTokenList.abi,
    T2CR_ADDRESS
  )
  const ERC20BadgeInstance = new web3.eth.Contract(
    ArbitrableAddressList.abi,
    ERC20_ADDRESS
  )
  const tokens = []

  let moreTokens = true
  let lastAddress = '0x0000000000000000000000000000000000000000'
  while(moreTokens) {
    const query = yield call(ERC20BadgeInstance.methods.queryAddresses(
      lastAddress,
      1000,
      [false,true,false,false,false,false,false,false],
      true
    ).call)
    moreTokens = query.hasMore

    for (let address of query.values) {
      if (address === '0x0000000000000000000000000000000000000000') break // Went through whole list
      const token = {}
      const tokenQuery = yield call(arbitrableTokenListInstance.methods.queryTokens(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        1,
        [false,true,false,false,false,false,false,false],
        true,
        address
      ).call)

      const tokenID = tokenQuery.values[0]
      const _token = yield call(arbitrableTokenListInstance.methods.tokens(tokenID).call)

      if (_token.addr === '0x0000000000000000000000000000000000000000') continue // Tokens with badges that have been removed from the list return null address
      if (_token.ticker === 'ZRX') _token.name = '0x' // We need a hack to get the 0x symbol which is interpreted as hex null by web3.

      token.name = _token.name
      token.ticker = _token.ticker
      token.address = _token.addr
      token.symbolURI = (
        _token.symbolMultihash[0] === '/'
          ? `https://ipfs.kleros.io${_token.symbolMultihash}`
          : `https://production-doges-on-trial-doge-images.s3.us-east-2.amazonaws.com/${_token.symbolMultihash}`
      )

      tokens.push(token)
    }
  }

  return tokens
}

/**
 * The root of the token saga.
 * @export default tokenSaga
 */
export default function* tokenSaga() {
  yield takeLatest(
    tokensActions.tokens.FETCH,
    lessduxSaga,
    'fetch',
    tokensActions.tokens,
    fetchTokens
  )
}
