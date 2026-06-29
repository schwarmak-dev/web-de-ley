"use client";

import { useState } from "react";
import Link from "next/link";

const PREGUNTAS = [
  "¿Tienes una política de privacidad publicada (en tu local o en tu web)?",
  "Si un cliente te pidiera borrar sus datos, ¿sabrías cómo y en qué plazo responder?",
  "¿Los datos de tus clientes están protegidos con contraseña o cifrado (y no en un Excel abierto para todos)?",
  "¿Tienes un contrato con quienes manejan tus datos por ti (contador, software, agencia)?",
];

export default function Diagnostico() {
  const [respuestas, setRespuestas] = useState<(boolean | null)[]>(
    Array(PREGUNTAS.length).fill(null),
  );
  const [verResultado, setVerResultado] = useState(false);

  const contestadas = respuestas.filter((r) => r !== null).length;
  const noes = respuestas.filter((r) => r === false).length;

  function responder(i: number, valor: boolean) {
    setRespuestas((prev) => {
      const next = [...prev];
      next[i] = valor;
      return next;
    });
  }

  function reiniciar() {
    setRespuestas(Array(PREGUNTAS.length).fill(null));
    setVerResultado(false);
  }

  if (verResultado) {
    const nivel = noes >= 3 ? "alto" : noes >= 1 ? "medio" : "bajo";
    const texto = {
      alto: {
        titulo: "Tu nivel de riesgo es ALTO",
        msg: "Hoy tu negocio está bastante expuesto a la nueva ley. La buena noticia: todo esto se arregla, y mientras antes lo hagas, más barato te sale.",
      },
      medio: {
        titulo: "Tu nivel de riesgo es MEDIO",
        msg: "Vas bien en algunas cosas, pero te faltan piezas clave. Cerrémoslas antes de que la ley empiece a apretar.",
      },
      bajo: {
        titulo: "Tu nivel de riesgo es BAJO",
        msg: "¡Vas muy bien! Aun así conviene una revisión para asegurarnos de que todo quede 100% en regla.",
      },
    }[nivel];

    return (
      <div className={`diag-result diag-${nivel}`}>
        <span className="diag-tag">Resultado</span>
        <h3>{texto.titulo}</h3>
        <p>{texto.msg}</p>
        <p className="diag-detalle">
          Respondiste “no” en <strong>{noes}</strong> de {PREGUNTAS.length} puntos clave.
        </p>
        <div className="diag-cta">
          <Link className="btn" href="/solicitar">Quiero que revisen mi empresa</Link>
          <button className="btn btn-ghost" type="button" onClick={reiniciar}>
            Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diag">
      {PREGUNTAS.map((p, i) => (
        <div className="diag-q" key={i}>
          <p className="diag-pregunta">
            <span className="diag-num">{i + 1}</span>
            {p}
          </p>
          <div className="diag-opts">
            <button
              type="button"
              className={respuestas[i] === true ? "on" : ""}
              aria-pressed={respuestas[i] === true}
              onClick={() => responder(i, true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={respuestas[i] === false ? "on" : ""}
              aria-pressed={respuestas[i] === false}
              onClick={() => responder(i, false)}
            >
              No
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn submit"
        disabled={contestadas < PREGUNTAS.length}
        onClick={() => setVerResultado(true)}
      >
        {contestadas < PREGUNTAS.length
          ? `Responde las ${PREGUNTAS.length} preguntas (${contestadas}/${PREGUNTAS.length})`
          : "Ver mi nivel de riesgo"}
      </button>
    </div>
  );
}
