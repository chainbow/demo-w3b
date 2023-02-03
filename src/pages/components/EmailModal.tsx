import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { NextPage } from "next";
import useHandlerEmail from "../../hooks/login/useHandlerEmail";
import axios from "axios";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { ethers } from "ethers";

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


export interface IModal {
  show?: boolean;
  onCallback: (show: boolean) => void;
}

export const EmailModal: NextPage<IModal> = ({show = false, onCallback}) => {
  const [open, setOpen] = useState(true);
  const [showCodeMsg, setShowCodeMsg] = useState("获取验证码");
  const [currentEmail, setCurrentEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [canSend, setCanSend] = useState(true);
  let timeCount = 10;
  let timer;

  const checkEmail = (email: string) => {
    const reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    const result = reg.test(email);
    if (!result) {
      setErrorMsg("无效邮件地址");
    }
    return result;
  };


  const onSendEmailCode = async () => {

    // const HDNode = ethers.utils.HDNode;
    // const mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
    // const node: any = HDNode.fromMnemonic(mnemonic);
    // const standardEthereum = node.derivePath("m/44'/60'/0'/0/0");
    // console.info("standardEthereum", standardEthereum);
    //
    // // Get the extended private key
    // const xpriv = node.extendedKey;
    // console.info("xpriv", xpriv);
    //
    // // Get the extended public key
    // const xpub = node.neuter().extnededKey;
    // console.info("xpub", xpub);


    // const bip32 = ethers.utils.HDNode.fromExtendedKey("xpub6C44gXqtPeBkher6yeZBhn5r36U5qh5z4W9GgFAQxZXVbsYiquW9JtVLHMurBfNR86M1A9nWSyMHtpjLHKehyCzd73vXE52YxTsCC9UejUk");
    //
    // const nextNode = bip32.derivePath(`0/1`);
    // console.info("node", nextNode);

    const isValidEmail = checkEmail(currentEmail);
    if (!isValidEmail) return;
    setErrorMsg("");
    if (currentEmail) {
      setCanSend(false);
      setShowCodeMsg("已发送");
      const executeHandler = useHandlerEmail();
      await executeHandler(currentEmail.trim());
      timer = setInterval(() => {
        timeCount--;
        if (timeCount <= 0) {
          setShowCodeMsg("重发");
          clearInterval(timer);
          setCanSend(true);
          return;
        }
        setShowCodeMsg(`${ timeCount } s`);
      }, 1000);
    } else {
      setErrorMsg("请输入邮件地址");
    }
  };


  const onLoginEmail = async () => {
    if (currentEmail && verifyCode) {
      try {
        await axios.get("/api/auth/callback/email", {params: {token: verifyCode.trim(), email: currentEmail.trim()}});
        setOpen(false);
        onCallback(false);
        window.location.reload();
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    }
  };

  const cancelButtonRef = useRef(null);

  const onDismiss = () => {
    setOpen(false);
    onCallback(false);
  };

  return (
    <Transition.Root show={ open } as={ Fragment }>
      <Dialog as="div" className="relative z-10" initialFocus={ cancelButtonRef } onClose={ setOpen }>
        <Transition.Child
          as={ Fragment }
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={ Fragment }
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8  sm:max-w-lg">
                <div className="justify-center  text-center pt-3 text-blue">
                  <span style={ {color: "red"} }>{ errorMsg }</span>
                </div>

                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">

                  <div className="sm:flex sm:items-start justify-center">

                    <div className="mx-auto flex  flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Avatar variant="square" alt="Remy Sharp" src={ `/mail.png` } sx={ {width: 20, height: 20} }/>
                    </div>

                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        登陆
                      </Dialog.Title>

                      <div className="p-3 gap-1 flex-row" style={ {gap: "10px"} }>


                        <InputContainer className="box border-b mb-2 pb-2" isShowText={ false }>
                          <input className="input" placeholder="邮件" onInput={ (event) => setCurrentEmail(event.currentTarget.value) }/>
                        </InputContainer>


                        <InputContainer className="box" isShowText={ true }>
                          <input className="input" placeholder="请输入验证码" onInput={ (event) => setVerifyCode(event.currentTarget.value) }/>
                          <span className="text focus:ring-2 motion-safe:hover:scale-110" onClick={ () => canSend ? onSendEmailCode() : null }>{ showCodeMsg }</span>
                        </InputContainer>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-300  focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ () => onLoginEmail() }
                  >
                    登陆
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ () => onDismiss() }
                    ref={ cancelButtonRef }
                  >
                    取消
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
