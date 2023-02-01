import { signIn } from "next-auth/react";

const useHandlerTwitter = () => {
  return async (params: any) => {
    return await signIn("twitter");
  };
};

export default useHandlerTwitter;
