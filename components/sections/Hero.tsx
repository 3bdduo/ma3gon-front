"use client";

import { m } from "framer-motion";
import { Sparkles, Award, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IslamicDivider } from "@/components/ui/IslamicDivider";

const EASE = [0.22, 1, 0.36, 1] as const;

const line1 = "نبني قلوبًا تنبضُ بنورِ القرآن".split(" ");
const line2 = "فصاحةً وخُلُقًا وإتقانًا".split(" ");

const chips = [
  { icon: Sparkles, label: "أثرٌ باقٍ وبناءٌ لشخصية قرآنية سوية" },
  { icon: Award, label: "شيوخٌ مهرة بأسانيد متصلة وإتقان تام" },
  { icon: HeartHandshake, label: "رعاية فردية وشراكة دائمة مع الأسرة" },
];

/** كلمات العنوان بتدخل واحدة ورا التانية بحركة ناعمة وسريعة. */
function Words({ words, start, className }: { words: string[]; start: number; className?: string }) {
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={w + i}>
          <m.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: start + i * 0.035, ease: EASE }}
            className="inline-block"
          >
            {w}
          </m.span>{" "}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[var(--hero-from)] via-bg to-bg">
      {/* زخرفة النجمة الثمانية بتتلاشى عند الأطراف */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pattern-star opacity-[0.16] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]"
      />

      {/* نجمة عملاقة بتلف ببطء ورا العنوان — الـ animation على div داخلي منفصل عن الـ translate عشان ميتعارضوش */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-6%] h-[34rem] w-[34rem] sm:h-[46rem] sm:w-[46rem] -translate-x-1/2"
      >
        <div className="w-full h-full animate-spin-slower" style={{ willChange: "transform" }}>
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full text-gold opacity-[0.16]"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="60" y="60" width="280" height="280" />
              <rect x="60" y="60" width="280" height="280" transform="rotate(45 200 200)" />
              <rect x="100" y="100" width="200" height="200" />
              <rect x="100" y="100" width="200" height="200" transform="rotate(45 200 200)" />
              <circle cx="200" cy="200" r="140" />
              <circle cx="200" cy="200" r="60" />
            </g>
          </svg>
        </div>
      </div>

      {/* توهجات طايرة */}
      <div aria-hidden="true" className="absolute -top-24 -right-16 h-80 w-80 sm:h-[30rem] sm:w-[30rem] rounded-full orb-1 animate-float-slow" />
      <div aria-hidden="true" className="absolute -bottom-28 -left-16 h-80 w-80 sm:h-[30rem] sm:w-[30rem] rounded-full orb-2 animate-float" />

      <Container className="relative py-16 sm:py-24 lg:py-28 text-center">
        <m.span
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink bg-brand-soft border border-line px-5 py-2 rounded-full mb-7 sh-soft"
        >
          صرحٌ قرآني رائد لغرس النور وبناء الأجيال
        </m.span>

        {/* العنوان الرئيسي — خط الرقعة */}
        <h1 className="font-ruqaa font-bold text-ink text-[clamp(2.4rem,7.4vw,5rem)] leading-[1.7] max-w-4xl mx-auto text-balance">
          <Words words={line1} start={0.08} />
          <br className="hidden sm:block" />
          <Words words={line2} start={0.08 + line1.length * 0.035} className="text-brand-ink" />
        </h1>

        <m.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
          className="mt-6 text-base sm:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed font-medium"
        >
          بيئة قرآنية وتربوية ملهمة تأخذ بيد ولدك من الحرف الأول وحتى الإتقان والإجازة بالسند المتصل —
          إشرافٌ أبوي حانٍ، تصحيحٌ دقيقٌ للتلاوة، وغرسٌ لقيم الوحي في السلوك والوجدان.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: EASE }}
          className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto"
        >
          <ButtonLink href="/register" size="lg">
            ابدأ رحلة الغرس المبارك
          </ButtonLink>
          <ButtonLink href="/curriculum" variant="outline" size="lg">
            استكشف مساراتنا التعليمية
          </ButtonLink>
        </m.div>

        <div className="mt-10 sm:mt-12">
          <IslamicDivider />
        </div>

        <m.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mt-4"
        >
          {chips.map(({ icon: Icon, label }) => (
            <m.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
              }}
              className="card-interactive flex items-center gap-3 px-5 py-4"
            >
              <div className="h-11 w-11 shrink-0 rounded-full bg-brand-soft flex items-center justify-center text-brand-ink sh-soft">
                <Icon size={21} />
              </div>
              <p className="text-sm font-bold text-ink text-start leading-snug">{label}</p>
            </m.div>
          ))}
        </m.div>
      </Container>
    </section>
  );
}
