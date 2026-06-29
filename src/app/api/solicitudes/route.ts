import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TIPOS_SOLICITUD, SLA_HORAS_HABILES, type TipoSolicitud } from "@/lib/tipos";
import { plazoHabil } from "@/lib/plazos";

function generarComprobante() {
  return "SOL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const body = await req.json();
  const { empresa, rut, contacto, email, telefono, tipo, detalle } = body ?? {};

  if (!empresa || !contacto || !email || !tipo) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }
  if (!(tipo in TIPOS_SOLICITUD)) {
    return NextResponse.json({ error: "Tipo de solicitud inválido" }, { status: 400 });
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
