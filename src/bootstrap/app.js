import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { Router, navigate } from "@reach/router"

import Initializer from './initializer'
import Home from '../containers/home'
import ArbitrableTx from '../containers/arbitrable-tx'
import New from '../containers/arbitrable-tx/new'
import Resume from '../containers/arbitrable-tx/resume'
import { ReactComponent as Kleros } from '../assets/kleros.svg'
import { ReactComponent as Plus } from '../assets/plus.svg'

import './app.css'

const NotFound = () => (
  <div>Sorry, nothing here.</div>
)

const Main = ({ children }) => (
  <div className='App'>
    <header>
      <nav>
        <ul>
          <li><a href='https://kleros.io'><Kleros style={{height: '35px', position: 'relative', top: '13px'}} /></a></li>
          <li onClick={() => navigate('/')}>Escrow</li>
          <li onClick={() => navigate('new')} style={{float: 'right'}}><span class='btn-new'><Plus style={{width: '19px', height: '35px', paddingRight: '8px', position: 'relative', top: '12px'}} />New Transaction</span></li>
          <li onClick={() => navigate('/')} style={{float: 'right', color: '#a892c5'}}>My Transactions</li>
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
          <title>Escrow Dapp</title>
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