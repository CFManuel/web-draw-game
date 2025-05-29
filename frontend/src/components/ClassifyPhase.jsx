import React, { useState } from "react";

// Simple drag & drop de nombres sobre las imágenes
export default function ClassifyPhase({
  players,
  currentUser,
  drawings,
  classify,
  setClassify,
  setPhase,
}) {
  const [step, setStep] = useState(0);
  const [selectedName, setSelectedName] = useState("");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  const drawing = drawings[step];

  const handleDrop = (name) => {
    setSelectedName(name);
  };

  const handleNext = () => {
    setGuesses(prev => [
      ...prev,
      { image: drawing, guess, assignedTo: selectedName, by: currentUser }
    ]);
    setSelectedName("");
    setGuess("");
    if (step + 1 < drawings.length) {
      setStep(step + 1);
    } else {
      setClassify(guesses);
      setPhase("results");
    }
  };

  // No puedes arrastrar tu propio nombre sobre tu dibujo
  const availableNames = players
    .map(p => p.name)
    .filter(n => n !== currentUser);

  return (
    <div>
      <h2>Clasifica y describe el dibujo</h2>
      <div>
        <div>
          <b>Arrastra un nombre sobre la imagen:</b>
          <div style={{ display: "flex", gap: 10 }}>
            {availableNames.map(name => (
              <div
                key={name}
                draggable
                onDragStart={() => setSelectedName(name)}
                style={{
                  border: "1px solid gray",
                  padding: 5,
                  background: selectedName === name ? "lightblue" : "white",
                  cursor: "grab"
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            margin: "20px auto",
            border: "2px dashed gray",
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => e.preventDefault()}
        >
          <img
            src={drawing?.dataUrl}
            alt="dibujo"
            style={{ maxWidth: 280, maxHeight: 280 }}
          />
        </div>
        <input
          placeholder="Describe el dibujo"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          style={{ width: 300 }}
        />
        <div>
          <button
            onClick={handleNext}
            disabled={!selectedName || !guess}
          >
            {step + 1 === drawings.length ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}