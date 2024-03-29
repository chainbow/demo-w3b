import React, { useEffect, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import LogoVPN from "../../../../public/assets/Logo.svg";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import useLoginMethod from "../../../hooks/login/useLoginMethod";
import { useAccount, useDisconnect } from "wagmi";

interface IHeader {
  loginCallback: (open: boolean) => void;
}

export const Header: NextPage<IHeader> = ({ loginCallback }) => {
  const [isLogin, setIsLogin] = useState(false);
  const { data: session } = useSession();
  console.log("🚀 ~ file: Header.tsx:16 ~ session:", session);
  const [activeLink, setActiveLink] = useState("");
  const [scrollActive, setScrollActive] = useState(false);
  const { isAutoLogin, loginByWallet3, authSign } = useLoginMethod();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  useEffect(() => {
    setIsLogin(!!session);
  }, [session]);

  const onLogin = async () => {
    if (isLogin) {
      await logout();
    } else {
      await login();
    }
  };

  const login = async () => {
    const isAuto = isAutoLogin();
    if (isAuto) {
      localStorage.removeItem("isManualLogout");
      await loginByWallet3();
    } else {
      loginCallback(true);
    }
  };

  const logout = async () => {
    localStorage.setItem("isManualLogout", "true");
    await signOut();
    await disconnect();
  };

  // 自动登陆
  useEffect(() => {
    const isManualLogoutStr = localStorage.getItem("isManualLogout");
    const isAuto = isAutoLogin();
    const isManualLogout = JSON.parse(isManualLogoutStr ?? "false");
    if (isManualLogout) return;
    if (isAuto && !session && !isConnected && !address) loginByWallet3();
    if (isAuto && !session && isConnected && address) authSign();
  }, [address, isConnected, session]);

  // 切换账号
  useEffect(() => {
    const walletAddress = session?.user?.walletAddress;
    if (address && isConnected && walletAddress && walletAddress != address)
      authSign();
  }, [address, isConnected, session]);

  const truncateHash = (address: string, startLength = 4, endLength = 4) => {
    if (!address) return "";
    return `${address.substring(0, startLength)}...${address.substring(
      address.length - endLength
    )}`;
  };

  return (
    <>
      <header
        className={
          "fixed top-0 z-30  w-full bg-white-500 transition-all " +
          (scrollActive ? " pt-0 shadow-md" : " pt-4")
        }
      >
        <nav className="mx-auto grid max-w-screen-xl grid-flow-col px-6 py-3 sm:px-8 sm:py-4 lg:px-16">
          <div className="col-start-1 col-end-2 flex items-center">
            <LogoVPN className="h-8 w-auto" />
          </div>
          <ul className="col-start-4 col-end-8 hidden items-center text-black-500  lg:flex">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "animation-hover relative mx-2 inline-block cursor-pointer px-4 py-2" +
                (activeLink === "about"
                  ? " animation-active text-orange-500 "
                  : " a text-black-500 hover:text-orange-500")
              }
            >
              About
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="feature"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("feature");
              }}
              className={
                "animation-hover relative mx-2 inline-block cursor-pointer px-4 py-2" +
                (activeLink === "feature"
                  ? " animation-active text-orange-500 "
                  : " text-black-500 hover:text-orange-500 ")
              }
            >
              Feature
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("pricing");
              }}
              className={
                "animation-hover relative mx-2 inline-block cursor-pointer px-4 py-2" +
                (activeLink === "pricing"
                  ? " animation-active text-orange-500 "
                  : " text-black-500 hover:text-orange-500 ")
              }
            >
              Pricing
            </LinkScroll>
          </ul>
          <div className="col-start-10 col-end-12 flex items-center justify-end font-medium">
            <button
              onClick={() => onLogin()}
              className="rounded-l-full rounded-r-full border border-orange-500 bg-white-500 py-2 px-5 font-medium capitalize tracking-wide text-orange-500 outline-none transition-all hover:bg-orange-500 hover:text-white-500 hover:shadow-orange sm:px-8 "
            >
              {isLogin
                ? truncateHash(
                    session?.user?.id ??
                      session?.user?.walletAddress ??
                      address ??
                      "Disconnect",
                    4,
                    4
                  )
                : "Login"}
            </button>
          </div>
        </nav>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-20 px-4 shadow-t sm:px-8 lg:hidden ">
        <div className="bg-white-500 sm:px-3">
          <ul className="flex w-full items-center justify-between text-black-500">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "mx-1 flex flex-col items-center border-t-2 px-3 py-2 text-xs transition-all sm:mx-2 sm:px-4 " +
                (activeLink === "about"
                  ? "  border-orange-500 text-orange-500"
                  : " border-transparent")
              }
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="feature"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("feature");
              }}
              className={
                "mx-1 flex flex-col items-center border-t-2 px-3 py-2 text-xs transition-all sm:mx-2 sm:px-4 " +
                (activeLink === "feature"
                  ? "  border-orange-500 text-orange-500"
                  : " border-transparent ")
              }
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Feature
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("pricing");
              }}
              className={
                "mx-1 flex flex-col items-center border-t-2 px-3 py-2 text-xs transition-all sm:mx-2 sm:px-4 " +
                (activeLink === "pricing"
                  ? "  border-orange-500 text-orange-500"
                  : " border-transparent ")
              }
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pricing
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("testimoni");
              }}
              className={
                "mx-1 flex flex-col items-center border-t-2 px-3 py-2 text-xs transition-all sm:mx-2 sm:px-4 " +
                (activeLink === "testimoni"
                  ? "  border-orange-500 text-orange-500"
                  : " border-transparent ")
              }
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Testimonial
            </LinkScroll>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
