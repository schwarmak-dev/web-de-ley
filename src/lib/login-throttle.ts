import { prisma } from "@/lib/prisma";

export const LIMITE_INTENTOS = 5;
export const VENTANA_MINUTOS = 10;

// Cuántos intentos fallidos hubo para esta clave dentro de la ventana.
export async function intentosFallidosRecientes(clave: string): Promise<number> {
  const desde = new Date(Date.now() - VENTANA_MINUTOS * 60 * 1000);
  return prisma.loginAttempt.count({ where: { clave, createdAt: { gte: desde } } });
}

export async function registrarIntentoFallido(clave: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { clave } });
}

// Tras un login exitoso, limpiamos los intentos de esa clave.
export async function limpiarIntentos(clave: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { clave } });
}
