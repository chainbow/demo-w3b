import { signIn } from "next-auth/react";

const useHandlerEmail = () => {


  return async (email: string) => {
    return await signIn("email", {redirect: false, email});
  };
};

export default useHandlerEmail;
