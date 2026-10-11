import Image from "next/image";
import clsx from "clsx";

const sizes = {
  sm: {
    quranBadge: "h-10 w-18",
    assocBadge: "h-10 w-10",
    title: "text-sm",
    sub: "text-[11px]",
  },
  md: {
    quranBadge: "h-13 sm:h-15 w-24 sm:w-28",
    assocBadge: "h-12 sm:h-14 w-12 sm:w-14",
    title: "text-base sm:text-xl",
    sub: "text-xs sm:text-xs",
  },
  lg: {
    quranBadge: "h-20 sm:h-24 w-36 sm:w-44",
    assocBadge: "h-18 sm:h-22 w-18 sm:w-22",
    title: "text-2xl sm:text-3xl",
    sub: "text-sm sm:text-base",
  },
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  layout?: "horizontal" | "vertical";
  showText?: boolean;
  showAssociation?: boolean;
  /** "onDeep" = لما اللوجو يبقى فوق خلفية غامقة (الفوتر / الشريط الجانبي) */
  tone?: "default" | "onDeep";
  className?: string;
}

/**
 * الشعار الدائري لجمعية شباب المستقبل (مستقل للاستخدام على يسار الهيدر أو في أي مكان مخصص)
 */
export function AssociationLogoBadge({
  size = "md",
  className,
  onClick,
}: {
  size?: keyof typeof sizes;
  className?: string;
  onClick?: () => void;
}) {
  const s = sizes[size];
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative shrink-0 rounded-full overflow-hidden bg-white p-1 shadow-md border-2 border-emerald-500/60 ring-2 ring-emerald-500/15 hover:ring-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group",
        s.assocBadge,
        className,
      )}
      title="جمعية شباب المستقبل للتنمية الشاملة (المشهرة برقم 733 لسنة 2005)"
      aria-label="شعار جمعية شباب المستقبل"
      suppressHydrationWarning
    >
      <Image
        src="/association-logo.png"
        alt="شعار جمعية شباب المستقبل"
        fill
        sizes="120px"
        className="object-contain p-0.5 group-hover:rotate-3 transition-transform"
        priority
      />
    </button>
  );
}

/**
 * اللوجو الموحّد:
 * يعرض الشعار الأساسي لمدرسة القرءان الكريم (+ شعار الجمعية اختياريًا)
 * يدعم التنسيق الأفقي (للهيدر والفوتر) والتنسيق الرأسي (للشريط الجانبي وصفحة الدخول)
 */
export function Logo({
  size = "md",
  layout = "horizontal",
  showText = true,
  showAssociation = false,
  tone = "default",
  className,
}: LogoProps) {
  const s = sizes[size];
  const isVertical = layout === "vertical";

  return (
    <span
      className={clsx(
        "inline-flex group select-none",
        isVertical ? "flex-col items-center text-center gap-2.5" : "items-center text-start gap-3",
        className,
      )}
    >
      {/* حاوية الشعارين معاً */}
      <span className="flex items-center justify-center gap-2 shrink-0">
        {/* 1. الشعار الأساسي: مدرسة القرءان الكريم (بحجم كبير وبارز) */}
        <span
          className={clsx(
            "relative shrink-0 rounded-2xl overflow-hidden bg-white p-1.5 shadow-md border-2 border-gold/60 ring-2 ring-gold/15 flex items-center justify-center",
            tone === "onDeep" ? "ring-white/15" : "shadow-brand/5",
            "transition-transform duration-200 group-hover:scale-105",
            s.quranBadge,
          )}
          title="مدرسة القرءان الكريم"
        >
          <Image
            src="/quran-school-logo.png"
            alt="شعار مدرسة القرءان الكريم"
            fill
            sizes="160px"
            className="object-contain p-0.5"
            priority
          />
        </span>

        {/* 2. الشعار الثانوي: جمعية شباب المستقبل (إذا طُلب بجانبه مباشرة) */}
        {showAssociation && (
          <span
            className={clsx(
              "relative shrink-0 rounded-full overflow-hidden bg-white p-1 shadow-md border-2 border-emerald-500/60 ring-2 ring-emerald-500/15 flex items-center justify-center",
              tone === "onDeep" ? "ring-white/15" : "shadow-emerald-900/5",
              "transition-transform duration-200 group-hover:scale-105",
              s.assocBadge,
            )}
            title="جمعية شباب المستقبل"
          >
            <Image
              src="/association-logo.png"
              alt="شعار جمعية شباب المستقبل"
              fill
              sizes="120px"
              className="object-contain"
              priority
            />
          </span>
        )}
      </span>

      {/* النصوص المرافقة */}
      {showText && (
        <span
          className={clsx(
            "leading-tight min-w-0",
            isVertical ? "flex flex-col items-center" : "flex flex-col justify-center",
          )}
        >
          <span
            className={clsx(
              "block font-ruqaa font-bold leading-[1.3] truncate max-w-full",
              s.title,
              tone === "onDeep" ? "text-on-deep" : "text-ink",
            )}
          >
            مدرسة القرءان الكريم
          </span>
          <span
            className={clsx(
              "block font-bold truncate max-w-full text-gold-ink",
              s.sub,
              !isVertical && "hidden sm:block",
              tone === "onDeep" ? "text-gold" : "text-brand-ink",
            )}
          >
            التابعة لجمعية شباب المستقبل
          </span>
        </span>
      )}
    </span>
  );
}
