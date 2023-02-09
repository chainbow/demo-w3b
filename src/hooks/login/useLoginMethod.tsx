import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import { injectedConnector, walletConnector } from "../../pages/_app";

const useLoginMethod = () => {
  const {signMessageAsync} = useSignMessage();
  const {chain} = useNetwork();
  const {address, isConnected} = useAccount();
  const {connect} = useConnect();
  const {disconnect} = useDisconnect();


  const isAutoLogin = () => {
    return window.navigator?.userAgent?.indexOf("Wallet3") !== -1;
  };


  const loginByWallet3 = async () => {
    if (isAutoLogin()) {
      await loginByEthereum();
    } else {
      window.open(`https://wallet3.io/wc/?uri=wallet3://open?url=https://dagen.life`);
    }
  };


  const loginByEthereum = async () => {
    if (isConnected) await disconnect();
    await connect({connector: injectedConnector});
  };


  const loginByWalletConnect = async () => {
    if (isConnected) await disconnect();
    await connect({connector: walletConnector});
  };


  const loginByTwitter = async () => {
    await signIn("twitter");
  };

  const loginByGoogle = async () => {
    await signIn("google");
  };

  const loginByEmail = async (email: string) => {
    await signIn("email", {redirect: false, email});
  };

  const authSign = async () => {
    try {
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
      const signature = await signMessageAsync({message: message.prepareMessage()});
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error: any) {
      console.error("[auth error]", error.message);
    }
  };


  return {isAutoLogin, loginByWallet3, loginByEthereum, loginByWalletConnect, loginByTwitter, loginByGoogle, loginByEmail, authSign};
};

export default useLoginMethod;
