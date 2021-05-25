import React from 'react';
import t from 'prop-types';
import { useWeb3React } from "@web3-react/core";
import useActiveConnector from "../hooks/use-active-connector";

export default function WalletDisconnectButton({ children, className }) {
  const { deactivate } = useWeb3React();

  const [, setActiveConnector] = useActiveConnector();

  const handleClick = React.useCallback(
    () => {
      deactivate();
      setActiveConnector(null);
      window.location.reload();
    },
    [deactivate]
  );

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

WalletDisconnectButton.propTypes = {
  children: t.node.isRequired,
  className: t.string
};

