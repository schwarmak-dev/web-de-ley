import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Web de Ley — Ciberseguridad y Ley 21.719 para PYMEs",
  description: "Revisamos tu empresa, encontramos tus vulnerabilidades y te dejamos cumpliendo la Ley 21.719.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
