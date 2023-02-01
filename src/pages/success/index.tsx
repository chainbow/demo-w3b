import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Success: NextPage = () => {
  const {data: session} = useSession();
  const router = useRouter();
  const onLogout = async () => {
    await router.push("/");
    await signOut();
  };
  return (
    <>
      <main
        style={ {position: "relative"} }
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <button
          style={ {position: "absolute", right: "10%", top: "40px"} }
          className="rounded-md w-20 h-10 bg-green-500 from-gray-50 cursor-pointer transform hover:-translate-y-1 text-white" onClick={ () => onLogout() }>
          退出
        </button>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome <span className="text-[hsl(280,100%,70%)]">{ session?.user?.name }</span>
          </h1>
        </div>
      </main>
    </>
  );
};

export default Success;
