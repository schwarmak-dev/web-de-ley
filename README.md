# Web de Ley — Sitio + intake de solicitudes

Sitio de la consultora de ciberseguridad y cumplimiento de la **Ley 21.719**. Una PYME envía
una solicitud desde el portal público; al equipo le llega por un **panel con login**.

> La marca ("Web de Ley"), el correo y el SLA se configuran en `src/lib/brand.ts`.

## Arquitectura

- **Next.js 15** (App Router) + **TypeScript**
- **Prisma** ORM. Dev: **SQLite**. Producción: **PostgreSQL**.
- Autenticación propia con cookie firmada (HMAC). Sin dependencias externas.

## Puesta en marcha (dev)

```bash
npm install
npm run db:push      # crea el esquema en SQLite
npm run db:seed      # carga solicitudes de ejemplo
npm run dev          # http://localhost:3200
```

## Rutas

| Ruta | Qué es | Acceso |
|------|--------|--------|
| `/` | Landing: explica el riesgo y los servicios | público |
| `/solicitar` | Formulario que la PYME envía al equipo | público |
| `/login` | Acceso con usuario y contraseña | público |
| `/panel` | Solicitudes recibidas (semáforo SLA 48 h hábiles) | **solo admin** |
| `/estado` | Consulta el estado de una solicitud por su comprobante | sesión (user) |

## Cuentas (cambiar en `src/lib/auth.ts`)

| Usuario | Contraseña | Rol | Tras login va a | Puede |
|---------|-----------|-----|-----------------|-------|
| `admin` | `admin123` | admin | `/panel` | ver todo y marcar resueltas |
| `user`  | `user123`  | user  | `/estado` | solo consultar estado por comprobante |

Un `user` que intente abrir `/panel` es redirigido a `/estado`: **no ve el panel del admin**.

### Seguridad de credenciales

- Las contraseñas se guardan como **hash scrypt** (`salt:hash`), nunca en texto plano.
- Generar el hash de una contraseña nueva: `npm run hash -- <contraseña>` y pegarlo en `auth.ts`.
- `AUTH_SECRET` firma la cookie de sesión (HMAC). En producción es **obligatorio** (la app
  falla al arrancar si falta o es muy corto). La cookie es `httpOnly` y `secure` en producción.

## Cómo llegan las solicitudes

Cada solicitud se guarda y aparece en `/panel`. La función `notificarEquipo()` en
`src/app/api/solicitudes/route.ts` es el punto de extensión para **enviar también un correo**
(Resend / SMTP) — hoy solo registra en consola del servidor.

## Pasar a producción

1. `provider = "postgresql"` en `prisma/schema.prisma` + `DATABASE_URL` real.
2. `AUTH_SECRET` largo y aleatorio en variables de entorno.
3. Mover credenciales del equipo a base de datos con hash (bcrypt/argon2).
4. `npx prisma migrate dev` para migraciones versionadas.

## Roadmap

- [ ] Envío de correo al equipo por cada solicitud.
- [ ] Estado intermedio "En proceso" y notas internas.
- [ ] Verificación anti-spam del formulario (captcha / rate limit).

> Servicio de implementación técnica de protección de datos. No constituye asesoría legal.
