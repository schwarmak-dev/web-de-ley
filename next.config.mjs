/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Evita que el sitio se embeba en iframes (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Evita que el navegador "adivine" tipos MIME.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limita la información de referer que se filtra a otros sitios.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs sensibles que la web no usa.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
