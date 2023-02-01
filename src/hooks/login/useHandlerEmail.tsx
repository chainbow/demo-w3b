import { signIn } from "next-auth/react";

const useHandlerEmail = () => {


  return async (email: string) => {
    // : "paopaoxiaoyanjing@gmail.com"
    return await signIn("email", {redirect: false, email});
  };
};

export default useHandlerEmail;
