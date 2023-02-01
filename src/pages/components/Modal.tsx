import { NextPage } from "next";
import { ReactNode, useState } from "react";
import styled from "styled-components";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import axios from "axios";


export const InputContainer = styled.div<{ isShowText: boolean }>`

  .box {
    background-color: red;
    border-radius: 2px;
    border-style: solid;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    width: 250px;
  }

  .input {
    border: none;
    outline: none;
    width: ${ ({isShowText}) => isShowText ? " 150px" : "100%" };
  }

  .text {
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: ${ ({isShowText}) => isShowText ? "inline-block" : "none" };
    border-left: 1px solid #a1a2a3;
    height: 15px;
    width: 100px;
    line-height: 15px;
    padding-left: 15px;
    font-size: 12px;
    color: #606266
  }
`;


interface LoginMethod {
  name: string,
  img: string,
  handler: any
}

interface IModal {
  show?: boolean;
  onCallback: (show: boolean) => void;
}

const EmailModal: NextPage<IModal> = ({show = false, onCallback}) => {
  const [showModal, setShowModal] = useState(show);
  const [showCodeMsg, setShowCodeMsg] = useState("获取验证码");
  const [currentEmail, setCurrentEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");


  const onSendEmailCode = async () => {
    if (currentEmail) {
      setShowCodeMsg("已发送");
      const executeHandler = useHandlerEmail();
      await executeHandler(currentEmail.trim());
    }
  };

  const onDismiss = () => {
    setShowModal(false);
    onCallback(false);
  };

  const onLoginEmail = async () => {
    if (currentEmail && verifyCode) {
      await axios.get("/api/auth/callback/email", {params: {token: verifyCode.trim(), email: currentEmail.trim()}});
      setShowModal(false);
      onCallback(false);
    }

  };

  return (
    <>
      { showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">


            <div className="relative w-auto my-6 mx-auto max-w-3xl">

              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                <div style={ {position: "absolute", top: "0%", right: "3%", fontSize: "20px", padding: "10px"} }>
                  <span className="transform motion-safe:hover:scale-110 cursor-pointer" onClick={ () => onDismiss() }> x</span>
                </div>
                <div className="flex justify-center  p-5 border-b border-solid border-gray-300 rounded-t ">
                  <span className="text-1xl ">登陆</span>
                </div>
                <div className="p-3 gap-1 flex-row" style={ {gap: "10px"} }>


                  <InputContainer className="box border-b mb-2 pb-2" isShowText={ false }>
                    <input className="input" placeholder="邮件" onInput={ (event) => setCurrentEmail(event.currentTarget.value) }/>
                  </InputContainer>


                  <InputContainer className="box" isShowText={ true }>
                    <input className="input" placeholder="请输入验证码" onInput={ (event) => setVerifyCode(event.currentTarget.value) }/>
                    <span className="text focus:ring-2 motion-safe:hover:scale-110" onClick={ () => onSendEmailCode() }>{ showCodeMsg }</span>
                  </InputContainer>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                  <button
                    className="text-white bg-blue-400  font-bold uppercase text-md w-full h-10 rounded shadow hover:bg-blue-300"
                    type="button"
                    onClick={ () => onLoginEmail() }
                  >
                    登陆
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null }
    </>
  );
};

export default EmailModal;

