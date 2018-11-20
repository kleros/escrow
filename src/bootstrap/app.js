import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { Router, Link } from "@reach/router"

import Initializer from './initializer'
import Balance from '../containers/balance'
import Home from '../containers/home'
import ArbitrableTx from '../containers/arbitrable-tx'

import './app.css'

const NotFound = () => (
  <div>Sorry, nothing here.</div>
)

const TestElement = () => (
  <div>
     <header>
      <div class="options">
        <a href="#" class="options-link link-active">My transactions</a>
        <a href="#" class="options-link">New Transaction</a>
      </div>
    </header>
  <main>
   <section>
      <h2>The Title</h2>
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a href="#" class="info-link">Learn more...</a>
    </section>
    <section>
      <h2>The Title</h2>
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a href="#" class="info-link" >Learn more...</a>
    </section>
    <section>
      <h2>The Title</h2>
      <img class="section-img profile" src="http://placekitten.com/260/260" />
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a href="#" class="info-link">Learn more...</a>
    </section>
    <section class="bigbottom">
      <h2>The Title</h2>
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a class="bigbottom-link info-link" href="#" class="info-link">Learn more...</a>
    </section>
    <section class="bigtitle">
      <h2 class="bigtitle-title">The Title</h2>
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a href="#" class="info-link">Learn more...</a>
    </section>
    <section>
      <h2>The Title</h2>
      <p>Some Text goes here, some text goes here, some text goes here, some text goes here.</p>
      <a href="#" class="info-link">Learn more...</a>
    </section>
  </main>
  </div>
  )

const Main = ({ children }) => (
  <React.Fragment>
    <nav>
      Menu
      <ul>
        <li><Link to="./">My Transactions</Link></li>
        <li><Link to="new">New Transaction</Link></li>
      </ul>
    </nav>
    {children}
  </React.Fragment>
)

const App = ({ store, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <React.Fragment>
        <Helmet>
          <title>Kleros Dapp</title>
        </Helmet>
        <div className="">
          <Router>
            <Main path="/">
              <ArbitrableTx path="test" />
              <Home path="/" />
              <Balance path=":arbitrableTxId" />
              <Home path="/new" />
              <NotFound default />
            </Main>
          </Router>
        </div>
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