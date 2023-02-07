import { AppType } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import React, { useEffect } from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { arbitrum, optimism, polygon } from "@wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";


export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};


export const {chains, provider} = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()],
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-useragent", navigator.userAgent);
  }, []);

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
