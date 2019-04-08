/* eslint-disable global-require */
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import ReactTooltip from 'react-tooltip'

import rootReducer from '../reducers'
import rootSaga from '../sagas'

let sagaMiddleware
let store
let rootSagaTask

/**
 * Sets up the redux store.
 * @export default configureStore
 * @param {object} [initialState={}] The initial state for the redux store, defaults to an empty object.
 * @param {object} { dispatchSpy } Parameters necessary to setup integration tests.
 * @returns {object} An object with the store and the history objects.
 */
export default function configureStore(
  initialState = {},
  { dispatchSpy } = {}
) {
  sagaMiddleware = createSagaMiddleware()
  const enhancers = []
  const middleware = []
  const composeEnhancers =
    process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  if (process.env.NODE_ENV === 'development') {
    const reduxUnhandledAction = require('redux-unhandled-action').default
    middleware.push(
      reduxUnhandledAction(action =>
        console.error(
          `${action} didn't lead to creation of a new state object`,
          action
        )
      )
    )
  }

  if (dispatchSpy) {
    middleware.push(store => next => action => {
      dispatchSpy(action)
      return next(action)
    })
  }

  // Reattach tooltips if necessary
  middleware.push(store => next => action => {
    const prevState = store.getState()
    const result = next(action)
    if (prevState !== store.getState()) ReactTooltip.rebuild()
    return result
  })

  middleware.push(sagaMiddleware)
  enhancers.unshift(applyMiddleware(...middleware))
  store = createStore(rootReducer, initialState, composeEnhancers(...enhancers))
  rootSagaTask = sagaMiddleware.run(rootSaga)
  return { store }
}

if (module.hot) {
  module.hot.accept('../reducers', () => {
    store.replaceReducer(rootReducer)
  })
  module.hot.accept('../sagas', () => {
    rootSagaTask.cancel()
    rootSagaTask.done.then(() => (rootSagaTask = sagaMiddleware.run(rootSaga)))
  })
}
