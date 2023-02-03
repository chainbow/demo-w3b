import { AppType } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Web3ReactProvider } from "@web3-react/core";
// import type  { Web3Provider } from "@ethersproject/providers";
// import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers/src.ts/web3-provider";
import { api } from "../utils/api";
import "../styles/globals.css";

// export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
//   const library = new Web3Provider(provider);
//   library.pollingInterval = 12000;
//   return library;
// };

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {

  return (
    <SessionProvider session={ session }>
      <Component { ...pageProps } />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
