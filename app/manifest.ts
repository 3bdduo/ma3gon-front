import type { MetadataRoute } from "next";

// بيخلي الموقع يتثبّت على الشاشة الرئيسية بنفس الشكل في أندرويد وآيفون
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مدرسة القرءان الكريم بقرية معجون",
    short_name: "مدرسة القرءان",
    description: "منصة تعليمية شاملة لتحفيظ القرآن الكريم وعلومه",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fa",
    theme_color: "#f4f6fa",
    icons: [
      { src: "/Gemini_Generated_Image_s3bugus3bugus3bu.jpeg", sizes: "192x192", type: "image/jpeg" },
      { src: "/Gemini_Generated_Image_s3bugus3bugus3bu.jpeg", sizes: "512x512", type: "image/jpeg" },
      { src: "/Gemini_Generated_Image_s3bugus3bugus3bu.jpeg", sizes: "512x512", type: "image/jpeg", purpose: "maskable" },
    ],
  };
}
