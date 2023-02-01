import { NextPage } from "next";
import useHandlerWallet3 from "../../hooks/login/useHandlerWallet3";
import useHandlerMetamask from "../../hooks/login/useHandlerMetamask";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmailModal from "./Modal";


interface LoginMethod {
  name: string,
  img: string,
  handler: any
}


const LoginListView: NextPage = () => {
  const {data: session} = useSession();
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const loginMethod: LoginMethod[] = [
    {name: "Wallet3", img: "", handler: useHandlerWallet3()},
    {name: "Metamask", img: "", handler: useHandlerMetamask()},
    {name: "Email", img: "", handler: useHandlerEmail()},
    {name: "Twitter", img: "", handler: useHandlerTwitter()},
    {name: "Google", img: "", handler: useHandlerGoogle()},

  ];

  const onLogin = async (loginItem: LoginMethod) => {
    const params = {} as any;

    if (loginItem.name === "Email") {
      setShowModal(true);
      return;
    }
    const executeHandler = loginItem.handler;
    await executeHandler(params);

  };

  useEffect(() => {
    if (session) {
      router.push("/success");
    }
  }, [session]);


  return (
    <div style={ {display: "flex", width: "70%", flexWrap: "wrap", gap: "20px"} }>

      { showModal && <EmailModal show={ true } onCallback={ (show) => setShowModal(show) }/> }


      { loginMethod.map((loginItem) => {
        return <div
          key={ `login_item_${ loginItem.name }` }
          style={ {display: "flex", justifyContent: "center", alignItems: "center", height: "200px", width: "200px", backgroundColor: "black"} }>
          <button className="rounded-md w-20 h-10 bg-green-500 from-gray-50 cursor-pointer transform hover:bg-green-400 active:bg-green-600 text-white" onClick={ () => onLogin(loginItem) }>
            { loginItem.name }
          </button>

        </div>;
      }) }


    </div>
  );
};

export default LoginListView;

