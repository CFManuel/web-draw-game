import React, { useState } from "react";

function randomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export default function Lobby({
  setPhase,
  setRoomCode,
  setPlayers,
  setCurrentUser,
  players,
  roomCode,
}) {
  const [name, setName] = useState("");
  const [inputRoom, setInputRoom] = useState("");

  const handleCreate = () => {
    const code = randomCode();
    setRoomCode(code);
    setPlayers([{ name, isOwner: true }]);
    setCurrentUser(name);
    setPhase("wait");
  };

  const handleJoin = () => {
    setRoomCode(inputRoom);
    setPlayers((prev) => [...prev, { name, isOwner: false }]);
    setCurrentUser(name);
    setPhase("wait");
  };

  return (
    <div>
      <h2>Web Draw Game</h2>
      <label>
        Tu nombre:
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <div style={{ margin: 10 }}>
        <button onClick={handleCreate} disabled={!name}>
          Crear sala
        </button>
        <span style={{ margin: 10 }}>o</span>
        <input
          placeholder="Código de sala"
          value={inputRoom}
          onChange={e => setInputRoom(e.target.value.toUpperCase())}
        />
        <button onClick={handleJoin} disabled={!name || !inputRoom}>
          Unirse
        </button>
      </div>
      {roomCode && (
        <div>
          <b>Jugadores en sala:</b>
          {players.map((p, i) => (
            <div key={i}>{p.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}