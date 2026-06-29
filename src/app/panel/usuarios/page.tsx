import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { obtenerSesion, hashPassword } from "@/lib/auth";

const USUARIO_RE = /^[a-z0-9._-]{3,30}$/;

async function crearUsuario(formData: FormData) {
  "use server";
  const sesion = await obtenerSesion();
  if (sesion?.rol !== "admin") redirect("/login");

  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const pass = String(formData.get("pass") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();

  if (usuario === "admin" || !USUARIO_RE.test(usuario)) redirect("/panel/usuarios?error=usuario");
  if (pass.length < 6 || pass.length > 100) redirect("/panel/usuarios?error=pass");

  const existe = await prisma.appUser.findUnique({ where: { usuario } });
  if (existe) redirect("/panel/usuarios?error=existe");

  await prisma.appUser.create({
    data: { usuario, nombre: nombre || null, hash: hashPassword(pass) },
  });
  redirect("/panel/usuarios?ok=1");
}

async function eliminarUsuario(formData: FormData) {
  "use server";
  const sesion = await obtenerSesion();
  if (sesion?.rol !== "admin") redirect("/login");
  await prisma.appUser.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/panel/usuarios");
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const usuarios = await prisma.appUser.findMany({ orderBy: { createdAt: "desc" } });

  const mensajeError = {
    usuario: "El usuario no es válido o ya está reservado (usa 3-30 letras, números, . _ -).",
    pass: "La contraseña debe tener al menos 6 caracteres.",
    existe: "Ese nombre de usuario ya existe.",
  }[error ?? ""];

  return (
    <main className="container" style={{ paddingBottom: "3rem" }}>
      <h1 style={{ marginTop: "1.75rem" }}>Cuentas de clientes</h1>
      <p className="muted">Crea una cuenta y entrégale el usuario y la contraseña a tu cliente.</p>

      <div className="user-create">
        <form action={crearUsuario} className="user-form">
          <div>
            <label htmlFor="usuario">Usuario</label>
            <input id="usuario" name="usuario" placeholder="ej: ferreteria-sanpedro" required />
          </div>
          <div>
            <label htmlFor="nombre">Nombre (opcional)</label>
            <input id="nombre" name="nombre" placeholder="ej: Rodrigo Maldonado" />
          </div>
          <div>
            <label htmlFor="pass">Contraseña</label>
            <input id="pass" name="pass" type="text" placeholder="mínimo 6 caracteres" required />
          </div>
          <button className="btn" type="submit">Crear cuenta</button>
        </form>

        {mensajeError && <div className="err" style={{ marginTop: "1rem" }}>{mensajeError}</div>}
        {ok && <div className="ok" style={{ marginTop: "1rem" }}>Cuenta creada. Ya puede iniciar sesión.</div>}
      </div>

      {usuarios.length === 0 ? (
        <p className="muted" style={{ marginTop: "2rem" }}>Todavía no has creado ninguna cuenta.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Creada</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><code>{u.usuario}</code></td>
                  <td>{u.nombre ?? <span className="muted">—</span>}</td>
                  <td className="muted">{u.createdAt.toLocaleDateString("es-CL")}</td>
                  <td>
                    <form action={eliminarUsuario}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="ghost" type="submit">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
