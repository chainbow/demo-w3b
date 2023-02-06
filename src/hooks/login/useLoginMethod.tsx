import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";


const useLoginMethod = () => {
  const {signMessageAsync} = useSignMessage();
  const {chain} = useNetwork();
  const {address, isConnected} = useAccount();
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });


  // 在wallet3 钱包中默认屌用登陆方法
  const initLoginByWallet3 = async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      await loginByEthereum();
    }
  };

  const loginByWallet3 = async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      await loginByEthereum();
    } else {
      window.open(`https://wallet3.io/wc/?uri=wallet3://open?url=https://dagen.life`);
    }
  };


  const loginByEthereum = async () => {
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
      setTimeout(() => {
        loginByEthereum();
      }, 2000);
    }
  };


  const loginByTwitter = async () => {
    await signIn("twitter");
  };

  const loginByGoogle = async () => {
    await signIn("google");
  };

  const loginByEmail = async (email: string) => {
    return await signIn("email", {redirect: false, email});
  };


  return {loginByWallet3, loginByEthereum, initLoginByWallet3, loginByTwitter, loginByGoogle, loginByEmail};
};

export default useLoginMethod;
