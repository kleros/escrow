import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 42]
});
injected.name = "injected";
injected.off = injected.removeListener.bind(injected);

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: process.env.NODE_ENV === "production" ? [1] : [42],
  chainId: process.env.NODE_ENV === "production" ? 1 : 42,
  rpc:
    process.env.NODE_ENV === "production"
      ? { 1: process.env.REACT_APP_PROD_ETHEREUM_PROVIDER_URL }
      : { 42: process.env.REACT_APP_DEV_ETHEREUM_PROVIDER_URL },
  qrcode: true
});
walletConnect.name = "walletConnect";
walletConnect.off = walletConnect.removeListener.bind(walletConnect);
