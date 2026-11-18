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
          aria-label="معلومات مدرسة القرءان الكريم بقرية معجون"
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

            {/* منطقة عرض الشعار ببروز فائق */}
            <div className="relative overflow-hidden rounded-t-[2rem] bg-gradient-to-b from-brand/5 via-bg-alt to-surface px-6 pt-10 pb-8 border-b border-line">
              <div aria-hidden="true" className="absolute inset-0 pattern-star opacity-[0.10]" />

              <div className="relative flex flex-col items-center justify-center gap-5 z-10">
                {/* شعار مدرسة القرءان الكريم بقرية معجون */}
                <div className="flex flex-col items-center">
                  <m.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-white border-4 border-gold/70 shadow-2xl ring-4 ring-gold/20"
                  >
                    <Image
                      src="/quran-school-logo.png"
                      alt="شعار مدرسة القرءان الكريم بقرية معجون"
                      fill
                      sizes="208px"
                      className="object-contain select-none"
                      priority
                    />
                  </m.div>
                  <span className="mt-2 text-xs font-bold text-brand-ink bg-brand/10 border border-brand/20 px-3 py-1 rounded-full">
                    الشعار الرسمي للمدرسة
                  </span>
                </div>
              </div>
            </div>

            {/* المعلومات والتعريف الرسمي */}
            <div className="p-6 sm:p-7 text-center" dir="rtl">
              <h2 className="font-ruqaa text-2xl sm:text-3xl font-bold text-ink leading-[1.5] mb-1">
                مدرسة القرءان الكريم
              </h2>
              <p className="text-gold-ink text-sm sm:text-base font-bold mb-4">
                بقرية معجون
              </p>

              <p className="text-ink-soft text-sm leading-relaxed mb-5">
                منهج تربوي وقرآني متكامل لتحفيظ كتاب الله الكريم وتعليم أحكام التجويد والعلوم الشرعية، بإشراف كوكبة من المعلمين والمعلمات المؤهلين.
              </p>

              {/* موقع المدرسة */}
              <div className="text-start bg-bg-alt/80 border border-line rounded-2xl p-3.5 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <MapPin size={15} className="text-brand shrink-0" />
                  <span>موقع المدرسة:</span>
                </div>
                <p className="text-xs text-ink-soft font-medium pr-4">
                  محافظة بني سويف — مركز سمسطا — قرية معجون
                </p>
              </div>

              {/* بطاقة التواصل بالواتساب السريع */}
              <a
                href="https://api.whatsapp.com/send?phone=201119838926"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all font-bold text-sm"
              >
                <MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span>للتواصل المباشر عبر واتساب:</span>
                <span dir="ltr" className="font-mono text-base font-black">+20 11 19838926</span>
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
