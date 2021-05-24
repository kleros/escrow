import { takeLatest, select, call } from 'redux-saga/effects'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { web3, PATCH_USER_SETTINGS_URL } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'
import * as errorConstants from '../constants/error'

/**
 * Fetches the current wallet's accounts.
 * @returns {object[]} - The accounts.
 */
export function* fetchAccounts() {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  return accounts
}

/**
 * Fetches the current wallet's ethereum balance.
 * @returns {number} - The balance.
 */
export function* fetchBalance() {
  const balance = yield call(
    web3.eth.getBalance,
    yield select(walletSelectors.getAccount)
  )

  return web3.utils.fromWei(balance, 'ether')
}

/**
 * Updates the current wallet settings.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The updated settings object.
 */
function* updateEmail({ payload: { settings } }) {
  // Prepare and sign update
  const address = yield select(walletSelectors.getAccount)
  const signature = yield call(
    web3.eth.personal.sign,
    JSON.stringify(settings),
    address
  )

  // Send update
  const newSettings = yield call(fetch, PATCH_USER_SETTINGS_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: { address, settings, signature } })
  })

  // Return new settings
  const attributes = (yield call(() => newSettings.json())).payload.settings
    .Attributes

  return {
    email: attributes.email.S,
    disputeEmailNotification: attributes.escrowNotificationSettingDispute.BOOL,
    appealEmailNotification: attributes.escrowNotificationSettingAppeal.BOOL,
    rulingGivenEmailNotification:
      attributes.escrowNotificationSettingRulingGiven.BOOL
  }
}

/**
 * The root of the wallet saga.
 */
export default function* walletSaga() {
  // Accounts
  yield takeLatest(
    walletActions.accounts.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.accounts,
    fetchAccounts
  )

  // Balance
  yield takeLatest(
    walletActions.balance.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.balance,
    fetchBalance
  )

  // Settings
  yield takeLatest(
    walletActions.settingsEmail.UPDATE_EMAIL,
    lessduxSaga,
    'update',
    walletActions.settingsEmail,
    updateEmail
  )
}
