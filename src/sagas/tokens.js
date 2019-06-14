import { all, call, put, takeLatest } from 'redux-saga/effects'
import { navigate } from '@reach/router'
import ArbitrableTokenList from '@kleros/kleros-interaction/build/contracts/ArbitrableTokenList.json'
import ArbitrableAddressList from '@kleros/kleros-interaction/build/contracts/ArbitrableAddressList.json'

import * as tokensSelectors from '../reducers/tokens'
import * as tokensActions from '../actions/tokens'
import { web3 } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'
import * as errorConstants from '../constants/error'

/**
 * Fetches the tokens in the T2CR.
 * @returns {number} - The balance.
 */
export function* fetchTokens() {
  if (window.ethereum) yield call(window.ethereum.enable)

  const arbitrableTokenListInstance = new web3.eth.Contract(
    ArbitrableTokenList.abi,
    '0xebcf3bca271b26ae4b162ba560e243055af0e679'
  )
  const ERC20BadgeInstance = new web3.eth.Contract(
    ArbitrableAddressList.abi,
    '0xcb4aae35333193232421e86cd2e9b6c91f3b125f'
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
