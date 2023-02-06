import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { HomeDialog } from "./HomeDialog";
import useLoginMethod from "../../../hooks/login/useLoginMethod";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";

export const Layout = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {initLoginByWallet3} = useLoginMethod();
  const {address, isConnected} = useAccount();
  const {data: session} = useSession();


  const onLoginCallback = (open) => {
    const loginListElement = document.getElementById("loginListId");
    if (!loginListElement && isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (session === undefined || session) return
    const isForceQuit = localStorage.getItem("forceQuit");
    if (isForceQuit && !JSON.parse(isForceQuit)) initLoginByWallet3();
  }, [session]);


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
