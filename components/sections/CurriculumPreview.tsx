"use client";

import { BookOpen, Mic2, Scale, Languages, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const tracks = [
  {
    icon: BookOpen,
    title: "تحفيظ القرآن وتثبيته",
    desc: "منهجية علمية راسخة تجمع بين الحفظ المتأني والمراجعة التراكمية اليومية لضمان ثبات الآيات في الصدر كالجبال الرواسي.",
  },
  {
    icon: Mic2,
    title: "التجويد وضبط الأداء",
    desc: "دراسة متون التجويد وتصحيح مخارج الحروف وصفاتها بالمشافهة والتلقي المباشر حتى ينطق الطالب بكتاب الله غضاً كما نزل.",
  },
  {
    icon: Scale,
    title: "التفسير والعلوم الشرعية",
    desc: "بناء البصيرة والوعي الإيماني عبر تدارس معاني الآيات، السيرة النبوية العطرة، ومكارم الأخلاق والآداب الإسلامية.",
  },
];

export function CurriculumPreview() {
  return (
    <section className="cv-auto py-16 sm:py-24 bg-deep text-on-deep relative overflow-hidden shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.5),0_24px_60px_-30px_rgba(0,0,0,0.5)]">
      <div aria-hidden="true" className="absolute inset-0 pattern-star opacity-[0.07]" />
      <div aria-hidden="true" className="absolute -top-32 left-[10%] h-80 w-80 rounded-full orb-2" />
      <div aria-hidden="true" className="absolute -bottom-32 right-[8%] h-80 w-80 rounded-full orb-1" />

      <Container className="relative">
        <SectionHeading
          tone="onDeep"
          eyebrow="مسارات العلم والتزكية"
          title="منظومة قرآنية متكاملة تصنع الحافظ المتقن"
          description="مسارات تعليمية متوازنة تصحب الطالب من التأسيس الصوتي السليم إلى رسوخ الحفظ وتدبر المعاني وبناء الأخلاق"
        />

        <Stagger className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tracks.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="h-full">
              <div className="group h-full bg-deep-2/80 border border-deep-line rounded-3xl p-6 sm:p-7 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-2 hover:bg-deep-2 hover:border-gold/50 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.75)]">
                <div className="mb-5 h-14 w-14 grid place-items-center rounded-2xl bg-gold/15 text-gold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                  <Icon size={28} />
                </div>
                <h3 className="font-extrabold text-lg mb-2 text-on-deep">{title}</h3>
                <p className="text-sm text-on-deep-soft leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-10 sm:mt-12 text-center">
          <ButtonLink href="/curriculum" variant="secondary">
            <ArrowLeft size={18} />
            استعرض الخطة والمناهج بالتفصيل
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
