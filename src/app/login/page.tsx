import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { validarCredenciales, crearSesion, obtenerSesion, destinoPorRol } from "@/lib/auth";
import {
  intentosFallidosRecientes,
  registrarIntentoFallido,
  limpiarIntentos,
  LIMITE_INTENTOS,
  VENTANA_MINUTOS,
} from "@/lib/login-throttle";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sesion = await obtenerSesion();
  if (sesion) redirect(destinoPorRol(sesion.rol));
  const { error } = await searchParams;

  async function ingresar(formData: FormData) {
    "use server";
    const usuario = String(formData.get("usuario") ?? "").trim();
    const pass = String(formData.get("pass") ?? "");

    // Límite de intentos: por IP, máximo LIMITE_INTENTOS en VENTANA_MINUTOS.
    const cabeceras = await headers();
    const ip = cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const clave = `login:${ip}`;

    if ((await intentosFallidosRecientes(clave)) >= LIMITE_INTENTOS) {
      redirect("/login?error=rate");
    }

    const rol = await validarCredenciales(usuario, pass);
    if (!rol) {
      await registrarIntentoFallido(clave);
      redirect("/login?error=1");
    }

    await limpiarIntentos(clave);
    await crearSesion(usuario, rol);
    redirect(destinoPorRol(rol));
  }

  return (
    <div className="auth">
      {/* Panel lateral con marca */}
      <aside className="auth-aside">
        <Link href="/" className="auth-brand">{BRAND.nombre}</Link>
        <div className="auth-aside-body">
          <svg className="auth-shield" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.5 4 5.5v6c0 4.6 3.2 8.4 8 10 4.8-1.6 8-5.4 8-10v-6L12 2.5Z"
              stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
            />
            <path d="m8.5 12 2.4 2.4L15.8 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2>Acceso seguro</h2>
          <p>Panel interno del equipo y consulta de estado de los clientes de {BRAND.nombre}.</p>
          <ul className="auth-points">
            <li>Sesión cifrada y firmada</li>
            <li>Solicitudes con plazo de 48 h hábiles</li>
            <li>Cumplimiento Ley 21.719</li>
          </ul>
        </div>
        <span className="auth-foot">No es asesoría legal · Implementación técnica</span>
      </aside>

      {/* Formulario */}
      <section className="auth-main">
        <div className="auth-form">
          <h1>Iniciar sesión</h1>
          <p className="sub">Ingresa con tu usuario y contraseña.</p>

          <form action={ingresar}>
            <label htmlFor="usuario">Usuario</label>
            <input id="usuario" name="usuario" autoComplete="username" autoFocus required />

            <label htmlFor="pass">Contraseña</label>
            <input id="pass" name="pass" type="password" autoComplete="current-password" required />

            {error === "rate" ? (
              <div className="err">
                Demasiados intentos fallidos. Espera {VENTANA_MINUTOS} minutos e inténtalo de nuevo.
              </div>
            ) : error ? (
              <div className="err">Usuario o contraseña incorrectos.</div>
            ) : null}

            <button className="btn submit" type="submit">Ingresar</button>
          </form>

          <Link className="auth-back" href="/">← Volver al inicio</Link>
        </div>
      </section>
    </div>
  );
}
