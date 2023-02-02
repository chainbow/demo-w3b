import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const useHandlerMetamask = () => {
  const {library, account} = useWeb3React<Web3Provider>();

  return async () => {
    try {
      if (!library) return null;
      const web3Library: any = library;
      const signMessage = await web3Library.getSigner(account).signMessage("message");
      console.info(`[当前的signMessage]`, signMessage);
      return null;
    } catch (error: any) {
      return null;
    }
  };
};

export default useHandlerMetamask;
