import { NextPage } from "next";
import useHandlerWallet3 from "../../hooks/login/useHandlerWallet3";
import useHandlerMetamask from "../../hooks/login/useHandlerMetamask";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";
import { useEffect, useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Avatar } from "@mui/material";
import { EmailModal } from "./EmailModal";


interface LoginMethod {
  name: string,
  img: string,
  handler: any
}


const LoginListView: NextPage = () => {
  const [showModal, setShowModal] = useState(false);
  const injectedConnector = new InjectedConnector({supportedChainIds: [1, 5]});
  const {activate, account} = useWeb3React<Web3Provider>();
  const loginMethod: LoginMethod[] = [
    {name: "Wallet3", img: "wallet3", handler: useHandlerWallet3()},
    {name: "Metamask", img: "metamask", handler: useHandlerMetamask()},
    {name: "Email", img: "mail", handler: useHandlerEmail()},
    {name: "Twitter", img: "twitter", handler: useHandlerTwitter()},
    {name: "Google", img: "google", handler: useHandlerGoogle()},
  ];

  useEffect(() => {
    activate(injectedConnector);
  }, [account]);

  const onLogin = async (loginItem: LoginMethod) => {
    const params = {} as any;

    if (loginItem.name === "Email") {
      setShowModal(true);
      return;
    }
    const executeHandler = loginItem.handler;
    await executeHandler(params);
  };


  return (
    <>
      { showModal && <EmailModal show={ true } onCallback={ (show) => setShowModal(show) }/> }

      <div style={ {display: "flex", alignItems: "center", gap: "70px", flexWrap: "wrap", justifyContent: "center"} }>
        { loginMethod.map((loginItem) => {
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

