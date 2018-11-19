import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { Router } from "@reach/router"

import Initializer from './initializer'
import Balance from '../containers/balance'

import './app.css'

const NotFound = () => (
  <div>Sorry, nothing here.</div>
)

const App = ({ store, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <React.Fragment>
        <Helmet>
          <title>Kleros Dapp</title>
        </Helmet>
        <div className="App">
          <Router>
            <Balance path="/" />
            <NotFound default />
          </Router>
        </div>
        {testElement}
      </React.Fragment>
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