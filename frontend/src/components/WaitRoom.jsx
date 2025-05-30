import React from "react";

export default function WaitRoom({ players, currentUser, setPhase, roomCode }) {
  const isOwner = players[0]?.name === currentUser;

  return (
    <div>
      <h2>Esperando jugadores...</h2>
      <div><b>Código de sala:</b> {roomCode}</div>
      <ul>
        {players.map((p, i) => (
          <li key={i}>
            {p.name} {p.isOwner ? "(Creador)" : ""}
          </li>
        ))}
      </ul>
      {isOwner && (
        <button onClick={() => setPhase("draw")}>Empezar juego</button>
      )}
      {!isOwner && <div>Espera a que el creador inicie el juego.</div>}
    </div>
  );
}