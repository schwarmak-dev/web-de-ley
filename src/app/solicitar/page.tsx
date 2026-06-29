import Link from "next/link";
import { BRAND } from "@/lib/brand";
import FormSolicitud from "./FormSolicitud";

export default function SolicitarPage() {
  return (
    <main className="container">
      <nav className="nav">
        <Link className="brand" href="/">
          {BRAND.nombre}
          <small>{BRAND.tagline}</small>
        </Link>
        <div className="nav-links">
          <Link href="/">Volver al inicio</Link>
        </div>
      </nav>

      <div className="formwrap">
        <h1>Solicita una revisión</h1>
        <p className="sub">
          Cuéntanos de tu empresa y qué necesitas. Te respondemos en 48 horas hábiles.
        </p>
        <FormSolicitud />
      </div>
    </main>
  );
}
