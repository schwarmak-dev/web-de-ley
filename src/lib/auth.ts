import { cookies } from "next/headers";
import crypto from "crypto";

// --- Secreto de sesión ---
const DEFAULT_SECRET = "dev-secret-cambia-esto-en-produccion";
const COOKIE = "sesion";

// Obtiene el secreto de sesión. Se valida en tiempo de EJECUCIÓN (no al importar el módulo)
// para no romper el build de producción: la variable se inyecta al desplegar, no al compilar.
function getSecret(): string {
  const raw = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!raw || raw === DEFAULT_SECRET || raw.length < 32) {
      throw new Error("AUTH_SECRET debe estar definido (mínimo 32 caracteres) en producción.");
    }
    return raw;
  }
  return raw ?? DEFAULT_SECRET;
}

export type Rol = "admin" | "user";

// Credenciales del equipo. Las contraseñas se guardan como hash scrypt ("salt:hash").
// Para generar el hash de una contraseña nueva: `npm run hash -- <contraseña>`.
const USUARIOS: Record<string, { hash: string; rol: Rol }> = {
  admin: {
    hash: "e8c5fe86f36af590e8c083d5ab1e8c05:e32b3435674bd7e54f20f989a9e5d82d915a3d8e2cc9af8af513d6c154a48d73abffc511983716f4598bfcb705a2beddc5e8c2ced659d5dae114267871def518",
    rol: "admin",
  },
  user: {
    hash: "01de929ba59b78a4ad8732ff6ad841fa:45764c24b45c2585196fc29029082573d6d94eccf603279111f76d26ed74403192e375e02512974ec22638e3c9c210135e3864498db5cb953707bf5c93a4f9ea",
    rol: "user",
  },
};

// Verifica una contraseña contra un hash "salt:hash" en tiempo constante.
function verificarPassword(pass: string, almacenado: string): boolean {
  const [saltHex, hashHex] = almacenado.split(":");
  if (!saltHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, "hex");
  const derivado = crypto.scryptSync(pass, Buffer.from(saltHex, "hex"), esperado.length);
  return derivado.length === esperado.length && crypto.timingSafeEqual(derivado, esperado);
}

export function validarCredenciales(usuario: string, pass: string): Rol | null {
  const u = USUARIOS[usuario];
  // Calculamos siempre un scrypt (aunque el usuario no exista) para no filtrar por tiempo.
  const hash = u?.hash ?? "00:" + "0".repeat(128);
  const ok = verificarPassword(pass, hash);
  return u && ok ? u.rol : null;
}

// --- Firma de cookie (HMAC) ---
function hmac(valor: string): string {
  return crypto.createHmac("sha256", getSecret()).update(valor).digest("hex");
}
function firmar(valor: string): string {
  return `${valor}.${hmac(valor)}`;
}
function verificar(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const valor = token.slice(0, i);
  const firma = token.slice(i + 1);
  const esperado = hmac(valor);
  if (
    firma.length === esperado.length &&
    crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperado))
  ) {
    return valor;
  }
  return null;
}

// --- Sesión ---
export async function crearSesion(usuario: string, rol: Rol): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, firmar(`${usuario}:${rol}`), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function obtenerSesion(): Promise<{ usuario: string; rol: Rol } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const valor = verificar(token);
  if (!valor) return null;
  const [usuario, rol] = valor.split(":");
  return { usuario, rol: rol as Rol };
}

// Destino tras iniciar sesión según el rol.
// El admin va al panel; el cliente (user) va al inicio, desde donde puede revisar su estado.
export function destinoPorRol(rol: Rol): string {
  return rol === "admin" ? "/panel" : "/";
}
