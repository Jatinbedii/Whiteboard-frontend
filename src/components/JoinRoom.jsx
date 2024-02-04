"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
function JoinRoom() {
  const [loading, setloading] = useState(false);
  const [room, setroom] = useState("");
  const [error, seterror] = useState("");
  const [name, setname] = useState("");
  const router = useRouter();
  function joinhandler() {
    setloading(true);
    seterror("");
    if (!room || !name) {
      seterror("Please Fill all the Fields");
      setloading(false);
      return;
    }

    router.push(`/room/${room}/${name}`);
  }
  return (
    <div className="max-w-fit p-5 bg-blue-700 rounded-md m-2">
      <div className="flex flex-col gap-3 w-full">
        <div className="text-white font-medium text-center md:text-2xl">
          Create a new Room or Join existing Room
        </div>
        <div className="w-full text-center">
          <input
            className="rounded-2xl max-w-[300px] text-center"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setroom(e.target.value)}
          />
        </div>
        <div className="w-full text-center">
          <input
            className="rounded-2xl max-w-[300px] text-center"
            placeholder="Enter Your Name"
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
              onClick={joinhandler}
              className="text-white font-semibold bg-blue-950 rounded-xl pt-1 pb-1 pl-5 pr-5"
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
