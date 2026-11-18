"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { ArrowLeft } from "lucide-react";

const allItems = [
  /* مميزات المدرسة */
  {
    title: "إتقانٌ بالسند والمشافهة",
    desc: "غرس مخارج الحروف وأحكام التجويد غضةً طرية كما أُنزلت، بتلقٍ مباشر على أيدي مشايخ مسندين متقنين.",
  },
  {
    title: "تربيةٌ بالقرآن لا مجرد تلقين",
    desc: "نربط الآيات بالخلق والعمل والبر بالوالدين، ليتخرج الطالب قرآناً يمشي على الأرض نوراً ونفعاً لمجتمعه.",
  },
  {
    title: "متابعة وثيقة وشراكة مع البيت",
    desc: "نضع ولي الأمر في قلب الرحلة بتقارير إنجاز وتسميع دورية وتواصل دائم، لتشهد نماء ثمرتك خطوة بخطوة.",
  },
  {
    title: "تدرّج يلهم الهمة والشغف",
    desc: "بيئة إيمانية دافئة تزرع حب المسجد والتنافس الشريف في نفوس الصغار، مع مواعيد مدروسة تراعي أوقات دراستهم.",
  },
  /* مسارات العلم */
  {
    title: "تحفيظ القرآن وتثبيته",
    desc: "منهجية علمية راسخة تجمع بين الحفظ المتأني والمراجعة التراكمية اليومية لضمان ثبات الآيات في الصدر.",
  },
  {
    title: "التجويد وضبط الأداء",
    desc: "دراسة متون التجويد وتصحيح مخارج الحروف وصفاتها بالمشافهة والتلقي المباشر حتى ينطق الطالب بكتاب الله غضاً.",
  },
  {
    title: "التفسير والعلوم الشرعية",
    desc: "بناء البصيرة والوعي الإيماني عبر تدارس معاني الآيات، السيرة النبوية العطرة، ومكارم الأخلاق والآداب الإسلامية.",
  },
];

export function FeaturesSection() {
  return (
    <section className="cv-auto py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="لماذا مدرسة القرءان الكريم؟"
          title="ركائز تميزنا ومسارات العلم والتزكية"
        />

        <Stagger className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-5">
          {allItems.map(({ title, desc }, i) => (
            <StaggerItem key={title} className="h-full">
              <div className="group card-interactive h-full p-5 sm:p-6 flex flex-col items-center text-center">
                {/* رقم موحّد بدل الأيقون */}
                <div className="h-12 w-12 rounded-2xl bg-brand-soft group-hover:bg-brand flex items-center justify-center transition-all duration-300 mb-4 sh-soft group-hover:rotate-[-6deg] group-hover:scale-110">
                  <span className="font-extrabold text-lg text-brand-ink group-hover:text-on-brand leading-none">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-extrabold text-ink text-sm mb-1.5 leading-snug">{title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed hidden lg:block">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* وصف مفصّل — يظهر تحت الأيقونات على الشاشات الصغيرة */}
        <div className="mt-8 lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allItems.map(({ title, desc }, i) => (
            <div key={title} className="card p-4 rounded-2xl flex gap-3">
              <span className="shrink-0 h-7 w-7 rounded-xl bg-brand-soft text-brand-ink font-extrabold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-sm text-ink mb-1">{title}</p>
                <p className="text-xs text-ink-soft leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

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
