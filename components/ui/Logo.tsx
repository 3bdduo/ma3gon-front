import Image from "next/image";
import clsx from "clsx";

const sizes = {
  sm: {
    quranBadge: "h-10 w-10",
    title: "text-sm",
    sub: "text-[11px]",
  },
  md: {
    quranBadge: "h-14 w-14 sm:h-16 sm:w-16",
    title: "text-base sm:text-xl",
    sub: "text-xs sm:text-xs",
  },
  lg: {
    quranBadge: "h-24 w-24 sm:h-28 sm:w-28",
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
 * اللوجو الموحّد لمدرسة القرءان الكريم بقرية معجون
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
      {/* الشعار الأساسي: مدرسة القرءان الكريم بقرية معجون */}
      <span className="flex items-center justify-center gap-2 shrink-0">
        <span
          className={clsx(
            "relative shrink-0 rounded-full overflow-hidden bg-transparent border-2 border-gold/60 ring-2 ring-gold/15 flex items-center justify-center",
            tone === "onDeep" ? "ring-white/15" : "",
            "transition-transform duration-200 group-hover:scale-105",
            s.quranBadge,
          )}
          title="مدرسة القرءان الكريم بقرية معجون"
        >
          <Image
            src="/quran-school-logo.png"
            alt="شعار مدرسة القرءان الكريم بقرية معجون"
            fill
            sizes="160px"
            className="object-cover"
            priority
          />
        </span>
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
            بقرية معجون
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * شعار مدرسة القرءان (مستقل للاستخدام في أي مكان)
 * @deprecated استخدم Logo بدلاً منه
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
        "relative shrink-0 rounded-2xl overflow-hidden bg-white p-1.5 shadow-md border-2 border-gold/60 ring-2 ring-gold/15 hover:ring-gold/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group",
        s.quranBadge,
        className,
      )}
      title="مدرسة القرءان الكريم بقرية معجون"
      aria-label="شعار مدرسة القرءان الكريم بقرية معجون"
      suppressHydrationWarning
    >
      <Image
        src="/quran-school-logo.png"
        alt="شعار مدرسة القرءان الكريم بقرية معجون"
        fill
        sizes="120px"
        className="object-contain p-0.5 group-hover:scale-105 transition-transform"
        priority
      />
    </button>
  );
}
