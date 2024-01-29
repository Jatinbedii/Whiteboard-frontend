"use client";
import useDraw from "@/hooks/useDraw";
import { useState } from "react";

function page() {
  const { canvasRef, onMouseDown, clearBoard } = useDraw(drawline);
  const [colorforline, setcolor] = useState("#000");
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
      <button onClick={clearBoard}>Clear</button>
    </div>
  );
}

export default page;
