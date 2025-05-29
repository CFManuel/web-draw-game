import React, { useRef, useState } from "react";

export default function DrawPhase({
  players,
  currentUser,
  drawings,
  setDrawings,
  setPhase,
}) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [done, setDone] = useState(false);

  const startDraw = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL();
    setDrawings((prev) => [...prev, { player: currentUser, dataUrl }]);
    setDone(true);
    // Checar si todos terminaron
    if (drawings.length + 1 === players.length) setPhase("classify");
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
  };

  return (
    <div>
      <h2>Dibuja algo creativo</h2>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ border: "1px solid black" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
      />
      <div>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
        <button onClick={clearCanvas}>Borrar</button>
        <button onClick={handleSave} disabled={done}>
          Guardar dibujo
        </button>
      </div>
      {done && <div>¡Esperando a los demás jugadores!</div>}
    </div>
  );
}