import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { providers } from "ethers";
import sample from "lodash/sample";

const useHandlerWallet3 = () => {
  const {activate} = useWeb3React<Web3Provider>();

  const getRpc = () => {
    const rpc: any = {};
    rpc[1] = sample(providers[1]);
    rpc[5] = sample(providers[5]);
    return rpc;
  };

  const walletconnect = new WalletConnectConnector({
    rpc: getRpc(),
    qrcode: true,
    pollingInterval: 12000,
  });

  return async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      activate(walletconnect);
    } else {
      window.open(`https://wallet3.io/wc/?uri=wallet3://open?url=https://dagen.life`);
    }
  };
};

export default useHandlerWallet3;
