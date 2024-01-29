"use client";
import useDraw from "@/hooks/useDraw";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function page() {
  const name = "name";
  const room = "room";
  const { canvasRef, onMouseDown, clearBoard } = useDraw(drawline);
  const [colorforline, setcolor] = useState("#000");
  const [socketstate, setsocketstate] = useState();
  function clearhandler() {
    clearBoard();
    socketstate.emit("clear", { room, name });
  }
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setsocketstate(socket);
    socket.emit("joinroom", { name, room });

    socket.on("drawline", ({ prevpoint, currentpoint, color }) => {
      const ctx = canvasRef.current?.getContext("2d");

      if (!ctx) {
        return;
      }
      const linewidth = 3;

      let startpoint = prevpoint ?? currentpoint;

      ctx.beginPath();

      ctx.lineWidth = linewidth;

      ctx.strokeStyle = color;

      ctx.moveTo(startpoint.x, startpoint.y);

      ctx.lineTo(currentpoint.x, currentpoint.y);

      ctx.stroke();

      ctx.fillStyle = color;

      ctx.beginPath();

      ctx.arc(startpoint.x, startpoint.y, 2, 0, 2 * Math.PI);

      ctx.fill();
    });

    socket.on("clear", ({ name }) => {
      clearBoard();
    });

    return () => {
      socket.off("drawline");
    };
  }, []);

  function drawline(ctx, currentpoint, prevpoint) {
    const color = colorforline;
    const linewidth = 3;

    let startpoint = prevpoint ?? currentpoint;

    ctx.beginPath();

    ctx.lineWidth = linewidth;

    ctx.strokeStyle = color;

    ctx.moveTo(startpoint.x, startpoint.y);

    ctx.lineTo(currentpoint.x, currentpoint.y);

    ctx.stroke();

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(startpoint.x, startpoint.y, 2, 0, 2 * Math.PI);

    ctx.fill();

    socketstate.emit("drawline", { prevpoint, currentpoint, color, room });
  }

  return (
    <div>
      <div className="w-full flex justify-around">
        <canvas
          ref={canvasRef}
          height={500}
          width={500}
          className=" border border-black rounded-lg"
          onMouseDown={onMouseDown}
        />
      </div>
      <input
        type="color"
        id="colorpicker"
        onChange={(e) => setcolor(e.target.value)}
      />
      <button onClick={clearhandler}>Clear</button>
    </div>
  );
}

export default page;
