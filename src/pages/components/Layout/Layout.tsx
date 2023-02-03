import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { HomeDialog } from "../../index";


export const Layout = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header loginCallback={ (open) => setIsOpen(open) }/>
      { isOpen && <HomeDialog onDismissCallback={ (open) => setIsOpen(open) }/> }
      { children }
      <Footer/>
    </>
  );
};

export default Layout;
