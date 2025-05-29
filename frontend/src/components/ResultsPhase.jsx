import React, { useState } from "react";

export default function ResultsPhase({ drawings, classify, players }) {
  const [step, setStep] = useState(0);

  // Agrupar comentarios y asignaciones por imagen
  const current = drawings[step];
  const comments = classify.filter(cl => cl.image.player === current.player);

  return (
    <div>
      <h2>Resultados</h2>
      <div style={{ border: "1px solid gray", width: 320, margin: "auto" }}>
        <img src={current.dataUrl} alt="dibujo" style={{ maxWidth: 300 }} />
        <div>
          <b>Dibujado por:</b> {current.player}
        </div>
        <div>
          <b>Comentarios:</b>
          <ul>
            {comments.map((c, i) => (
              <li key={i}>
                <span>
                  {c.by}: "{c.guess}" (asignado a: {c.assignedTo})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Anterior
        </button>
        <button
          onClick={() => setStep(Math.min(drawings.length - 1, step + 1))}
          disabled={step === drawings.length - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}