"use client";

import { useTheme } from "@/contexts/ThemeContext";

/**
 * زر تبديل المود — سماء بتتغير:
 *  • لايت: سما دافية مخضرّة + سحابتين + شمس ذهبية بتلمع
 *  • دارك: ليل بني غامق + نجوم بتلمع + قمر بفوهات
 * الشكل كله بيتحكم فيه الـ class "dark" على <html> (CSS بس) — يعني مفيش وميض ولا حركة غلط
 * عند فتح الصفحة، والاتجاه ثابت LTR جوه الزر عشان الكرة تتحرك صح في الـ RTL.
 *
 * ملاحظات الأداء (موبايل):
 *  • will-change: transform على الكرة عشان الـ GPU يحجز layer مسبقًا
 *  • touch-action: manipulation عشان يلغي تأخير الـ 300ms في iOS/Android
 *  • durations أقصر بكتير عشان الاستجابة تبدو فورية
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      dir="ltr"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="تبديل الوضع الفاتح / الداكن"
      title="تبديل الوضع الفاتح / الداكن"
      style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={`group relative h-9 w-[68px] sm:h-10 sm:w-[76px] shrink-0 overflow-hidden rounded-full
        ring-1 ring-black/10 dark:ring-white/10
        shadow-[0_6px_18px_-4px_rgba(9,18,36,0.22),inset_0_2px_4px_rgba(9,18,36,0.15)]
        dark:shadow-[0_8px_22px_-4px_rgba(0,0,0,0.85),inset_0_2px_5px_rgba(0,0,0,0.7)]
        transition-[box-shadow] duration-300
        active:scale-95 ${className}`}
    >
      {/* سما النهار */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-[#bae6fd] via-[#60a5fa] to-[#2563eb] opacity-100 dark:opacity-0 transition-opacity duration-300"
      >
        <span className="absolute left-[46%] top-[58%] h-3 w-7 rounded-full bg-white/80 blur-[1px]" />
        <span className="absolute left-[58%] top-[30%] h-2.5 w-5 rounded-full bg-white/70 blur-[1px]" />
        <span className="absolute left-[38%] top-[28%] h-2 w-3.5 rounded-full bg-white/60 blur-[1px]" />
      </span>

      {/* سما الليل */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-[#1e293b] via-[#0f172a] to-[#040711] opacity-0 dark:opacity-100 transition-opacity duration-300"
      >
        <i className="absolute left-[12%] top-[26%] h-[3px] w-[3px] rounded-full bg-[#e2e8f0] shadow-[0_0_2px_#fff]" />
        <i className="absolute left-[24%] top-[62%] h-[2px] w-[2px] rounded-full bg-white shadow-[0_0_2px_#fff]" />
        <i className="absolute left-[34%] top-[22%] h-[2px] w-[2px] rounded-full bg-white shadow-[0_0_2px_#fff]" />
        <i className="absolute left-[18%] top-[44%] h-[2px] w-[2px] rounded-full bg-[#bfdbfe] shadow-[0_0_2px_#fff]" />
        <i className="absolute left-[40%] top-[70%] h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_2px_#fff]" />
      </span>

      {/* الكرة: شمس ↔ قمر */}
      <span
        aria-hidden="true"
        style={{ willChange: "transform" }}
        className="absolute left-1 top-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full
          translate-x-0 dark:translate-x-[32px] sm:dark:translate-x-[36px]
          transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* الشمس */}
        <span
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff7ed,#f59e0b_55%,#d97706)]
            shadow-[0_0_0_3px_rgba(245,158,11,0.28),0_0_12px_2px_rgba(245,158,11,0.65)]
            opacity-100 rotate-0 scale-100 dark:opacity-0 dark:rotate-90 dark:scale-50
            transition-all duration-250"
        />
        {/* القمر */}
        <span
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#e2e8f0_60%,#94a3b8)]
            shadow-[0_0_10px_2px_rgba(226,232,240,0.35),inset_-3px_-3px_5px_rgba(71,85,105,0.35)]
            opacity-0 -rotate-90 scale-50 dark:opacity-100 dark:rotate-0 dark:scale-100
            transition-all duration-250"
        >
          <i className="absolute left-[22%] top-[30%] h-[6px] w-[6px] rounded-full bg-[#64748b]/40" />
          <i className="absolute left-[52%] top-[52%] h-[8px] w-[8px] rounded-full bg-[#64748b]/35" />
          <i className="absolute left-[38%] top-[68%] h-[4px] w-[4px] rounded-full bg-[#64748b]/40" />
        </span>
      </span>
    </button>
  );
}
