import React, { useState } from "react";
import Lobby from "./components/Lobby";
import WaitRoom from "./components/WaitRoom";
import DrawPhase from "./components/DrawPhase";
import ClassifyPhase from "./components/ClassifyPhase";
import ResultsPhase from "./components/ResultsPhase";

export default function App() {
  // Estados principales
  const [phase, setPhase] = useState("lobby"); // lobby | wait | draw | classify | results
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]); // [{name, drawings, guesses, assignments}]
  const [currentUser, setCurrentUser] = useState(""); // nombre
  const [drawings, setDrawings] = useState([]); // [{player, dataUrl}]
  const [classify, setClassify] = useState([]); // [{image, guesses: [{user, guess, assignedTo}]}]

  // Lobby: unir/crear sala y poner nombre
  if (phase === "lobby") {
    return (
      <Lobby
        setPhase={setPhase}
        setRoomCode={setRoomCode}
        setPlayers={setPlayers}
        setCurrentUser={setCurrentUser}
        players={players}
        roomCode={roomCode}
      />
    );
  }

  // Espera: muestra jugadores y botón empezar (solo creador)
  if (phase === "wait") {
    return (
      <WaitRoom
        players={players}
        currentUser={currentUser}
        setPhase={setPhase}
      />
    );
  }

  // Fase dibujo
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

  // Fase clasificar (drag & drop + input)
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

  // Resultados
  if (phase === "results") {
    return (
      <ResultsPhase
        drawings={drawings}
        classify={classify}
        players={players}
      />
    );
  }

  return <div>Web Draw Game funcionando.</div>;
}