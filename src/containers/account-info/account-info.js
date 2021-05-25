import React from "react";
import clsx from "clsx";
import { useWeb3React } from "@web3-react/core";
import usePrevious from "../../hooks/use-previous";
import useClickOutside from "../../hooks/use-click-outside";
import WalletDisconnectButton from "../wallet-disconnect-button";
import "./account-info.css";

export default function AccountInfo() {
  const { account, connector, chainId } = useWeb3React();
  useReloadOnChainChanged({ chainId });

  const [showMenu, setShowMenu] = React.useState(false);
  const toggleMenu = React.useCallback(() => setShowMenu(show => !show), []);
  const hideMenu = React.useCallback(() => setShowMenu(false), []);

  const dropdownRef = React.useRef(null);
  useClickOutside(dropdownRef, hideMenu);

  return connector && account ? (
    <div className="account-wrapper">
      <div ref={dropdownRef} className="account-inner-wrapper">
        <button
          onClick={toggleMenu}
          className={clsx("account", { open: showMenu })}
        >
          <span className="account-network">
            {chainIdToNetworkName[chainId]}
          </span>
          <span className="account-address">{`${account.slice(
            0,
            6
          )}...${account.slice(-4)}`}</span>
        </button>
        {showMenu ? (
          <nav className="account-options">
            <ul className="account-options-list">
              <li className="account-options-item">
                <WalletDisconnectButton className="account-options-link">
                  Disconnect
                </WalletDisconnectButton>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  ) : null;
}

const chainIdToNetworkName = {
  1: "Mainnet",
  42: "Kovan"
};

function useReloadOnChainChanged({ chainId }) {
  const previousChainId = usePrevious(chainId);

  React.useEffect(
    () => {
      if (chainId && previousChainId && chainId !== previousChainId) {
        window.location.reload();
      }
    },
    [chainId, previousChainId]
  );
}
