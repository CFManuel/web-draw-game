import React, { useState } from "react";

// Simple drag & drop, not production-level but works for demo
export default function DragDropStage({ users, myId, drawings, onSave }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedName, setSelectedName] = useState(null);
  const [text, setText] = useState("");

  // Only show drawings not made by me
  const otherUsers = users.filter(u => u.socketId !== myId);
  const currentDrawingOwner = otherUsers[currentIndex];
  const total = otherUsers.length;

  if (!currentDrawingOwner) return <div>No hay dibujos de otros jugadores.</div>;

  return (
    <div style={{textAlign: "center"}}>
      <h3>Asigna un nombre y escribe algo sobre el dibujo</h3>
      <div style={{display: "flex", justifyContent: "center", gap: 8}}>
        {users.map(u => u.socketId !== currentDrawingOwner.socketId && (
          <div
            key={u.socketId}
            draggable
            onDragStart={() => setSelectedName(u.socketId)}
            style={{padding: 8, border: "1px solid #aaa", background: "#eee", cursor: "grab"}}
          >
            {u.nickname}
          </div>
        ))}
      </div>
      <div style={{margin: "24px 0"}}>
        <img src={drawings[currentDrawingOwner.socketId]} alt="dibujo" style={{width: 300, height: 300, border: "1px solid #000"}} />
      </div>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={() => {}} // visual feedback only
        style={{
          border: "2px dashed #333",
          minHeight: 40,
          marginBottom: 16,
          background: selectedName ? "#cfc" : "#fff"
        }}
      >
        {selectedName ? "Nombre arrastrado" : "Arrastra un nombre aquí"}
      </div>
      <input placeholder="Comentario sobre el dibujo" value={text} onChange={e => setText(e.target.value)} />
      <div>
        <button
          onClick={() => {
            if (!selectedName || !text) return;
            onSave(currentDrawingOwner.socketId, selectedName, text);
            setSelectedName(null);
            setText("");
            if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
          }}
        >
          {currentIndex < total - 1 ? "Siguiente" : "Finalizar"}
        </button>
      </div>
    </div>
  );
}