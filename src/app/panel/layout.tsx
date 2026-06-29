import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerSesion, cerrarSesion } from "@/lib/auth";
import { BRAND } from "@/lib/brand";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/login");
  if (sesion.rol !== "admin") redirect("/estado"); // el panel es solo para admin

  async function salir() {
    "use server";
    await cerrarSesion();
    redirect("/login");
  }

  return (
    <>
      <header className="panel-bar">
        <span className="brand">{BRAND.nombre} · Panel</span>
        <span className="who">
          <Link href="/panel">Solicitudes</Link>
          <Link href="/panel/usuarios">Usuarios</Link>
          <span className="panel-user">{sesion.usuario}</span>
          <form action={salir}>
            <button className="btn-mini" type="submit">Salir</button>
          </form>
        </span>
      </header>
      {children}
    </>
  );
}
