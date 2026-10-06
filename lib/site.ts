// رابط الموقع الأساسي (بدون / في الآخر) — بيتستخدم في السايت ماب، الـ robots، ومعاينة المشاركة (Open Graph).
// يمكن ضبطه في .env.local وفي إعدادات المتغيرات على Vercel:
//   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app/
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");