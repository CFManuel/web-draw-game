import React, { useEffect, useState } from "react";
import Lobby from "./components/Lobby";
import WaitRoom from "./components/WaitRoom";
import DrawPhase from "./components/DrawPhase";
import ClassifyPhase from "./components/ClassifyPhase";
import ResultsPhase from "./components/ResultsPhase";

// Utilidades de sala simulada
function getRoomFromUrl() {
  const m = window.location.hash.match(/^#room-([A-Z0-9]{5})$/);
  return m ? m[1] : "";
}

function savePlayerToRoom(roomCode, player) {
  const key = `room-${roomCode}-players`;
  const players = JSON.parse(localStorage.getItem(key) || "[]");
  if (!players.find((p) => p.name === player.name)) {
    players.push(player);
    localStorage.setItem(key, JSON.stringify(players));
  }
}

function getPlayersInRoom(roomCode) {
  const key = `room-${roomCode}-players`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export default function App() {
  const [phase, setPhase] = useState("lobby"); // lobby | wait | draw | classify | results
  const [roomCode, setRoomCode] = useState(getRoomFromUrl() || "");
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [drawings, setDrawings] = useState([]);
  const [classify, setClassify] = useState([]);

  // Sincronizar jugadores de la sala simulada
  useEffect(() => {
    if (roomCode) {
      const interval = setInterval(() => {
        setPlayers(getPlayersInRoom(roomCode));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [roomCode]);

  // Lobby: unir/crear sala y poner nombre
  if (phase === "lobby") {
    return (
      <Lobby
        setPhase={setPhase}
        setRoomCode={(code) => {
          setRoomCode(code);
          window.location.hash = `room-${code}`;
        }}
        setPlayers={setPlayers}
        setCurrentUser={setCurrentUser}
        players={players}
        roomCode={roomCode}
        onJoinRoom={({ room, player }) => {
          savePlayerToRoom(room, player);
          setRoomCode(room);
          setCurrentUser(player.name);
          setPhase("wait");
        }}
      />
    );
  }

  if (phase === "wait") {
    return (
      <WaitRoom
        players={players}
        currentUser={currentUser}
        setPhase={setPhase}
        roomCode={roomCode}
      />
    );
  }

  if (phase === "draw") {
    return (
      <DrawPhase
        players={players}
        currentUser={currentUser}
        drawings={drawings}
        setDrawings={setDrawings}
        setPhase={setPhase}
      />
    );
  }

  if (phase === "classify") {
    return (
      <ClassifyPhase
        players={players}
        currentUser={currentUser}
        drawings={drawings}
        classify={classify}
        setClassify={setClassify}
        setPhase={setPhase}
      />
    );
  }

  if (phase === "results") {
    return (
      <ResultsPhase drawings={drawings} classify={classify} players={players} />
    );
  }

  return <div>Web Draw Game funcionando.</div>;
}