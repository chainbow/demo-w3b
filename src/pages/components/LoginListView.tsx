import { NextPage } from "next";
import useHandlerWallet3 from "../../hooks/login/useHandlerWallet3";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";
import { useState } from "react";
import { Avatar } from "@mui/material";
import { EmailModal } from "./EmailModal";
import useHandlerEthereum from "../../hooks/login/useHandlerEthereum";
import { useSession } from "next-auth/react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";


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
  const {data: session, status} = useSession();
  const {address, isConnected} = useAccount();
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });

  const loginMethods: LoginMethod[] = [
    {name: "Wallet3", img: "wallet3", handler: useHandlerWallet3()},
    {name: "Metamask", img: "metamask", handler: useHandlerEthereum()},
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
    await connect();
    const executeHandler = loginItem.handler;
    await executeHandler(params);
    onCallback();
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

