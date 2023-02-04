import { AppType } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Web3ReactProvider } from "@web3-react/core";
import { api } from "../utils/api";
import "../styles/globals.css";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";

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
    <SessionProvider session={ session }>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component { ...pageProps } />
      </Web3ReactProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
