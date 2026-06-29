import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerSesion, cerrarSesion } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import { TIPOS_SOLICITUD, ESTADOS, type TipoSolicitud, type Estado } from "@/lib/tipos";

export default async function EstadoPage({
  searchParams,
}: {
  searchParams: Promise<{ comprobante?: string }>;
}) {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/login");

  const { comprobante } = await searchParams;
  const codigo = comprobante?.trim().toUpperCase();
  const solicitud = codigo
    ? await prisma.solicitud.findUnique({ where: { comprobante: codigo } })
    : null;

  async function salir() {
    "use server";
    await cerrarSesion();
    redirect("/login");
  }

  return (
    <>
      <header className="panel-bar">
        <span className="brand">{BRAND.nombre}</span>
        <span className="who">
          {sesion.usuario}
          <form action={salir}>
            <button className="btn-mini" type="submit">Salir</button>
          </form>
        </span>
      </header>

      <main className="container">
        <div className="formwrap">
          <h1>Estado de tu solicitud</h1>
          <p className="sub">Ingresa el comprobante que recibiste al enviar tu solicitud.</p>

          <form method="get">
            <label htmlFor="comprobante">Comprobante</label>
            <input
              id="comprobante"
              name="comprobante"
              placeholder="SOL-XXXXXX"
              defaultValue={codigo ?? ""}
              required
            />
            <button className="btn submit" type="submit">Consultar</button>
          </form>

          {codigo && !solicitud && (
            <div className="err" style={{ marginTop: "1.5rem" }}>
              No encontramos ninguna solicitud con ese comprobante.
            </div>
          )}

          {solicitud && (
            <div className="estado-card">
              <div className="estado-row">
                <span className="muted">Empresa</span>
                <strong>{solicitud.empresa}</strong>
              </div>
              <div className="estado-row">
                <span className="muted">Solicitud</span>
                <span>{TIPOS_SOLICITUD[solicitud.tipo as TipoSolicitud] ?? solicitud.tipo}</span>
              </div>
              <div className="estado-row">
                <span className="muted">Estado</span>
                <span className="tag">{ESTADOS[solicitud.estado as Estado] ?? solicitud.estado}</span>
              </div>
              <div className="estado-row">
                <span className="muted">Enviada</span>
                <span>{solicitud.createdAt.toLocaleString("es-CL")}</span>
              </div>
              {solicitud.resueltoAt && (
                <div className="estado-row">
                  <span className="muted">Respondida</span>
                  <span>{solicitud.resueltoAt.toLocaleString("es-CL")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
