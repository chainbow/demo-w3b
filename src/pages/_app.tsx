import { AppType } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import React from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { arbitrum, optimism, polygon } from "@wagmi/chains";


export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};


export const {chains, provider} = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()],
);

export const walletConnector = new WalletConnectConnector({chains, options: {qrcode: true}});

export const injectedConnector = new InjectedConnector({chains, options: {name: "VPN STORE", shimChainChangedDisconnect: true}});

const client = createClient({
  autoConnect: true,
  connectors: [walletConnector, injectedConnector],
  provider,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  return (
    <SessionProvider session={ session }>
      <Web3ReactProvider getLibrary={ getLibrary }>
        <WagmiConfig client={ client }>
          <Component { ...pageProps } />
        </WagmiConfig>
      </Web3ReactProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
