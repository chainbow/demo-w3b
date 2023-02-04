import { NextPage } from "next";
import useHandlerWallet3 from "../../hooks/login/useHandlerWallet3";
import useHandlerMetamask from "../../hooks/login/useHandlerMetamask";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { EmailModal } from "./EmailModal";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";


interface LoginMethod {
  name: string,
  img: string,
  handler: any
}


const LoginListView: NextPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [requestMetamask, setRequestMetamask] = useState(false);
  const {library, activate} = useWeb3React<Web3Provider>();
  const injectedConnector = new InjectedConnector({supportedChainIds: [1, 5]});

  const loginMethods: LoginMethod[] = [
    {name: "Wallet3", img: "wallet3", handler: useHandlerWallet3()},
    {name: "Metamask", img: "metamask", handler: useHandlerMetamask()},
    {name: "Email", img: "mail", handler: useHandlerEmail()},
    {name: "Twitter", img: "twitter", handler: useHandlerTwitter()},
    {name: "Google", img: "google", handler: useHandlerGoogle()},
  ];

  const onLogin = async (loginItem: LoginMethod) => {
    const params = {} as any;

    if (loginItem.name === "Email") {
      const emailElement = document.getElementById("emailId");
      if (!emailElement && showModal) {
        setShowModal(false);
      } else {
        setShowModal(true);
      }
      return;
    }
    if (loginItem.name === "Metamask") {
      await activate(injectedConnector);
    }
    if (!library) setRequestMetamask(true);
    const executeHandler = loginItem.handler;
    await executeHandler(params);
  };

  useEffect(() => {
    if (!requestMetamask || !library) return;
    const loginItem: LoginMethod | undefined = loginMethods.find(item => item.name === "Metamask");
    if (!loginItem) return;
    console.info("[逻辑联机]");
    onLogin(loginItem);
  }, [requestMetamask]);


  return (
    <>
      { showModal && <EmailModal show={ true } onCallback={ (show) => setShowModal(show) }/> }

      <div style={ {display: "flex", alignItems: "center", gap: "70px", flexWrap: "wrap", justifyContent: "center"} }>
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

