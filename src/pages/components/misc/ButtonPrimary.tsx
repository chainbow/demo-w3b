import React from "react";
import { NextPage } from "next";


export const ButtonPrimary: NextPage<any> = ({children, addClass}) => {
  return (
    <button
      className={
        "py-3 lg:py-4 px-12 lg:px-16 text-white-500 font-semibold rounded-lg bg-orange-500 hover:shadow-orange-md transition-all outline-none " +
        addClass
      }
    >
      { children }
    </button>
  );
};

export default ButtonPrimary;
