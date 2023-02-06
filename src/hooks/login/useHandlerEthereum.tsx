import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { getCsrfToken, signIn } from "next-auth/react";
import { InjectedConnector } from "wagmi/dist/connectors/injected";

const useHandlerEthereum = () => {
  const {signMessageAsync} = useSignMessage();
  const {chain} = useNetwork();
  const {address, isConnected} = useAccount();
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });
  return async () => {
    try {
      if (!isConnected) await connect();
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };
};

export default useHandlerEthereum;
