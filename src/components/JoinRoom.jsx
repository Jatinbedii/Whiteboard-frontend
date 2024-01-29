"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function JoinRoom() {
  const [room, setroom] = useState("");
  const router = useRouter();
  function joinhandler() {
    router.push(`/room/${room}`);
  }
  return (
    <div>
      <div>
        <input value={room} onChange={(e) => setroom(e.target.value)} />
        <button onClick={joinhandler}>Join</button>
      </div>
    </div>
  );
}

export default JoinRoom;
