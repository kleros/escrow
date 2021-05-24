import React from "react";
import PropTypes from "prop-types";
import { useWeb3React } from "@web3-react/core";
import Button from "../../components/button";
import useActiveConnector from "../../hooks/use-active-connector";
import { web3, updateAddresses } from "../../bootstrap/dapp-api";
import { injected, walletConnect } from "../../bootstrap/connectors";
import metaMaskLogo from "../../assets/meta-mask-logo.png";
import walletConnectLogo from "../../assets/wallet-connect.svg";
import "./requires-wallet-page.css";

export default function RequiresWalletPage({ needsUnlock, onEnable }) {
  const { activate, connector, chainId, error, setError } = useWeb3React();

  const [activeConnector, setActiveConnector] = useActiveConnector();

  React.useEffect(
    () => {
      if (chainId) {
        updateAddresses(chainId);
      }
    },
    [chainId]
  );

  useEagerWalletConnection({
    activate,
    activeConnector
  });

  const enableMetamask = React.useCallback(
    async () => {
      try {
        await activate(injected, () => {}, true);
        setActiveConnector("injected");
        window.location.reload();
      } catch (err) {
        setActiveConnector(null);
        setError(
          Object.create(new Error("Failed to connect to Metamask"), {
            connector: { value: "injected" }
          })
        );
      }
    },
    [activate, setError, setActiveConnector]
  );

  const enableWalletConnect = React.useCallback(
    async () => {
      try {
        await activate(walletConnect, () => {}, true);
        setActiveConnector("walletConnect");
      } catch (err) {
        setError(
          Object.create(new Error("Failed to connect to WalletConnect"), {
            connector: { value: "walletConnect" }
          })
        );
        setActiveConnector(null);
      }
    },
    [activate, setError, setActiveConnector]
  );

  React.useEffect(
    () => {
      async function updateProvider() {
        const provider = await connector.getProvider();
        web3.setProvider(provider);
        onEnable();
      }

      if (connector) {
        updateProvider();
      }
    },
    [connector]
  );

  return (
    <>
      <div className="RequiresWalletPage">
        <div className="RequiresWalletPage-content">
          {needsUnlock ? (
            <>
              <h1 className="RequiresWalletPage-title">
                You need a Web3 enabled browser to run this dapp
              </h1>
              <ol className="RequiresWalletPage-list">
                <li className="RequiresWalletPage-list-item">
                  <picture className="RequiresWalletPage-logo-wrapper">
                    <img
                      alt="MetaMask Logo"
                      className="RequiresWalletPage-logo"
                      src={metaMaskLogo}
                    />
                  </picture>
                  <article className="RequiresWalletPage-list-content">
                    <h2 className="RequiresWalletPage-list-title">
                      We recommend using Chrome with the MetaMask extension.
                    </h2>
                    <p className="RequiresWalletPage-list-description">
                      This also serves as your login so you won't need to keep
                      track of another account and password.
                    </p>
                    <a
                      className="RequiresWalletPage-support-a"
                      href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Install MetaMask
                    </a>
                    <div>
                      <Button
                        className="RequiresWalletPage-connect-button"
                        onClick={enableMetamask}
                      >
                        Enable
                      </Button>
                    </div>
                    {error && error.connector === "injected" ? (
                      <div className="RequiresWalletPage-connection-error">
                        {error.message}
                      </div>
                    ) : null}
                  </article>
                </li>

                <li className="RequiresWalletPage-list-item">
                  <picture className="RequiresWalletPage-logo-wrapper">
                    <img
                      alt="WalletConnect Logo"
                      className="RequiresWalletPage-logo"
                      src={walletConnectLogo}
                      target="_blank"
                      rel="noreferrer noopener"
                    />
                  </picture>
                  <article className="RequiresWalletPage-list-content">
                    <h2 className="RequiresWalletPage-list-title">
                      You can also use WalletConnect.
                    </h2>
                    <p className="RequiresWalletPage-list-description">
                      Wallet Connect is an Open protocol for connecting Wallets
                      to Dapps.
                    </p>
                    <a
                      className="RequiresWalletPage-support-a"
                      href="https://walletconnect.org/"
                    >
                      Learn More
                    </a>
                    <div>
                      <Button
                        className="RequiresWalletPage-connect-button"
                        onClick={enableWalletConnect}
                      >
                        Enable
                      </Button>
                    </div>
                    {error && error.connector === "walletConnect" ? (
                      <div className="RequiresWalletPage-connection-error">
                        {error.message}
                      </div>
                    ) : null}
                  </article>
                </li>
              </ol>
            </>
          ) : (
            <>
              <h1 className="RequiresWalletPage-title">
                Wrong Metamask network configuration
              </h1>
              <p>
                Please ensure Metamask is set to the <strong>Main</strong>{" "}
                ethereum network
              </p>
            </>
          )}
        </div>
      </div>
      <div className="RequiresWalletPage-FAQ">
        <p className="RequiresWalletPage-FAQ-description">
          Still have questions? Don't worry, we're here to help!
        </p>
        <div className="RequiresWalletPage-support">
          <a
            className="RequiresWalletPage-support-a"
            href="mailto:stuart@kleros.io?Subject=Tokens%20on%20Trial%20Support"
          >
            Contact Support
          </a>
          <a
            className="RequiresWalletPage-support-a"
            href="https://t.me/kleros"
          >
            Ask in Telegram
          </a>
        </div>
      </div>
    </>
  );
}

RequiresWalletPage.propTypes = {
  needsUnlock: PropTypes.bool.isRequired,
  onEnable: PropTypes.func.isRequired
};

const connectorsByName = {
  injected,
  walletConnect
};

function useEagerWalletConnection({ activate, activeConnector }) {
  React.useEffect(
    () => {
      if (activeConnector && connectorsByName[activeConnector]) {
        activate(connectorsByName[activeConnector]);
      }
    },
    [activeConnector, activate]
  );
}
