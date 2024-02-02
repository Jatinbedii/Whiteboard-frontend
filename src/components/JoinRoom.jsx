"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function JoinRoom() {
  const [room, setroom] = useState("");
  const [error, seterror] = useState("");
  const [name, setname] = useState("");
  const router = useRouter();
  function joinhandler() {
    seterror("");
    if (!room || !name) {
      seterror("Please Fill all the Fields");
      return;
    }
    router.push(`/room/${room}/${name}`);
  }
  return (
    <div className="max-w-fit p-5 bg-blue-700 rounded-md m-2">
      <div className="flex flex-col gap-3 ">
        <div className="text-white font-medium text-center md:text-2xl">
          Create a new Room or Join existing Room
        </div>
        <div className="w-full text-center">
          <input
            className="rounded max-w-[300px] text-center"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setroom(e.target.value)}
          />
        </div>
        <div className="w-full text-center">
          <input
            className="rounded max-w-[300px] text-center"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="bg-red-600 pl-2 text-white rounded-md">{error}</div>
        <div className="w-full text-center">
          <button
            onClick={joinhandler}
            className="text-white font-semibold bg-blue-950 w-[50px] rounded-lg"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
