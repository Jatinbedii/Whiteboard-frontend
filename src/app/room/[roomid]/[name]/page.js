"use client";
import { ClipLoader } from "react-spinners";
import { LuClipboardPaste } from "react-icons/lu";
import { RiRadioButtonLine } from "react-icons/ri";
import useDraw from "@/hooks/useDraw";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { IoHomeSharp } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { FaEraser } from "react-icons/fa";
import { MdSend } from "react-icons/md";
function page({ params }) {
  const { toast } = useToast();
  const chatContainerRef = useRef(null);
  const name = params.name;
  const room = params.roomid;
  const [connected, setconnected] = useState(false);
  const { canvasRef, onMouseDown, clearBoard } = useDraw(drawline);
  const [chatinput, setchatinput] = useState();
  const [colorforline, setcolor] = useState("#000");
  const [socketstate, setsocketstate] = useState();
  const [chat, setchat] = useState([]);
  const [count, setcount] = useState(1);
  async function copytoclipboard() {
    await navigator.clipboard.writeText(
      `${window.location.host}/joinroom/${room}`
    );
    toast({
      title: "Invitation Link Copied",
      description:
        "Invitation Link Added to ClipBoard. Share it to invite new users!",
    });
  }
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
    socket.on("usercount", ({ count }) => {
      const users = count;
      setcount(users);
      setconnected(true);
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
    <>
      <Toaster />
      <div className="min-h-screen bg-blue-500">
        <div className="bg-blue-950">
          <h1 className="text-white pt-2 text-3xl text-center md:text-4xl md:pt-4 pb-1">
            W H I T E B O A R D
          </h1>
        </div>
        <div className="w-full min-h-[60px] bg-blue-950 rounded-b-full">
          <div className="w-full flex justify-center">
            <div className="bg-blue-500 flex flex-row gap-2 pr-5 pl-5 rounded-full mb-2">
              <div className="bg-blue-500 text-black mt-2 font-semibold rounded-full text-center p-1">
                <IoHomeSharp />
                {room}
              </div>
              <div className="bg-blue-500 text-black mt-2 rounded-full text-center p-1 font-semibold">
                <IoPersonSharp />
                {name}
              </div>
              <div className="bg-blue-500 text-black mt-2 font-semibold rounded-full text-center p-1">
                <div className="flex flex-row">
                  <RiRadioButtonLine color="#90EE90" />
                </div>

                {count}
              </div>

              <div
                onClick={copytoclipboard}
                className="bg-blue-500 text-black mt-2 font-semibold rounded-full text-center p-1"
              >
                <div className="flex flex-row">
                  <LuClipboardPaste />
                </div>
                Invite
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-around bg-blue-500 pt-3">
          {connected ? (
            <div className="overflow-auto max-w-full max-h-screen p-1 bg-black rounded-lg">
              <canvas
                ref={canvasRef}
                height={500}
                width={500}
                className="bg-white border border-black rounded-lg"
                onMouseDown={onMouseDown}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-5 pb-5">
              <ClipLoader color={"#ffffff"} size={300} />
              <div className=" text-white text-center font-bold">
                Joining Room
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-center bg-blue-500">
          <input
            className="m-2 mt-3 border-2 border-gray-700"
            type="color"
            id="colorpicker"
            onChange={(e) => setcolor(e.target.value)}
          />
          <button
            className="m-2 bg-red-600 border-black border-2  text-white rounded-md p-1 flex flex-row gap-2 hover:bg-red-900"
            onClick={clearhandler}
          >
            <FaEraser /> Clear
          </button>
        </div>
        <div className="w-full flex justify-center ">
          <div className="bg-blue-700 rounded-lg p-1">
            <div
              className="max-h-[200px] min-h-[200px] overflow-y-auto"
              ref={chatContainerRef}
            >
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
                className="p-2 m-1 text-white bg-blue-950 rounded-md "
                onClick={sendmessagehandler}
              >
                <MdSend />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[10px] bg-blue-500"></div>
      </div>
    </>
  );
}

export default page;
