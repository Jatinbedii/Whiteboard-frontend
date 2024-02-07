"use client";
import { FcNext } from "react-icons/fc";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

function Joinbylink({ room }) {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [name, setname] = useState("");
  function joinroom(e) {
    e.preventDefault();
    setloading(true);
    seterror("");

    if (!name) {
      setloading(false);
      seterror("Enter name before Joining");
      return;
    }
    setloading(false);
    router.push(`/room/${room}/${name}`);
  }
  return (
    <div className="flex justify-center">
      <div className="max-w-fit p-5 bg-blue-700 rounded-md m-2">
        <div className="flex flex-col gap-3 w-full">
          <div className="text-white font-medium text-center md:text-2xl">
            You are invited to <span>{room}</span>
          </div>
          <div className="w-full text-center">
            <input
              className="rounded-2xl max-w-[300px] text-center"
              placeholder="Enter Room Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>

          <div className="w-full">
            {error ? (
              <div className="text-red-900 p-1 m-1 w-fit bg-red-400 rounded-md mx-auto">
                {error}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="w-full text-center">
            {loading ? (
              <div>
                <ClipLoader
                  color={"#ffffff"}
                  loading={loading}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <button
                onClick={(e) => {
                  joinroom(e);
                }}
                className="text-white font-semibold bg-blue-950 rounded-xl pt-1 pb-1 pl-5 pr-5"
              >
                <FcNext />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Joinbylink;
