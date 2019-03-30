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
import { ReactComponent as Plus } from '../assets/plus.svg'
import { ReactComponent as Envelope } from '../assets/envelope.svg'

import './app.css'

const NotFound = () => (
  <div>Sorry, nothing here.</div>
)

const Main = ({ children }) => (
  <div className='App'>
    <header className='header'>
      <Kleros className='logo' onClick={() => navigate('/')} style={{position: 'relative', top: '10px', left: '20px'}} />
      <input className='menu-btn' type='checkbox' id='menu-btn' />
      <label className='menu-icon' htmlFor='menu-btn'><span className='navicon'></span></label>
      <ul className='menu'>
        <li onClick={() => navigate('/notifications')}>
          <Envelope style={{height: '15px'}} />
        </li>
        <li onClick={() => navigate('/new/invoice')}>
          <span className='btn-new btn-new-invoice'>
            <Plus style={{position: 'relative', top: '1px', height: '15px', marginRight: '10px'}} />
            New Invoice
          </span>
        </li>
        <li onClick={() => navigate('/new/transaction')}>
          <span className='btn-new'>
            <Plus style={{position: 'relative', top: '1px', height: '15px', marginRight: '10px'}} />
            New Transaction
          </span>
        </li>
      </ul>
    </header>
    <main>
      {children}
    </main>
  </div>
)

const App = ({store}) => (
  <Provider store={store}>
    <Initializer>
      <>
        <Helmet>
          <title>Escrow - Blockchain service - Kleros</title>
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