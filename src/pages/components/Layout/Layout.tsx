import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { HomeDialog } from "./HomeDialog";
import useLoginMethod from "../../../hooks/login/useLoginMethod";

export const Layout = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {initLoginByWallet3} = useLoginMethod();

  const onLoginCallback = (open) => {
    const loginListElement = document.getElementById("loginListId");
    if (!loginListElement && isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    initLoginByWallet3();
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
