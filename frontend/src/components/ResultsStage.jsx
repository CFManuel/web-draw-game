import React, { useState } from "react";

export default function ResultsStage({ users, drawings, dragDropData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const drawingOwners = Object.keys(drawings);
  const ownerId = drawingOwners[currentIndex];
  const owner = users.find(u => u.socketId === ownerId);

  return (
    <div style={{textAlign: "center"}}>
      <h2>Resultados</h2>
      <h3>Dibujo de: {owner?.nickname}</h3>
      <img src={drawings[ownerId]} alt="dibujo" style={{width: 300, height: 300, border: "1px solid #000"}} />
      <div>
        <h4>Comentarios:</h4>
        <ul>
          {(dragDropData[ownerId] || []).map((entry, i) => {
            const assignedName = users.find(u => u.socketId === entry.assignedNameId)?.nickname || "??";
            return (
              <li key={i}>
                <b>Nombre asignado:</b> {assignedName} <br />
                <b>Comentario:</b> {entry.assignedText}
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={() => setCurrentIndex((currentIndex + 1) % drawingOwners.length)}>Siguiente dibujo</button>
    </div>
  );
}