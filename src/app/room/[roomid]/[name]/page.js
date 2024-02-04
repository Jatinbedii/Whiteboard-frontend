"use client";
import useDraw from "@/hooks/useDraw";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
function page({ params }) {
  const { toast } = useToast();
  const chatContainerRef = useRef(null);
  const name = params.name;
  const room = params.roomid;
  const { canvasRef, onMouseDown, clearBoard } = useDraw(drawline);
  const [chatinput, setchatinput] = useState();
  const [colorforline, setcolor] = useState("#000");
  const [socketstate, setsocketstate] = useState();
  const [chat, setchat] = useState([]);
  function sendmessagehandler(e) {
    e.preventDefault();
    setchat((prevchat) => [...prevchat, { message: chatinput, by: "You" }]);
    socketstate.emit("message", { name, chatinput, room });
    setchatinput("");
  }
  function clearhandler() {
    clearBoard();
    socketstate.emit("clear", { room, name });
    setchat((prevchat) => [
      ...prevchat,
      { message: "You cleared the Board", by: "" },
    ]);
  }
  useEffect(() => {
    toast({
      title: "Use a mouse",
      description:
        "Drawing can be done through PC only. Not touch screen Phones.",
    });
    const socket = io(process.env.NEXT_PUBLIC_BACKEND, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setsocketstate(socket);
    socket.emit("joinroom", { name, room });
    socket.on("message", ({ name, message }) => {
      setchat((prevchat) => [...prevchat, { by: name, message: message }]);
    });
    socket.on("userjoined", (props) => {
      setchat((prevchat) => [
        ...prevchat,
        { message: `${props.name} Joined the room`, by: "" },
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
      setchat((prevchat) => [
        ...prevchat,
        { message: `${name} cleared the Board`, by: "" },
      ]);
    });

    return () => {
      socket.off("drawline");
      socket.off("clear");
      socket.off("canvasdata");
      socket.off("userjoined");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever the component updates
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chat]);

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
    <div className="min-h-screen bg-blue-500">
      <div className="w-full text-center bg-blue-500 text-3xl md:text-4xl">
        ROOM - {room}
      </div>
      <div className="w-full text-center bg-blue-500 text-1xl md:text-2xl">
        NAME - {name}
      </div>
      <div className="w-full flex justify-around bg-blue-500 pt-3">
        <div className="overflow-auto max-w-full max-h-screen">
          <canvas
            ref={canvasRef}
            height={500}
            width={500}
            className="bg-white border border-black rounded-lg"
            onMouseDown={onMouseDown}
          />
        </div>
      </div>
      <div className="w-full flex justify-center bg-blue-500">
        <input
          className="m-2"
          type="color"
          id="colorpicker"
          onChange={(e) => setcolor(e.target.value)}
        />
        <button
          className="m-2 bg-blue-950 text-white rounded-md p-1"
          onClick={clearhandler}
        >
          Clear
        </button>
      </div>
      <div className="w-full flex justify-center bg-blue-500">
        <div className="bg-blue-700 rounded-lg p-1">
          <div className="max-h-[200px] overflow-y-auto" ref={chatContainerRef}>
            {chat.map((data) => {
              if (data.by) {
                return (
                  <div className="text-white">
                    <span className="text-white font-bold">
                      {data.by + " : "}
                    </span>
                    {data.message}
                  </div>
                );
              } else {
                return (
                  <div className="w-full bg-blue-900 text-white rounded-md pl-1 mt-1 mb-1">
                    {data.message}
                  </div>
                );
              }
            })}
          </div>
          <div>
            <input
              value={chatinput}
              onChange={(e) => setchatinput(e.target.value)}
              className="rounded-lg m-1 p-1"
            />
            <button
              className="p-1 m-1 text-white bg-blue-950 rounded-lg"
              onClick={sendmessagehandler}
            >
              Send
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default page;
