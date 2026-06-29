import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const horas = (n) => new Date(Date.now() + n * 3600000);

async function main() {
  const ejemplos = [
    {
      empresa: "Ferretería San Pedro Ltda.",
      rut: "77.345.123-9",
      contacto: "Rodrigo Maldonado",
      email: "rodrigo@ferreteriasanpedro.cl",
      telefono: "+56 9 8123 4567",
      tipo: "REVISION",
      detalle: "Queremos saber si nuestra página web y la base de clientes están expuestas.",
      deadlineAt: horas(4), // semáforo rojo
      comprobante: "SOL-7F3A2D",
    },
    {
      empresa: "Comercial Andes SpA",
      rut: "76.998.221-4",
      contacto: "Paula Reyes",
      email: "paula@comercialandes.cl",
      telefono: null,
      tipo: "DIAGNOSTICO",
      detalle: "Nos dijeron que con la nueva ley nos pueden multar. Necesitamos orientación.",
      deadlineAt: horas(18), // semáforo amarillo
      comprobante: "SOL-2B9C41",
    },
    {
      empresa: "Estudio Dental Sonríe",
      rut: "15.234.567-8", // RUT personal
      contacto: "Iván Cortés",
      email: "contacto@sonrie.cl",
      telefono: "+56 2 2345 6789",
      tipo: "SOLUCION",
      detalle: "Tuvimos un correo filtrado con datos de pacientes y no sabemos qué hacer.",
      deadlineAt: horas(40), // semáforo verde
      comprobante: "SOL-5D1E88",
    },
  ];

  for (const e of ejemplos) {
    await prisma.solicitud.upsert({
      where: { comprobante: e.comprobante },
      update: {},
      create: e,
    });
  }

  console.log("✔ Seed listo.");
  console.log("  Portal:  http://localhost:3200/solicitar");
  console.log("  Panel:   http://localhost:3200/panel  (admin/admin123 · user/user123)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
