import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { Router, navigate } from '@reach/router'

import Initializer from './initializer'
import Home from '../containers/home'
import ArbitrableTx from '../containers/arbitrable-tx'
import New from '../containers/arbitrable-tx/new'
import Resume from '../containers/arbitrable-tx/resume'
import Notifications from '../containers/settings'
import { ReactComponent as Kleros } from '../assets/kleros.svg'
import { ReactComponent as Invoice } from '../assets/invoice.svg'
import { ReactComponent as Transaction } from '../assets/transaction.svg'
import { ReactComponent as Envelope } from '../assets/envelope.svg'

import './app.css'

const NotFound = () => <div>Sorry, nothing here.</div>

const Main = ({ children }) => (
  <div className="App">
    <header className="header">
      <Kleros
        className="logo"
        onClick={() => navigate('/')}
        style={{
          position: 'relative',
          top: '8px',
          left: '20px',
          width: 'auto',
          height: '46px'
        }}
      />
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn">
        <span className="navicon" />
      </label>
      <ul className="menu">
        <li onClick={() => navigate('/notifications')}>
          <Envelope
            style={{ position: 'relative', top: '12px', height: '15px' }}
          />
        </li>
        <li className="menu-invoice" onClick={() => navigate('/new/invoice')}>
          <span className="btn-new btn-new-invoice">
            <Invoice
              style={{
                position: 'relative',
                top: '7px',
                height: '24px',
                marginRight: '18px'
              }}
            />
            New Invoice
          </span>
        </li>
        <li
          className="menu-transaction"
          onClick={() => navigate('/new/transaction')}
        >
          <span className="btn-new">
            <Transaction
              style={{
                position: 'relative',
                top: '7px',
                height: '24px',
                marginRight: '10px'
              }}
            />
            New Transaction
          </span>
        </li>
      </ul>
    </header>
    <main>{children}</main>
  </div>
)

const App = ({ store }) => (
  <Provider store={store}>
    <Initializer>
      <>
        <Helmet>
          <title>Kleros · Escrow</title>
        </Helmet>
        <Router>
          <Main path="/">
            <Home path="/" />
            <New path="/new/:type" />
            <ArbitrableTx path="/contract/:contract/transaction/:arbitrableTxId" />
            <Notifications path="/notifications" />
            <Resume path="/:type/:metaEvidenceIPFSHash" />
            <NotFound default />
          </Main>
        </Router>
      </>
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
