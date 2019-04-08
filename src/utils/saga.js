import { call, put } from 'redux-saga/effects'

import { action as _action, errorAction } from './action'

/**
 * Calls a saga with the `lessdux` flow.
 * @param {string} flow - The `lessdux` flow that should be used, (create, fetch, update, delete).
 * @param {object} resourceActions - The `lessdux` resource actions object.
 * @param {object} saga - The saga being called.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object that triggered the saga.
 */
export function* lessduxSaga(flow, resourceActions, saga, action) {
  let receiveWord
  let failWord
  switch (flow) {
    case 'create':
      receiveWord = '_CREATED'
      failWord = '_CREATE'
      break
    case 'fetch':
      receiveWord = ''
      failWord = '_FETCH'
      break
    case 'update':
      receiveWord = '_UPDATED'
      failWord = '_UPDATE'
      yield put(_action(resourceActions.UPDATE)) // Updates are not called directly so call it here to set .updating on the resource
      break
    case 'delete':
      receiveWord = '_DELETED'
      failWord = '_DELETE'
      break
    default:
      throw new TypeError('Invalid lessdux flow.')
  }

  try {
    const result = yield call(saga, action)

    yield put(
      _action(resourceActions['RECEIVE' + receiveWord], {
        [result.collection ? 'collectionMod' : resourceActions.self]: result
      })
    )
  } catch (err) {
    err.message &&
      console.info(
        'Your connection is unstable, please check your network and refresh the page.'
      )
    yield put(errorAction(resourceActions['FAIL' + failWord], err))
  }
}
