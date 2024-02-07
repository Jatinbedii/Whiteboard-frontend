import { FcNext } from "react-icons/fc";
import Image from "next/image";
export default function NotFound() {
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
        <div className="flex justify-center mt-3 mb-5 p-2">
          <Image
            src={"/call.svg"}
            alt="person calling image"
            height={300}
            width={300}
          />
        </div>
        <div className="pt-4 text-3xl text-center flex justify-center text-white md:text-5xl font-bold">
          {" "}
          404 - PAGE NOT FOUND
        </div>

        <div
          className="w-full text-white
       text-center mt-[90px]  pt-10 font-medium text-sm"
        >
          <a href="/">
            <button className="text-white font-semibold bg-blue-950 rounded-xl pt-1 pb-1 pl-5 pr-5">
              <div className="flex flex-row">
                Go to Home{" "}
                <span className="pl-2 pt-1">
                  <FcNext />
                </span>
              </div>
            </button>
          </a>
        </div>
      </main>
    </div>
  );
}
