import { NextPage } from "next";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";
import { useState } from "react";
import { Avatar } from "@mui/material";
import { EmailModal } from "./EmailModal";
import { getCsrfToken, signIn } from "next-auth/react";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { SiweMessage } from "siwe";
import { InjectedConnector as web3InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";


interface LoginMethod {
  name: string,
  img: string,
  handler: any
}

interface ILoginListView {
  onCallback: () => void;
}

const LoginListView: NextPage<ILoginListView> = ({onCallback}) => {
  const [showModal, setShowModal] = useState(false);
  const {signMessageAsync} = useSignMessage();
  const {chain} = useNetwork();
  const {address, isConnected} = useAccount();
  const {activate} = useWeb3React();
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });
  const loginMethods: LoginMethod[] = [
    {name: "Wallet3", img: "wallet3", handler: () => loginByWallet3()},
    {name: "Metamask", img: "metamask", handler: () => loginByEthereum()},
    {name: "Email", img: "mail", handler: () => loginByEmail()},
    {name: "Twitter", img: "twitter", handler: useHandlerTwitter()},
    {name: "Google", img: "google", handler: useHandlerGoogle()},
  ];

  const onLogin = async (loginItem: LoginMethod) => {
    const params = {} as any;
    const executeHandler = loginItem.handler;
    await executeHandler(params);
    if (loginItem.name !== "Email") onCallback();
  };

  const loginByWallet3 = async () => {
    if (window.navigator?.userAgent?.indexOf("Wallet3") !== -1) {
      const chainIds = [1, 5];
      const web3Connector = new web3InjectedConnector({supportedChainIds: chainIds});
      activate(web3Connector);
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
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  const loginByEmail = async () => {
    const emailElement = document.getElementById("emailId");
    const canShowModal = !emailElement && showModal;
    setShowModal(!canShowModal);
  };


  return (
    <>
      { showModal && <EmailModal show={ true } onCallback={ (show) => setShowModal(show) }/> }

      <div className="gap-20 flex-1 justify-center items-center flex-wrap" style={ {display: "flex"} }>
        { loginMethods.map((loginItem) => {
          return <div onClick={ () => onLogin(loginItem) } key={ `login_item_${ loginItem.name }` }
                      className="cursor-pointer motion-safe:hover:scale-110 focus:opacity-60 "
                      style={ {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px"} }>
            <Avatar variant="square" alt="Remy Sharp" src={ `/${ loginItem.img }.png` } sx={ {width: 64, height: 64} }/>
            <span>{ loginItem.name }</span>
          </div>;
        }) }
      </div>


    </>
  );
};

export default LoginListView;

