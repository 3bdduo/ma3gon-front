"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoModal } from "@/components/ui/LogoModal";
import { Logo } from "@/components/ui/Logo";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن المدرسة" },
  { href: "/curriculum", label: "المناهج" },
  { href: "/blog", label: "المدونة" },
  { href: "/media", label: "المكتبة" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoModal, setLogoModal] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // الهيدر بيصغر ويقوى ظله لما تنزل بالصفحة
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // اقفل القائمة عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // لو الشاشة كبرت لحجم ديسكتوب والقائمة مفتوحة، اقفلها
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // امنع سكرول الصفحة والقائمة مفتوحة (مهم في الموبايل)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <ScrollProgress />

      <header
        className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] border-b transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open
            ? "glass border-line sh-lift"
            : "bg-bg/80 border-transparent shadow-none"
        }`}
      >
        <Container className="flex items-center justify-between gap-2 lg:gap-4 h-18 sm:h-20">
          {/* لوجو مدرسة القرءان الكريم ع اليمين (كبير وبارز — والضغط عليه يفتح تفاصيل وشعار الجمعية والمدرسة) */}
          <button
            onClick={() => setLogoModal(true)}
            className="group shrink-0 min-w-0 rounded-2xl focus-visible:outline-offset-4 cursor-pointer text-start"
            aria-label="معلومات المدرسة والجمعية"
            suppressHydrationWarning
          >
            <Logo size="md" showAssociation={false} />
          </button>

          {/* قائمة الديسكتوب (كل الروابط على سطر واحد بدون أي نزول) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0" aria-label="التنقل الرئيسي">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-bold transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    active ? "text-on-brand" : "text-ink-soft hover:text-brand-ink hover:bg-brand-soft"
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 189, damping: 26 }}
                      className="absolute inset-0 rounded-full bg-brand sh-brand"
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* أزرار الديسكتوب على سطر واحد تماماً ومريحة */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            <ThemeToggle />
            {user ? (
              <ButtonLink href={`/dashboard/${user.role}`} size="sm" className="whitespace-nowrap shrink-0">
                <LayoutDashboard size={15} />
                لوحة التحكم
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="outline" size="sm" className="whitespace-nowrap shrink-0">
                  <LogIn size={15} />
                  تسجيل الدخول
                </ButtonLink>
                <ButtonLink href="/register" size="sm" className="whitespace-nowrap shrink-0">
                  سجّل الآن
                </ButtonLink>
              </>
            )}
          </div>

          {/* موبايل / تابلت: زر المود + البرجر */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              className="relative h-10 w-10 sm:h-11 sm:w-11 grid place-items-center text-ink rounded-2xl bg-surface border border-line sh-soft active:scale-90 transition-transform duration-150 cursor-pointer"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
              suppressHydrationWarning
            >
              <span className="relative h-5 w-5 flex items-center justify-center pointer-events-none">
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                    open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  }`}
                >
                  <X size={22} />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                    !open ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
                  }`}
                >
                  <Menu size={22} />
                </span>
              </span>
            </button>
          </div>
        </Container>

        {/* قائمة الموبايل المنسدلة */}
        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-line bg-surface/98 backdrop-blur-xl px-4 py-5 space-y-3"
          >
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive(link.href) ? "bg-brand text-on-brand" : "text-ink hover:bg-bg-alt"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-line flex flex-col gap-2">
              {user ? (
                <ButtonLink
                  href={`/dashboard/${user.role}`}
                  onClick={() => setOpen(false)}
                  className="w-full justify-center"
                >
                  <LayoutDashboard size={16} />
                  لوحة التحكم
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="w-full justify-center"
                  >
                    <LogIn size={16} />
                    تسجيل الدخول
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-full justify-center"
                  >
                    سجّل الآن
                  </ButtonLink>
                </>
              )}
            </div>
          </m.div>
        )}
      </header>

      {/* المودال الشامل لمعلومات المدرسة وجمعية شباب المستقبل */}
      <LogoModal open={logoModal} onClose={() => setLogoModal(false)} />
    </>
  );
}
