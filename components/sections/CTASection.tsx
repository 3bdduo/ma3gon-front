"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  return (
    <section className="cv-auto py-14 sm:py-24">
      <Container>
        <Reveal from="scale" duration={0.9}>
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] bg-deep text-on-deep border border-deep-line px-6 sm:px-10 py-14 sm:py-20 text-center sh-float">
            <div aria-hidden="true" className="absolute inset-0 pattern-star opacity-[0.09]" />
            <div aria-hidden="true" className="absolute -top-20 -right-10 h-64 w-64 rounded-full orb-2" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full orb-1" />

            <h2 className="relative font-ruqaa font-bold text-[clamp(2rem,5.6vw,3.6rem)] leading-[1.65] max-w-2xl mx-auto text-balance">
              اغرس في صدر ابنك كنزًا لا يفنى.. وتوّج نفسك بتاج الوقار
            </h2>
            <p className="relative mt-4 text-on-deep-soft max-w-xl mx-auto leading-relaxed">
              أبواب التسجيل مفتوحة لاستقبال براعم النور في جميع الحلقات والمستويات — مقاعد محدودة لضمان الرعاية الفردية والإتقان التام لكل طالب.
            </p>
            <div className="relative mt-8 sm:mt-10 flex justify-center">
              <ButtonLink href="/register" variant="secondary" size="lg">
                انضم إلى عائلة المدرسة وسجّل الآن
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
