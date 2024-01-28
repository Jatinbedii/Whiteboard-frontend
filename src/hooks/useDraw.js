"use client";
import { useEffect, useRef, useState } from "react";
export const useDraw = (drawline) => {
  const [mousedown, setmousedown] = useState(false);
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const onMouseDown = () => {
    setmousedown(true);
  };
  const mouseUpFunction = () => {
    setmousedown(false);
    prevPoint.current = null;
  };

  function clearBoard() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  function handlerfunc(e) {
    if (!mousedown) {
      return;
    }
    const rectangle = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rectangle.left;
    const y = e.clientY - rectangle.top;

    const context = canvasRef.current?.getContext("2d");
    if (!x || !y || !context) {
      return;
    }

    drawline(context, { x, y }, prevPoint.current);
    prevPoint.current = { x, y };
  }
  useEffect(() => {
    canvasRef.current?.addEventListener("mousemove", handlerfunc);
    window.addEventListener("mouseup", mouseUpFunction);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handlerfunc);
      window.removeEventListener("mouseup", mouseUpFunction);
    };
  }, [drawline]);

  return { canvasRef, onMouseDown, clearBoard };
};

export default useDraw;
