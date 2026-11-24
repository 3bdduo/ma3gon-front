import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    // قيّدنا الهوستات المسموح بها بدل ** (أي هوست)
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ─── Security Headers ───────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // منع تضمين الموقع في iframe من مواقع أخرى
          { key: "X-Frame-Options", value: "DENY" },
          // منع المتصفح من تخمين نوع المحتوى
          { key: "X-Content-Type-Options", value: "nosniff" },
          // إخفاء كامل المصدر في Referrer للروابط الخارجية
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // تعطيل تتبع DNS prefetch
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // HSTS: إجبار HTTPS لمدة سنة مع subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Permissions Policy: تعطيل الميزات الحساسة
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // CSP بسيط: نسمح فقط بمصادر معروفة
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval مطلوب لـ Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://sms-ma3gon-back.vercel.app https://api.whatsapp.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
