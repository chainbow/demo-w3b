import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";

const useHandlerMetamask = () => {
  const {library, account} = useWeb3React<Web3Provider>();
  return async () => {
    try {
      if (!library) return;
      const web3Library: any = library;
      const signMessage = await web3Library.getSigner(account).signMessage("message");
      // 请求服务器验证签名
      const response = await axios.get("/api/checkSig", {params: {address: account, sig: signMessage, provider: "metamask"}});
      const result: { address: string, index: number } = response.data.result;
      localStorage.setItem("address", result.address);
      window.location.reload();
      console.info(`[response]`, response);
    } catch (error) {

    }
  };
};

export default useHandlerMetamask;
