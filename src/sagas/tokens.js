import { call, takeLatest, all } from 'redux-saga/effects'
import ArbitrableTokenList from '@kleros/kleros-interaction/build/contracts/ArbitrableTokenList.json'
import ArbitrableAddressList from '@kleros/kleros-interaction/build/contracts/ArbitrableAddressList.json'
import TokensView from '../assets/abi/tokensView.json'

import {
  web3,
  ERC20_ADDRESS,
  T2CR_ADDRESS,
  TOKENS_VIEW_ADDRESS
} from '../bootstrap/dapp-api'
import * as tokensActions from '../actions/tokens'
import { lessduxSaga } from '../utils/saga'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

/**
 * Fetches the tokens in the T2CR.
 * @returns {number} - The balance.
 */
export function* fetchTokens() {
  const arbitrableTokenListInstance = new web3.eth.Contract(
    ArbitrableTokenList.abi,
    T2CR_ADDRESS
  )
  const ERC20BadgeInstance = new web3.eth.Contract(
    ArbitrableAddressList.abi,
    ERC20_ADDRESS
  )
  const TokensViewInstance = new web3.eth.Contract(
    TokensView.abi,
    TOKENS_VIEW_ADDRESS
  )
  const tokens = []

  let moreTokens = true
  let lastAddress = ZERO_ADDRESS
  while (moreTokens) {
    const query = yield call(ERC20BadgeInstance.methods.queryAddresses(
      lastAddress,
      1000,
      [false, true, false, false, false, false, false, false],
      true
    ).call)
    moreTokens = query.hasMore

    const tokenIDs = (yield call(
      TokensViewInstance.methods.getTokensIDsForAddresses(T2CR_ADDRESS, query.values.filter(addr => addr !== ZERO_ADDRESS)).call)
    ).filter(tokenID => tokenID !== ZERO_BYTES32)

    yield all(tokenIDs.filter(tokenID => tokenID !== ZERO_BYTES32).map(tokenID => call(async () => {
      const token = {}
      const _token = await arbitrableTokenListInstance.methods.tokens(tokenID).call()

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
    })))
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
