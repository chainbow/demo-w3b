import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { HomeDialog } from "./HomeDialog";
import useLoginMethod from "../../../hooks/login/useLoginMethod";
import { useAccount } from "wagmi";

export const Layout = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {initLoginByWallet3} = useLoginMethod();
  const {address, isConnected} = useAccount();


  const onLoginCallback = (open) => {
    const loginListElement = document.getElementById("loginListId");
    if (!loginListElement && isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    const isForceQuit = localStorage.getItem("forceQuit");
    if (isForceQuit && !JSON.parse(isForceQuit)) initLoginByWallet3();
    console.info(`[isForceQuit]`,isForceQuit)
  }, []);


  return (
    <>
      <Header loginCallback={ (open) => onLoginCallback(open) }/>
      { isOpen && <HomeDialog onDismissCallback={ (open) => setIsOpen(open) }/> }
      { children }
      <Footer/>
    </>
  );
};

export default Layout;
