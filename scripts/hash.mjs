// Genera un hash scrypt para una contraseña. Uso: npm run hash -- <contraseña>
import crypto from "crypto";

const pass = process.argv[2];
if (!pass) {
  console.error("Uso: npm run hash -- <contraseña>");
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pass, salt, 64);
console.log(`${salt.toString("hex")}:${hash.toString("hex")}`);
