import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi";

const useLoginMethod = () => {
  const {signMessageAsync} = useSignMessage();
  const {chain} = useNetwork();
  const {address, isConnected} = useAccount();
  const {data: session} = useSession();
  const {connect, connectors} = useConnect();
  const {disconnect} = useDisconnect();


  // 在wallet3 钱包中默认屌用登陆方法
  const initLoginByWallet3 = async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      await loginByEthereum();
      return true;
    }
    return false;
  };

  const loginByWallet3 = async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      await loginByEthereum();
    } else {
      window.open(`https://wallet3.io/wc/?uri=wallet3://open?url=https://dagen.life`);
    }
  };


  const loginByEthereum = async () => {
    const connector = connectors.find(item => item.name === "Injected");
    if (isConnected) await disconnect();
    await connect({connector});
  };


  const loginByWalletConnect = async () => {
    const walletConnectConnector = connectors.find(item => item.name === "WalletConnect");
    console.info(`[loginByWalletConnect connectors]`, walletConnectConnector, isConnected);
    if (isConnected) await disconnect();
    await connect({connector: walletConnectConnector});
  };


  const authSign = async () => {
    try {
      const callbackUrl = "/protected";
      console.info(`retry remove`, address);
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      console.info(`retry remove`, message);
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
      console.info(`retry remove`);
      localStorage.removeItem("walletRetry");
    } catch (error: any) {

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


  return {loginByWallet3, loginByEthereum, initLoginByWallet3, loginByWalletConnect, loginByTwitter, loginByGoogle, loginByEmail, authSign};
};

export default useLoginMethod;
