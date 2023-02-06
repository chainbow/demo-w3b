import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import sample from "lodash/sample";
import providers from "../../../providers.json";


const useHandlerWallet3 = () => {
  const {activate} = useWeb3React<Web3Provider>();
  const chainIds = [1, 5];

  const getRpc = () => {
    const rpc: any = {};
    for (let index = 0; index < chainIds.length; index++) {
      const chainId: number | undefined = chainIds[index];
      if (chainId) {
        rpc[chainId] = sample(providers[chainId]);
      }
    }
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
