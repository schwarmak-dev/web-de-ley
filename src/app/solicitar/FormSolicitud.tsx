"use client";

import { useState } from "react";
import { TIPOS_SOLICITUD } from "@/lib/tipos";

export default function FormSolicitud() {
  const [enviando, setEnviando] = useState(false);
  const [comprobante, setComprobante] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo enviar la solicitud. Inténtalo nuevamente.");
      return;
    }
    const data = await res.json();
    setComprobante(data.comprobante);
  }

  if (comprobante) {
    return (
      <div className="ok" role="status">
        <strong>Tu solicitud ha sido enviada.</strong>
        <p style={{ margin: ".5rem 0 0" }}>
          Contestaremos en 48 horas hábiles desde la solicitud.
        </p>
        <p className="hint" style={{ marginTop: ".75rem" }}>
          Comprobante: <strong>{comprobante}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Honeypot anti-spam: invisible para humanos, los bots lo rellenan. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">No llenar este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor="empresa">Empresa o nombre</label>
      <input id="empresa" name="empresa" required />

      <label htmlFor="rut">RUT</label>
      <input id="rut" name="rut" placeholder="76.123.456-7 o 12.345.678-9" />
      <div className="hint">Puede ser el RUT de tu empresa o el personal.</div>

      <label htmlFor="contacto">Nombre de contacto</label>
      <input id="contacto" name="contacto" required />

      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="telefono">Teléfono (opcional)</label>
      <input id="telefono" name="telefono" />

      <label htmlFor="tipo">¿Qué necesitas?</label>
      <select id="tipo" name="tipo" required defaultValue="REVISION">
        {Object.entries(TIPOS_SOLICITUD).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>

      <label htmlFor="detalle">Cuéntanos más (opcional)</label>
      <textarea id="detalle" name="detalle" placeholder="Describe tu situación o lo que te preocupa." />

      {error && <div className="err">{error}</div>}

      <button className="btn submit" type="submit" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
