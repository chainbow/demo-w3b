import { NextPage } from "next";
import useHandlerWallet3 from "../../hooks/login/useHandlerWallet3";
import useHandlerMetamask from "../../hooks/login/useHandlerMetamask";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import useHandlerTwitter from "../../hooks/login/useHandlerTwitter";
import useHandlerGoogle from "../../hooks/login/useHandlerGoogle";

interface LoginMethod {
  name: string,
  img: string,
  handler: any
}


const LoginListView: NextPage = () => {

  const loginMethod: LoginMethod[] = [
    {name: "Wallet3", img: "", handler: useHandlerWallet3()},
    {name: "Metamask", img: "", handler: useHandlerMetamask()},
    {name: "Email", img: "", handler: useHandlerEmail()},
    {name: "Twitter", img: "", handler: useHandlerTwitter()},
    {name: "Google", img: "", handler: useHandlerGoogle()},

  ];

  const onLogin = (loginItem: LoginMethod) => {
    const result = loginItem.handler;
    console.info("点击了", result);
  };


  return (
    <div style={ {display: "flex", width: "70%", flexWrap: "wrap", gap: "20px"} }>


      { loginMethod.map((loginItem) => {
        return <div style={ {display: "flex", justifyContent: "center", alignItems: "center", height: "200px", width: "200px", backgroundColor: "black"} }>
          <button className="rounded-md w-20 h-10 bg-green-500 from-gray-50 cursor-pointer transform hover:-translate-y-1 hover:scale-110 text-white" onClick={ () => onLogin(loginItem) }>
            { loginItem.name }
          </button>

        </div>;
      }) }


    </div>
  );
};

export default LoginListView;

