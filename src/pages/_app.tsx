import { AppType } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers/src.ts/web3-provider";
import { api } from "../utils/api";
import "../styles/globals.css";

export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {

  return (
    <Web3ReactProvider getLibrary={ getLibrary }>
      <SessionProvider session={ session }>
        <Component { ...pageProps } />
      </SessionProvider>
    </Web3ReactProvider>
  );
};

export default api.withTRPC(MyApp);
