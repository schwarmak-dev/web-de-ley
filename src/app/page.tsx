import Link from "next/link";
import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { obtenerSesion, cerrarSesion } from "@/lib/auth";
import Diagnostico from "./Diagnostico";

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
          <a href="#diagnostico" className="hide-mobile">El test</a>
          <a href="#nosotros" className="hide-mobile">Nosotros</a>
          <a href="#preguntas" className="hide-mobile">Preguntas</a>
          {esUser && <Link href="/estado">Mi solicitud</Link>}
          {esAdmin && <Link href="/panel">Panel</Link>}
          {sesion ? (
            <form action={salir}>
              <button className="btn-mini-dark" type="submit">Salir</button>
            </form>
          ) : (
            <Link href="/login" className="hide-mobile">Acceso</Link>
          )}
          <Link className="btn" href="/solicitar">Solicitar</Link>
        </div>
      </nav>

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
        <p className="eyebrow">Ley 21.719 · obligatoria desde diciembre de 2026</p>
        <h1>¿Guardas los datos de tus clientes en un Excel, un cuaderno o por WhatsApp?</h1>
        <p className="lead">
          Entonces la nueva Ley de Datos te afecta. Nosotros revisamos tu negocio, te decimos en
          simple qué te falta y lo dejamos resuelto — sin que tengas que volverte experto en leyes
          ni gastar una fortuna.
        </p>
        <div className="actions">
          {esUser ? (
            <>
              <Link className="btn" href="/estado">Revisar estado de mi solicitud</Link>
              <Link className="btn btn-ghost" href="/solicitar">Enviar otra solicitud</Link>
            </>
          ) : (
            <>
              <a className="btn" href="#diagnostico">Haz el test de 1 minuto</a>
              <Link className="btn btn-ghost" href="/solicitar">Solicitar una revisión</Link>
            </>
          )}
        </div>
      </section>

      {/* RIESGOS */}
      <section className="section" id="riesgos">
        <h2>Esto le puede pasar a tu negocio</h2>
        <p className="section-intro">
          No hay que ser una empresa grande para meterse en problemas. Si manejas datos de clientes
          o trabajadores —y todos lo hacen—, mira estos casos.
        </p>
        <div className="risks">
          <div className="risk">
            <h3>Le mandas la lista de clientes al correo equivocado</h3>
            <p>Eso ya es una filtración de datos que estás obligado a reportar. Si no la detectas a tiempo, te expones a sanción.</p>
          </div>
          <div className="risk">
            <h3>Un cliente te pide borrar sus datos y no sabes qué hacer</h3>
            <p>La ley te da un plazo para responder. Si lo dejas pasar, la persona puede reclamar ante la Agencia.</p>
          </div>
          <div className="risk">
            <h3>Pides datos sin avisar para qué los usas</h3>
            <p>Recolectar datos sin una política clara y sin permiso es una infracción directa a la ley.</p>
          </div>
          <div className="risk">
            <h3>Tu contador o tu software manejan tus datos sin contrato</h3>
            <p>Si un tercero trata datos por ti sin un contrato adecuado, el problema sigue siendo tuyo.</p>
          </div>
        </div>
      </section>

      {/* DIAGNÓSTICO INTERACTIVO */}
      <section className="section" id="diagnostico">
        <h2>¿Qué tan expuesto estás? Averígualo en 1 minuto</h2>
        <p className="section-intro">
          Responde estas 4 preguntas y te mostramos tu nivel de riesgo al instante. Sin registro,
          sin compromiso.
        </p>
        <Diagnostico />
      </section>

      {/* MULTAS */}
      <section className="section">
        <h2>Y si no haces nada, ¿cuánto te puede costar?</h2>
        <p className="section-intro">Las multas se calculan en UTM y suben según la gravedad de la falta.</p>
        <div className="fines">
          <div className="fine"><div className="n">5.000 UTM</div><div className="l">Falta leve</div></div>
          <div className="fine"><div className="n">10.000 UTM</div><div className="l">Falta grave</div></div>
          <div className="fine"><div className="n">20.000 UTM</div><div className="l">Falta gravísima</div></div>
          <div className="fine"><div className="n">2% – 4%</div><div className="l">De tus ingresos al año si reincides</div></div>
        </div>
        <p className="note">
          Si tu empresa es pequeña, en la primera falta recibes una amonestación en vez de multa —
          pero igual tienes que corregir. Adelantarse siempre sale más barato que reaccionar después.
        </p>
      </section>

      {/* SERVICIOS */}
      <section className="section" id="servicios">
        <h2>Cómo lo resolvemos contigo</h2>
        <p className="section-intro">Un proceso ordenado, de principio a fin, y en simple.</p>
        <div className="services">
          <div className="service">
            <div className="k">01</div>
            <h3>Revisamos tu negocio</h3>
            <p>Buscamos por dónde podrían entrar o filtrarse los datos de tu empresa.</p>
          </div>
          <div className="service">
            <div className="k">02</div>
            <h3>Arreglamos lo que falta</h3>
            <p>Corregimos los problemas y cerramos los huecos de seguridad que encontramos.</p>
          </div>
          <div className="service">
            <div className="k">03</div>
            <h3>Te ponemos al día con la ley</h3>
            <p>Te decimos exactamente qué te exige la Ley 21.719 en tu caso, sin tecnicismos.</p>
          </div>
          <div className="service">
            <div className="k">04</div>
            <h3>Dejamos todo funcionando</h3>
            <p>Tu política, tus permisos y tu canal para responderles a los clientes, listos.</p>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="section" id="nosotros">
        <h2>Quiénes somos</h2>
        <div className="nosotros">
          <p>
            Detrás de {BRAND.nombre} hay dos desarrolladores chilenos. Ni un call center ni una
            consultora gigante: nos hablas directo a nosotros, y nosotros mismos revisamos y
            arreglamos tu negocio.
          </p>
          <p>
            Nos metimos en esto porque vimos que muchas PYMEs van a quedar expuestas con la nueva ley
            sin siquiera saberlo, y que las grandes consultoras cobran cifras imposibles. Hablamos en
            simple, no en “legalés”, y te explicamos cada paso.
          </p>
          {/* TIP: agreguen aquí sus nombres y una foto para más confianza. */}
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="section" id="preguntas">
        <h2>Preguntas frecuentes</h2>
        <div className="faq">
          <details>
            <summary>¿Esto me aplica si tengo una empresa chica?</summary>
            <p>Sí. La ley aplica a cualquiera que maneje datos de personas, sin importar el tamaño. Las empresas pequeñas tienen un trato más blando en la primera falta, pero igual deben cumplir.</p>
          </details>
          <details>
            <summary>¿Cuánto cuesta?</summary>
            <p>Depende de tu negocio, pero la idea es justamente que te salga mucho más barato que una consultora grande o que una multa. Te damos un precio claro después de revisar, sin sorpresas.</p>
          </details>
          <details>
            <summary>¿Cuánto se demora?</summary>
            <p>Partimos con un diagnóstico rápido. La implementación depende de qué te falte, pero te damos plazos claros desde el primer día.</p>
          </details>
          <details>
            <summary>¿Necesito saber de tecnología o de leyes?</summary>
            <p>Para nada. Esa es justamente nuestra pega. Tú nos cuentas cómo funciona tu negocio y nosotros nos encargamos del resto.</p>
          </details>
          <details>
            <summary>¿Y si ya tuve un problema con datos de clientes?</summary>
            <p>Con más razón conviene actuar. Te ayudamos a contenerlo, a cumplir con lo que exige la ley y a dejar todo en regla.</p>
          </details>
        </div>
      </section>

      {/* BANDA CTA */}
      <section className="band">
        <h2>{esUser ? "¿Necesitas otra revisión?" : "Demos el primer paso"}</h2>
        <p>
          Cuéntanos de tu empresa y qué te preocupa. Te respondemos en 48 horas hábiles, sin
          compromiso y sin letra chica.
        </p>
        <div className="actions">
          <Link className="btn" href="/solicitar">Solicitar una revisión</Link>
          {esUser ? (
            <Link className="btn btn-ghost" href="/estado">Revisar estado de mi solicitud</Link>
          ) : (
            <a className="btn btn-ghost" href="#diagnostico">Hacer el test primero</a>
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
