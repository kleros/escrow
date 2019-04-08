import React from 'react'
import { mount } from 'enzyme'

import configureStore from './configure-store'
import App from './app'

/**
 * Wait for all promises to resolve in a test environment and update the app.
 * @param {object} app - The app wrapper to update.
 * @returns {Promise<number>} - A promise that resolves when the timeout handler is called.
 */
export function flushPromises(app) {
  return new Promise(resolve =>
    setTimeout(() => {
      app.update()
      resolve()
    }, 1000)
  )
}

/**
 * Sets up an integration test environment.
 * @param {object} [initialState={}] - The initial state.
 * @returns {{ store: object, history: object, dispatchSpy: function, mountApp: function }} - Utilities for testing.
 */
export default function setupIntegrationTest(initialState = {}) {
  const dispatchSpy = jest.fn(() => ({}))
  const { store, history } = configureStore(initialState, {
    dispatchSpy
  })
  const mountApp = testElement =>
    mount(<App store={store} history={history} testElement={testElement} />)

  return { store, history, dispatchSpy, mountApp }
}
