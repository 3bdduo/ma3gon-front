import type { MetadataRoute } from "next";

// بيخلي الموقع يتثبّت على الشاشة الرئيسية بنفس الشكل في أندرويد وآيفون
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مدرسة القرءان الكريم التابعة لجميعة شباب المستقبل",
    short_name: "مدرسة القرءان",
    description: "منصة تعليمية شاملة لتحفيظ القرآن الكريم وعلومه",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fa",
    theme_color: "#f4f6fa",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
