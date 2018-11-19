import { delay } from 'redux-saga'

import { spawn, call, all } from 'redux-saga/effects'

import walletSaga from './wallet'
// import arbitrableTransactionSaga from './arbitrable-transaction'

/**
 * Makes a saga restart after an uncaught error.
 * @param {object} saga - A generator function.
 * @returns {object} - A new generator function with the added functionality.
 */
export function makeRestartable(saga) {
  return function*() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        yield call(saga)
        throw new Error(
          `Unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime! ${saga}`
        )
      } catch (err) {
        /* istanbul ignore if  */
        if (process.env.NODE_ENV !== 'test')
          console.info(
            'Saga error, the saga will be restarted after 3 seconds.',
            err
          )
        yield call(delay, 3000)
      }
    }
  }
}

const rootSagas = [
    walletSaga, 
    // arbitrableTransactionSaga
].map(makeRestartable)

/**
 * The root saga.
 */
export default function* rootSaga() {
  yield all(rootSagas.map(saga => spawn(saga)))
}