"use client";

import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

const testimonials = [
  {
    name: "أم عبد الرحمن",
    role: "ولية أمر طالب خاتم",
    text: "لم ألمس فقط حفظاً متقناً في ابني، بل رأيت سكينةً تفيض في حديثه، وحرصاً على برنا، وخشوعاً في صلاته.. مدرسة القرءان الكريم لم تكن مجرد حلقة تحفيظ، بل محضناً تربوياً مباركاً غيّر بيتنا إلى نور وطمأنينة.",
  },
  {
    name: "أبو مالك الشريف",
    role: "ولي أمر طالبين بالمدرسة",
    text: "أعظم استثمار وضعت فيه وقت أبنائي وجهدهم. المتابعة المستمرة وتقارير المشايخ الأسبوعية جعلتني شريكاً حقيقياً في كل آية يحفظونها، ورأيت حرصاً نادراً على الإتقان بالسند لا مجرد التسميع السريع.",
  },
  {
    name: "فاطمة الزهراء",
    role: "طالبة خاتمة ومجازة بالسند",
    text: "بدأت طفلة صغيرة أتهجى الحروف، واليوم أكرمني الله بختم كتابه وحيازة إجازة التجويد.. فضل مشايخي ومعلماتي بعد فضل الله طوقٌ في عنقي، علموني أن القرآن حياة وخلق قبل أن يكون مجرد حفظ سطور.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="cv-auto py-16 sm:py-24 bg-bg-alt/60">
      <Container>
        <SectionHeading eyebrow="شهادات من القلب" title="أثرُ القرآن في بيوت طلابنا ووجدانهم" />

        <Stagger className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <StaggerItem key={t.name} className={`h-full ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <figure className="card-interactive relative h-full p-6 sm:p-7 flex flex-col">
                <Quote className="text-gold mb-3 rotate-180" size={34} />
                <blockquote className="text-ink-soft leading-relaxed mb-6 flex-1 font-medium">{t.text}</blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-line">
                  <span className="h-11 w-11 shrink-0 rounded-full bg-brand-soft text-brand-ink grid place-items-center font-ruqaa text-xl font-bold">
                    {t.name.replace(/^(أم|أبو)\s/, "").charAt(0)}
                  </span>
                  <span>
                    <span className="block font-extrabold text-ink">{t.name}</span>
                    <span className="block text-xs text-brand-ink font-semibold">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
