// SLA de 48 horas hábiles (cuenta solo de lunes a viernes).

export type Semaforo = "verde" | "amarillo" | "rojo" | "resuelto";

const MS_HORA = 1000 * 60 * 60;

// Suma N horas hábiles a una fecha, saltando sábados y domingos.
export function plazoHabil(desde: Date, horas: number): Date {
  const d = new Date(desde);
  let restantes = horas;
  while (restantes > 0) {
    d.setHours(d.getHours() + 1);
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) restantes--;
  }
  return d;
}

export function horasRestantes(deadlineAt: Date, ahora = new Date()): number {
  return Math.ceil((deadlineAt.getTime() - ahora.getTime()) / MS_HORA);
}

export function semaforo(
  deadlineAt: Date,
  resueltoAt: Date | null,
  ahora = new Date(),
): Semaforo {
  if (resueltoAt) return "resuelto";
  const h = horasRestantes(deadlineAt, ahora);
  if (h < 8) return "rojo"; // urgente o vencido
  if (h < 24) return "amarillo";
  return "verde";
}

export const COLOR_SEMAFORO: Record<Semaforo, string> = {
  verde: "#0b5c4f",
  amarillo: "#b67410",
  rojo: "#9c2a1a",
  resuelto: "#8a8275",
};
