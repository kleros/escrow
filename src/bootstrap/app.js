import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'

import Initializer from './initializer'
import Balance from '../containers/balance'

import './app.css'

const App = ({ store, testElement }) => (
  <Provider store={store}>
    <Initializer>
        <div id="router-root">
          <Helmet>
            <title>Kleros Dapp</title>
          </Helmet>
          <div className="App">
            <header className="App-header">
            <Balance />
            </header>
          </div>
          {testElement}
        </div>
    </Initializer>
  </Provider>
)

App.propTypes = {
  // State
  store: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
}

App.defaultProps = {
  testElement: null
}

export default App