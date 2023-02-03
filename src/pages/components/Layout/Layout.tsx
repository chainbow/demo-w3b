import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { HomeDialog } from "../../index";


export const Layout = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onLoginCallback = (open) => {
    const loginListElement = document.getElementById("loginListId");
    if (!loginListElement && isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(open);
  };

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
