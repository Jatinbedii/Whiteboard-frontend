import { FcNext } from "react-icons/fc";
import Image from "next/image";
import React from "react";
import Joinbylink from "@/components/joinbylink";
function page({ params }) {
  const room = params.roomid;
  return (
    <div>
      <main className="min-h-screen bg-blue-500">
        <div className="w-full bg-blue-500 flex justify-center">
          <div className="flex flex-col">
            <h1 className="text-black pt-2 text-3xl text-center md:text-6xl md:p-4">
              W H I T E B O A R D
            </h1>
            <div className="w-full text-center font-normal">
              <h2 className="text-black text-2xl p-2 md:text-4xl md:p-3">
                CHAT ROOM
              </h2>{" "}
            </div>
          </div>
        </div>

        {/* */}
        <div className="pt-20">
          <Joinbylink room={room} />
        </div>
        <div className="pt-10 flex justify-center mt-3 mb-5 p-2">
          <Image src={"../call.svg"} alt="logo" height={300} width={300} />
        </div>
      </main>
    </div>
  );
}

export default page;
