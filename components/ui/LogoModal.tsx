"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { X, BookOpen, MessageCircle, Phone, MapPin } from "lucide-react";

interface LogoModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogoModal({ open, onClose }: LogoModalProps) {
  // إغلاق بـ Escape + منع سكرول الصفحة اللي ورا المودال
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="معلومات المدرسة والجمعية"
        >
          {/* الخلفية */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          {/* الكارت */}
          <m.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-[2rem] bg-surface border border-line sh-float"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3.5 left-3.5 z-20 h-10 w-10 grid place-items-center rounded-full bg-bg-alt/90 text-ink-soft hover:bg-brand hover:text-on-brand hover:rotate-90 transition-all duration-200"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>

            {/* منطقة عرض الشعارين ببروز فائق */}
            <div className="relative overflow-hidden rounded-t-[2rem] bg-gradient-to-b from-brand/5 via-bg-alt to-surface px-6 pt-10 pb-8 border-b border-line">
              <div aria-hidden="true" className="absolute inset-0 pattern-star opacity-[0.10]" />

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-5 z-10">
                {/* 1. شعار مدرسة القرءان الكريم (الأساسي) */}
                <div className="flex flex-col items-center">
                  <m.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="relative w-52 h-28 sm:w-60 sm:h-32 rounded-2xl overflow-hidden bg-white p-2 border-2 border-gold/70 shadow-xl ring-4 ring-gold/15"
                  >
                    <Image
                      src="/quran-school-logo.png"
                      alt="شعار مدرسة القرءان الكريم"
                      fill
                      sizes="240px"
                      className="object-contain p-1 select-none"
                      priority
                    />
                  </m.div>
                  <span className="mt-2 text-xs font-bold text-brand-ink bg-brand/10 border border-brand/20 px-3 py-1 rounded-full">
                    الشعار الرسمي للمدرسة
                  </span>
                </div>

                {/* 2. شعار جمعية شباب المستقبل (التابع لها) */}
                <div className="flex flex-col items-center">
                  <m.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.08 }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white p-2 border-2 border-emerald-500/70 shadow-xl ring-4 ring-emerald-500/15"
                  >
                    <Image
                      src="/association-logo.png"
                      alt="شعار جمعية شباب المستقبل"
                      fill
                      sizes="140px"
                      className="object-contain p-1 select-none"
                      priority
                    />
                  </m.div>
                  <span className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    جمعية شباب المستقبل
                  </span>
                </div>
              </div>
            </div>

            {/* المعلومات والتعريف الرسمي */}
            <div className="p-6 sm:p-7 text-center" dir="rtl">
              <h2 className="font-ruqaa text-2xl sm:text-3xl font-bold text-ink leading-[1.5] mb-1">
                مدرسة القرءان الكريم
              </h2>
              <p className="text-gold-ink text-sm sm:text-base font-bold mb-3">
                التابعة لجمعية شباب المستقبل للتنمية الشاملة
              </p>
              <div className="inline-block bg-bg-alt border border-line text-xs font-bold text-ink-muted px-3 py-1.5 rounded-xl mb-4">
                المشهرة برقم 733 لسنة 2005
              </div>

              <p className="text-ink-soft text-sm leading-relaxed mb-5">
                منهج تربوي وقرآني متكامل لتحفيظ كتاب الله الكريم وتعليم أحكام التجويد والعلوم الشرعية، بإشراف كوكبة من المعلمين والمعلمات المؤهلين.
              </p>

              {/* فروع المدرسة الأربعة */}
              <div className="text-start bg-bg-alt/80 border border-line rounded-2xl p-3.5 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <MapPin size={15} className="text-brand shrink-0" />
                  <span>فروع المدرسة (محافظة بني سويف — مركز إهناسيا):</span>
                </div>
                <ul className="text-xs text-ink-soft space-y-1.5 pr-4 list-disc marker:text-brand font-medium">
                  <li><strong className="text-ink">الفرع الأول:</strong> قرية النويرة — بجوار المدرسة الإعدادية بنين</li>
                  <li><strong className="text-ink">الفرع الثاني:</strong> قرية النويرة — بجوار مجمع الجيدة الإسلامي</li>
                  <li><strong className="text-ink">الفرع الثالث:</strong> مدينة إهناسيا — بجوار هايبر المصرية</li>
                  <li><strong className="text-ink">الفرع الرابع:</strong> قرية النويرة — المنطقة الجديدة خلف المدرسة الإعدادية بنين</li>
                </ul>
              </div>

              {/* بطاقة التواصل بالواتساب السريع */}
              <a
                href="https://api.whatsapp.com/send?phone=201110411408"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all font-bold text-sm"
              >
                <MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span>للتواصل المباشر عبر واتساب:</span>
                <span dir="ltr" className="font-mono text-base font-black">01110411408</span>
              </a>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 min-h-12 rounded-2xl border-2 border-line-strong text-ink-soft text-sm font-bold hover:border-brand hover:text-brand-ink hover:bg-brand-soft transition-all duration-200 active:scale-[0.97]"
                >
                  إغلاق
                </button>
                <Link
                  href="/"
                  onClick={onClose}
                  className="btn-shine flex-1 min-h-12 flex items-center justify-center gap-2 rounded-2xl bg-brand text-on-brand text-sm font-bold hover:bg-brand-strong sh-brand transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <BookOpen size={16} />
                  الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
