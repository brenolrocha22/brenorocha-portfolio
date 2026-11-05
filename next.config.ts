import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// v1: static pages cannot carry per-request nonces, and Next.js injects inline
// bootstrap scripts, so script-src needs 'unsafe-inline'. 'unsafe-eval' only in dev
// (React Refresh). Turnstile origins are added in delivery 5 only if enabled.
// Validate this policy on the Vercel preview before tightening (see architecture §7).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  // v1.0 one-page (D25): old routes → anchors on the Home (308). Query strings pass through.
  async redirects() {
    return [
      { source: "/sobre", destination: "/#trajetoria", permanent: true },
      { source: "/tecnologias", destination: "/#tecnologias", permanent: true },
      { source: "/certificacoes", destination: "/#certificados", permanent: true },
      { source: "/solucoes", destination: "/#contato", permanent: true },
      { source: "/contato", destination: "/#contato", permanent: true },
      { source: "/projetos", destination: "/#projetos", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
