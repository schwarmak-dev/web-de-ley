import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { TIPOS_SOLICITUD, SLA_HORAS_HABILES, type TipoSolicitud } from "@/lib/tipos";
import { plazoHabil } from "@/lib/plazos";

// Límites de longitud para evitar datos abusivos / oversized.
const LIMITES = { empresa: 120, contacto: 120, email: 160, telefono: 40, rut: 20, detalle: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generarComprobante() {
  return "SOL-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  // Honeypot: si el campo señuelo viene relleno, es un bot. Fingimos éxito y no guardamos.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ comprobante: "SOL-OK" }, { status: 201 });
  }

  const empresa = String(body.empresa ?? "").trim();
  const contacto = String(body.contacto ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tipo = String(body.tipo ?? "");
  const rut = String(body.rut ?? "").trim();
  const telefono = String(body.telefono ?? "").trim();
  const detalle = String(body.detalle ?? "").trim();

  if (!empresa || !contacto || !email || !tipo) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }
  if (!(tipo in TIPOS_SOLICITUD)) {
    return NextResponse.json({ error: "Tipo de solicitud inválido" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITES.email) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }
  if (
    empresa.length > LIMITES.empresa ||
    contacto.length > LIMITES.contacto ||
    rut.length > LIMITES.rut ||
    telefono.length > LIMITES.telefono ||
    detalle.length > LIMITES.detalle
  ) {
    return NextResponse.json({ error: "Algún campo es demasiado largo" }, { status: 400 });
  }

  const solicitud = await prisma.solicitud.create({
    data: {
      empresa,
      rut: rut || null,
      contacto,
      email,
      telefono: telefono || null,
      tipo,
      detalle: detalle || null,
      deadlineAt: plazoHabil(new Date(), SLA_HORAS_HABILES),
      comprobante: generarComprobante(),
    },
  });

  await notificarEquipo(solicitud);

  return NextResponse.json({ comprobante: solicitud.comprobante }, { status: 201 });
}

// Las solicitudes llegan al equipo por el panel (/panel).
// Punto de extensión para enviar también un correo (Resend / SMTP).
async function notificarEquipo(s: { comprobante: string; empresa: string; tipo: string; email: string }) {
  const tipoLegible = TIPOS_SOLICITUD[s.tipo as TipoSolicitud] ?? s.tipo;
  console.log(`[NUEVA SOLICITUD] ${s.comprobante} · ${s.empresa} · ${tipoLegible} · ${s.email}`);
  // TODO: enviar correo al equipo aquí.
}
