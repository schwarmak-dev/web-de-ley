// Tipos de servicio que una PYME puede solicitar.
export const TIPOS_SOLICITUD = {
  REVISION: "Revisión de vulnerabilidades",
  SOLUCION: "Solucionar problemas de vulnerabilidad",
  DIAGNOSTICO: "Diagnóstico de cumplimiento Ley 21.719",
  IMPLEMENTACION: "Implementación de protección de datos",
  OTRA: "Otra consulta",
} as const;
export type TipoSolicitud = keyof typeof TIPOS_SOLICITUD;

export const ESTADOS = {
  NUEVA: "Nueva",
  EN_PROCESO: "En proceso",
  RESPONDIDA: "Respondida",
} as const;
export type Estado = keyof typeof ESTADOS;

// Compromiso de respuesta al cliente.
export const SLA_HORAS_HABILES = 48;
