import type { Metadata, Viewport } from "next";
import { Tajawal, Aref_Ruqaa } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { AppBootstrap } from "@/components/ui/AppBootstrap";
import { FormValidator } from "@/components/ui/FormValidator";
import { API_URL } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const API_ORIGIN = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "https://sms-ma3gon-back.vercel.app";
  }
})();

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal-var",
  display: "swap",
});

// خط الرقعة — للعناوين الكبيرة فقط (font-ruqaa)
const ruqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-ruqaa-var",
  display: "swap",
});

const SITE_TITLE = "مدرسة القرءان الكريم بقرية معجون";
const SITE_DESCRIPTION =
  "منصة تعليمية شاملة لتحفيظ القرآن الكريم والتفسير والتجويد والعلوم الشرعية، مع متابعة مستمرة لتقدم الطلاب.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | " + SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  appleWebApp: { capable: true, title: "مدرسة القرءان الكريم", statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  // معاينة المشاركة على واتساب/فيسبوك/تويتر — من غيرها اللينك بيظهر عاري من غير عنوان ولا صورة
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/quran-school-logo.png", width: 800, height: 400, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/quran-school-logo.png"],
  },
};

// viewport-fit=cover عشان الـ safe-area يشتغل صح في الآيفون والأندرويد (الـ notch وشريط الجيستشر)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// بيضبط المود قبل أول رسمة ويمنع أخطاء الـ hydration الناتجة عن إضافات المتصفح (مثل إضافات التحميل والتعبئة التلقائية)
// + بيمنع كليك يمين وأكثر اختصارات DevTools
const headInitScript = `(function(){
  try {
    var s = localStorage.getItem("qs-theme");
    var d = s ? s === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (d) { document.documentElement.classList.add("dark"); }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) { m.setAttribute("content", d ? "#060911" : "#f4f6fa"); }
  } catch(e) {}
  try {
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mut = mutations[i];
          if (mut.type === 'attributes' && mut.attributeName && (mut.attributeName.indexOf('fdprocess') !== -1 || mut.attributeName.indexOf('data-dashlane') !== -1)) {
            mut.target.removeAttribute(mut.attributeName);
          }
        }
      }).observe(document.documentElement, { attributes: true, subtree: true });
    }
  } catch(e) {}
  try {
    // منع كليك يمين
    document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    // منع اختصارات DevTools
    document.addEventListener('keydown', function(e){
      var k = e.key;
      // F12
      if (k === 'F12') { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+Shift+K
      if (e.ctrlKey && e.shiftKey && (k==='I'||k==='i'||k==='J'||k==='j'||k==='C'||k==='c'||k==='K'||k==='k')) { e.preventDefault(); return; }
      // Ctrl+U (عرض المصدر)
      if (e.ctrlKey && (k==='U'||k==='u')) { e.preventDefault(); return; }
      // Ctrl+S (حفظ الصفحة)
      if (e.ctrlKey && (k==='S'||k==='s')) { e.preventDefault(); return; }
    });
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${tajawal.variable} ${ruqaa.variable}`}
    >
      <head>
        <meta name="theme-color" content="#f4f6fa" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* فتح الاتصال بالباك إند مبكرًا (DNS + TLS) عشان أول طلب يبقى أسرع */}
        <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={API_ORIGIN} />
        <script dangerouslySetInnerHTML={{ __html: headInitScript }} />
      </head>
      <body className="bg-bg text-ink antialiased" suppressHydrationWarning>
        <MotionProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
                <AppBootstrap />
                <FormValidator />
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}