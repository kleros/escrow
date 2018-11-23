import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { Router, Link } from "@reach/router"

import Initializer from './initializer'
import Home from '../containers/home'
import ArbitrableTx from '../containers/arbitrable-tx'
import New from '../containers/arbitrable-tx/new'
import Resume from '../containers/arbitrable-tx/resume'

import './app.css'

const NotFound = () => (
  <div>Sorry, nothing here.</div>
)

const Main = ({ children }) => (
  <div className='App'>
    <header>
      <nav>
        <ul>
          <li><Link to='./' >Ethcrow.io</Link></li>
          <li><Link to='./'>My Transactions</Link></li>
          <li style={{float: 'right'}}><Link to='new' style={{float: 'right'}}>New Transaction</Link></li>
        </ul>
      </nav>
    </header>
    <main>
      {children}
    </main>
  </div>
)

const App = ({ store, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <React.Fragment>
        <Helmet>
          <title>Ethcrow Dapp</title>
        </Helmet>
        <Router>
          <Main path="/">
            <Home path="/" />
            <Resume path="resume" />
            <New path="new" />
            <ArbitrableTx path=":arbitrableTxId" />
            <NotFound default />
          </Main>
        </Router>
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