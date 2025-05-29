import React, { useRef, useState } from "react";

const COLORS = ["black", "red", "blue", "green", "orange", "purple"];

function drawLine(ctx, x0, y0, x1, y1, color, width) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export default function DrawingBoard({ onSave }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lines, setLines] = useState([]);
  const [last, setLast] = useState(null);
  const [brushSize, setBrushSize] = useState(3);

  function handleMouseDown(e) {
    setDrawing(true);
    setLast([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
  }
  function handleMouseMove(e) {
    if (!drawing) return;
    const [x0, y0] = last;
    const x1 = e.nativeEvent.offsetX;
    const y1 = e.nativeEvent.offsetY;
    const newLine = { x0, y0, x1, y1, color, width: brushSize };
    setLines([...lines, newLine]);
    setLast([x1, y1]);
    drawLine(canvasRef.current.getContext("2d"), x0, y0, x1, y1, color, brushSize);
  }
  function handleMouseUp() {
    setDrawing(false);
    setLast(null);
  }
  function handleClear() {
    setLines([]);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 400, 400);
  }
  function handleSave() {
    onSave(canvasRef.current.toDataURL());
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>Dibuja algo!</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{border: "1px solid #000", background: "#fff"}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div>
        Color: {COLORS.map(c => (
          <button key={c} style={{background: c, color: c === "black" ? "#fff" : "#000", margin: 2, border: color === c ? "2px solid #000" : "1px solid #aaa"}}
            onClick={() => setColor(c)}>
            {c}
          </button>
        ))}
        <span> Grosor: <input type="range" min="1" max="10" value={brushSize} onChange={e => setBrushSize(+e.target.value)} /></span>
        <button onClick={handleClear}>Borrar</button>
      </div>
      <button onClick={handleSave} style={{marginTop: 10}}>Guardar dibujo</button>
    </div>
  );
}