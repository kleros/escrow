import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { Router, Link } from "@reach/router";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

import Initializer from "./initializer";
import Home from "../containers/home";
import ArbitrableTx from "../containers/arbitrable-tx";
import New from "../containers/arbitrable-tx/new";
import Resume from "../containers/arbitrable-tx/resume";
import Footer from "../components/footer";
import Notifications from "../containers/settings";
import AccountInfo from "../containers/account-info";
import { ReactComponent as Kleros } from "../assets/kleros.svg";
import { ReactComponent as Transaction } from "../assets/transaction.svg";
import { ReactComponent as Invoice } from "../assets/invoice.svg";

import "./app.css";

export default function App({ store }) {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Initializer>
          <>
            <Helmet>
              <title>Kleros · Escrow</title>
            </Helmet>
            <Router>
              <Main path="/">
                <Home path="/" />
                <New path="/new/:type" />
                <ArbitrableTx path="/contract/:contract/payment/:arbitrableTxId" />
                <Notifications path="/notifications" />
                <Resume path="/:type/:metaEvidenceIPFSHash" />
                <NotFound default />
              </Main>
            </Router>
          </>
        </Initializer>
      </Web3ReactProvider>
    </Provider>
  );
}

App.propTypes = {
  // State
  store: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
};

App.defaultProps = {
  testElement: null
};

function getLibrary(provider) {
  return new Web3(provider);
}

function Main({ children }) {
  return (
    <div className="App">
      <header className="header">
        <Link to="/" className="header-logo-link">
          <Kleros
            className="logo"
            style={{
              height: "46px",
              width: "auto"
            }}
          />
        </Link>
        <AccountInfo />
        <div className="menu-wrapper">
          <input className="menu-btn" type="checkbox" id="menu-btn" />
          <label className="menu-icon" htmlFor="menu-btn">
            <span className="navicon" />
          </label>
          <ul className="menu">
            <li className="menu-transaction">
              <Link to="/new/invoice" className="btn-new btn-new-invoice">
                <Invoice className="btn-icon" />
                New Invoice
              </Link>
            </li>
            <li className="menu-transaction">
              <Link to="/new/payment" className="btn-new">
                <Transaction className="btn-icon" />
                New Payment
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return <div>Sorry, nothing here.</div>;
}
