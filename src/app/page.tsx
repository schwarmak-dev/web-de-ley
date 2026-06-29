import Link from "next/link";
import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { obtenerSesion, cerrarSesion } from "@/lib/auth";

export default async function Home() {
  const sesion = await obtenerSesion();
  const esUser = sesion?.rol === "user";
  const esAdmin = sesion?.rol === "admin";

  async function salir() {
    "use server";
    await cerrarSesion();
    redirect("/");
  }

  return (
    <main className="container">
      <nav className="nav">
        <span className="brand">
          {BRAND.nombre}
          <small>{BRAND.tagline}</small>
        </span>
        <div className="nav-links">
          <a href="#riesgos">El riesgo</a>
          <a href="#servicios">Qué hacemos</a>
          {esUser && <Link href="/estado">Mi solicitud</Link>}
          {esAdmin && <Link href="/panel">Panel</Link>}
          {sesion ? (
            <form action={salir}>
              <button className="btn-mini-dark" type="submit">Salir</button>
            </form>
          ) : (
            <Link href="/login">Acceso</Link>
          )}
          <Link className="btn" href="/solicitar">Solicitar</Link>
        </div>
      </nav>

      {/* Saludo al cliente con sesión */}
      {esUser && (
        <div className="welcome">
          <span>
            Hola, <strong>{sesion.usuario}</strong>. Aquí tienes el detalle de lo que revisamos en tu empresa.
          </span>
          <Link className="btn" href="/estado">Revisar estado de mi solicitud</Link>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">Ley 21.719 · rige desde el 1 de diciembre de 2026</p>
        <h1>Revisamos tu empresa, te decimos qué te falta y lo dejamos resuelto.</h1>
        <p className="lead">
          La nueva Ley de Protección de Datos llega con multas para quien no la cumpla. Nosotros
          encontramos tus puntos débiles y los arreglamos, en lenguaje claro y sin que tengas que
          contratar a un estudio de abogados caro.
        </p>
        <div className="actions">
          {esUser ? (
            <>
              <Link className="btn" href="/estado">Revisar estado de mi solicitud</Link>
              <Link className="btn btn-ghost" href="/solicitar">Enviar otra solicitud</Link>
            </>
          ) : (
            <>
              <Link className="btn" href="/solicitar">Solicitar una revisión</Link>
              <a className="btn btn-ghost" href="#riesgos">Ver qué arriesgo</a>
            </>
          )}
        </div>
      </section>

      {/* RIESGOS */}
      <section className="section" id="riesgos">
        <h2>Lo que hoy deja expuesta a tu PYME</h2>
        <p className="section-intro">
          No hace falta ser una empresa grande para estar en riesgo. Si manejas datos de clientes o
          trabajadores —y todos lo hacen—, estas son las situaciones que te pueden costar caro.
        </p>
        <div className="risks">
          <div className="risk">
            <h3>Un cliente pide sus datos y no alcanzas a responder</h3>
            <p>La ley da plazos para responder. Si no lo haces, la persona reclama ante la Agencia y te sancionan.</p>
          </div>
          <div className="risk">
            <h3>Una filtración que ni sabías que tenías</h3>
            <p>Un correo mal enviado o un sistema vulnerado obliga a reportar. Primero hay que detectarlo a tiempo.</p>
          </div>
          <div className="risk">
            <h3>Recolectar datos sin permiso ni política</h3>
            <p>Pedir datos sin informar para qué y sin una política publicada es una infracción directa.</p>
          </div>
          <div className="risk">
            <h3>Proveedores que tocan tus datos sin contrato</h3>
            <p>Tu contador, tu agencia o tu software tratan datos por ti. Sin contrato, el problema sigue siendo tuyo.</p>
          </div>
        </div>
      </section>

      {/* MULTAS */}
      <section className="section">
        <h2>Lo que cuesta no hacer nada</h2>
        <p className="section-intro">Las multas se calculan en UTM y suben según la gravedad de la falta.</p>
        <div className="fines">
          <div className="fine"><div className="n">5.000 UTM</div><div className="l">Infracción leve</div></div>
          <div className="fine"><div className="n">10.000 UTM</div><div className="l">Infracción grave</div></div>
          <div className="fine"><div className="n">20.000 UTM</div><div className="l">Infracción gravísima</div></div>
          <div className="fine"><div className="n">2% – 4%</div><div className="l">De tus ingresos anuales por reincidencia</div></div>
        </div>
        <p className="note">
          Las empresas que califican como pequeñas reciben una amonestación escrita en su primera
          falta, pero quedan igualmente obligadas a corregir. Adelantarse sale mucho más barato que
          reaccionar después.
        </p>
      </section>

      {/* SERVICIOS */}
      <section className="section" id="servicios">
        <h2>Cómo lo resolvemos contigo</h2>
        <p className="section-intro">Un proceso ordenado, de principio a fin, sin tecnicismos.</p>
        <div className="services">
          <div className="service">
            <div className="k">01</div>
            <h3>Revisión de vulnerabilidades</h3>
            <p>Buscamos por dónde podrían entrar o filtrarse los datos de tu empresa.</p>
          </div>
          <div className="service">
            <div className="k">02</div>
            <h3>Solución de problemas</h3>
            <p>Corregimos lo que encontramos y cerramos los huecos de seguridad.</p>
          </div>
          <div className="service">
            <div className="k">03</div>
            <h3>Diagnóstico de la ley</h3>
            <p>Te decimos exactamente qué exige la Ley 21.719 en tu caso y qué te falta.</p>
          </div>
          <div className="service">
            <div className="k">04</div>
            <h3>Implementación</h3>
            <p>Dejamos funcionando tu política, tus permisos y tu canal de respuesta a clientes.</p>
          </div>
        </div>
      </section>

      {/* BANDA CTA */}
      <section className="band">
        <h2>{esUser ? "¿Necesitas otra revisión?" : "Pide tu revisión hoy"}</h2>
        <p>
          Cuéntanos de tu empresa y qué te preocupa. Te respondemos en 48 horas hábiles, sin
          compromiso.
        </p>
        <div className="actions">
          <Link className="btn" href="/solicitar">Solicitar una revisión</Link>
          {esUser ? (
            <Link className="btn btn-ghost" href="/estado">Revisar estado de mi solicitud</Link>
          ) : (
            <Link className="btn btn-ghost" href="/login">Acceso del equipo</Link>
          )}
        </div>
      </section>

      <footer className="foot">
        <span>{BRAND.nombre} — {BRAND.tagline}</span>
        <span>Implementación técnica de protección de datos. No es asesoría legal.</span>
      </footer>
    </main>
  );
}
