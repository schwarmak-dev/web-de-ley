import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TIPOS_SOLICITUD, ESTADOS, type TipoSolicitud, type Estado } from "@/lib/tipos";
import { semaforo, horasRestantes, COLOR_SEMAFORO } from "@/lib/plazos";
import { obtenerSesion } from "@/lib/auth";

async function resolverSolicitud(formData: FormData) {
  "use server";
  const sesion = await obtenerSesion();
  if (sesion?.rol !== "admin") return; // solo el admin puede resolver
  const id = String(formData.get("id"));
  await prisma.solicitud.update({
    where: { id },
    data: { estado: "RESPONDIDA", resueltoAt: new Date() },
  });
  revalidatePath("/panel");
}

function etiquetaPlazo(deadlineAt: Date, resueltoAt: Date | null) {
  if (resueltoAt) return "Resuelta";
  const h = horasRestantes(deadlineAt);
  return h < 0 ? `Vencida hace ${Math.abs(h)}h` : `${h}h restantes`;
}

export default async function PanelPage() {
  const solicitudes = await prisma.solicitud.findMany({ orderBy: { deadlineAt: "asc" } });
  const pendientes = solicitudes.filter((s) => !s.resueltoAt).length;

  return (
    <main className="container" style={{ paddingBottom: "3rem" }}>
      <h1 style={{ marginTop: "1.75rem" }}>Solicitudes recibidas</h1>
      <p className="muted">{pendientes} sin responder · plazo de 48 horas hábiles</p>

      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Plazo</th>
            <th>Empresa</th>
            <th>Tipo</th>
            <th>Contacto</th>
            <th>Estado</th>
            <th>Comprobante</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => {
            const sem = semaforo(s.deadlineAt, s.resueltoAt);
            return (
              <tr key={s.id}>
                <td>
                  <span className="dot" style={{ background: COLOR_SEMAFORO[sem] }} />
                  {etiquetaPlazo(s.deadlineAt, s.resueltoAt)}
                </td>
                <td>
                  {s.empresa}
                  {s.rut && (
                    <>
                      <br />
                      <span className="muted" style={{ fontSize: ".8rem" }}>{s.rut}</span>
                    </>
                  )}
                </td>
                <td>
                  <span className="tag">{TIPOS_SOLICITUD[s.tipo as TipoSolicitud] ?? s.tipo}</span>
                </td>
                <td>
                  {s.contacto}
                  <br />
                  <span className="muted" style={{ fontSize: ".8rem" }}>{s.email}</span>
                  {s.telefono && (
                    <>
                      <br />
                      <span className="muted" style={{ fontSize: ".8rem" }}>{s.telefono}</span>
                    </>
                  )}
                </td>
                <td>{ESTADOS[s.estado as Estado] ?? s.estado}</td>
                <td><code>{s.comprobante}</code></td>
                <td>
                  {!s.resueltoAt && (
                    <form action={resolverSolicitud}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="ghost" type="submit">Marcar resuelta</button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </main>
  );
}
