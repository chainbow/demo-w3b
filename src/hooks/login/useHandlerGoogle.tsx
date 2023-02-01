import { signIn } from "next-auth/react";

const useHandlerGoogle = () => {

  return async (params: any) => {
    return await signIn("google");
  };
};

export default useHandlerGoogle;
