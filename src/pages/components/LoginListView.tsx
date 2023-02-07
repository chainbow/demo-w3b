import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { EmailModal } from "./EmailModal";
import styled from "styled-components";
import useLoginMethod from "../../hooks/login/useLoginMethod";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";

export const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 70px;

  .avatar {
    width: 64px;
    height: 64px;
  }

  @media screen and (max-width: 600px) {
    gap: 40px;
    .avatar {
      width: 36px;
      height: 36px;
    }
  }

`;


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
  const {loginByEthereum, loginByWallet3, loginByGoogle, loginByTwitter, loginByWalletConnect, authSign} = useLoginMethod();
  const {address, isConnected} = useAccount();
  const {data: session} = useSession();


  const loginMethods: LoginMethod[] = [
    {name: "Wallet3", img: "wallet3.png", handler: () => loginByWallet3()},
    {name: "Metamask", img: "metamask.png", handler: () => loginByEthereum()},
    {name: "WalletConnect", img: "walletConnect.svg", handler: () => loginByWalletConnect()},
    {name: "Email", img: "mail.png", handler: () => loginByEmail()},
    {name: "Twitter", img: "twitter.png", handler: () => loginByTwitter()},
    {name: "Google", img: "google.png", handler: () => loginByGoogle()},
  ];

  const onLogin = async (loginItem: LoginMethod) => {
    const params = {} as any;
    const executeHandler = loginItem.handler;
    await executeHandler(params);
  };


  const loginByEmail = async () => {
    const emailElement = document.getElementById("emailId");
    const canShowModal = !emailElement && showModal;
    setShowModal(!canShowModal);
  };

  // 签名链接之后才能继续签名
  useEffect(() => {
    if (address && isConnected && !session) authSign();

    if (address && isConnected && session) onCallback();

  }, [address, isConnected, session]);


  return (
    <>
      { showModal && <EmailModal show={ true } onCallback={ (show) => setShowModal(show) }/> }

      <ListContainer>
        { loginMethods.map((loginItem) => {
          return <div onClick={ () => onLogin(loginItem) } key={ `login_item_${ loginItem.name }` }
                      className="cursor-pointer motion-safe:hover:scale-110 focus:opacity-60 "
                      style={ {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px"} }>
            <Avatar variant="square" alt="Remy Sharp" src={ `/${ loginItem.img }` } className="avatar"/>
            <span>{ loginItem.name }</span>
          </div>;
        }) }
      </ListContainer>


    </>
  );
};

export default LoginListView;

