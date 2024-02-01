"use client";
import useDraw from "@/hooks/useDraw";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function page({ params }) {
  const name = params.name;
  const room = params.roomid;
  const { canvasRef, onMouseDown, clearBoard } = useDraw(drawline);
  const [chatinput, setchatinput] = useState();
  const [colorforline, setcolor] = useState("#000");
  const [socketstate, setsocketstate] = useState();
  const [chat, setchat] = useState([]);
  function sendmessagehandler(e) {
    e.preventDefault();

    socketstate.emit("message", { name, chatinput, room });
  }
  function clearhandler() {
    clearBoard();
    socketstate.emit("clear", { room, name });
  }
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND);
    setsocketstate(socket);
    socket.emit("joinroom", { name, room });
    socket.on("message", ({ name, message }) => {
      setchat((prevchat) => [...prevchat, { by: name, message: message }]);
    });
    socket.on("userjoined", (props) => {
      setchat((prevchat) => [
        ...prevchat,
        { message: `${props.name} Joined the room`, by: "admin" },
      ]);
      const data = canvasRef.current?.toDataURL();
      socket.emit("canvasdata", { socketid: props.socketid, data });
    });

    socket.on("canvasdata", ({ data }) => {
      const img = new Image();
      img.src = data;
      img.onload = () => {
        canvasRef.current?.getContext("2d").drawImage(img, 0, 0);
      };
    });
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
      socket.off("clear");
      socket.off("canvasdata");
      socket.off("userjoined");
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

      <div>
        {chat.map((data) => {
          return <div>{data.by + ":" + data.message}</div>;
        })}
      </div>
      <div>
        <input
          value={chatinput}
          onChange={(e) => setchatinput(e.target.value)}
        />
        <button onClick={sendmessagehandler}>Send</button>
      </div>
    </div>
  );
}

export default page;
