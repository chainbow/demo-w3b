import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useEffect } from "react";

const Success: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const account = session?.user?.name ?? session?.user?.email;
  const address = api.address.address.useQuery({ text: account ?? "" });
  const onLogout = async () => {
    if (session) {
      await signOut();
    } else {
      await router.push("/");
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  console.log(session);

  return (
    <>
      <main
        style={{ position: "relative" }}
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"
      >
        <button
          style={{ position: "absolute", right: "10%", top: "40px" }}
          className="h-10 w-20 transform cursor-pointer rounded-md bg-green-500 from-gray-50 text-white hover:-translate-y-1"
          onClick={() => onLogout()}
        >
          退出
        </button>
        <div className="container flex  flex-col items-center justify-center gap-12 px-4 py-16 ">
          <span className=" font-extrabold tracking-tight text-white sm:text-[3rem]">
            Welcome <span className="text-1">{account}</span>
          </span>

          <span className="font-extrabold text-white">
            Address{" "}
            <span className="text-1">{address?.data?.address ?? ""}</span>
          </span>
        </div>
      </main>
    </>
  );
};

export default Success;
