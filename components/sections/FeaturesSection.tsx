"use client";

import { Scroll, HeartHandshake, ShieldCheck, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

const features = [
  {
    icon: Scroll,
    title: "إتقانٌ بالسند والمشافهة",
    desc: "غرس مخارج الحروف وأحكام التجويد غضةً طرية كما أُنزلت، بتلقٍ مباشر على أيدي مشايخ مسندين متقنين.",
  },
  {
    icon: HeartHandshake,
    title: "تربيةٌ بالقرآن لا مجرد تلقين",
    desc: "نربط الآيات بالخلق والعمل والبر بالوالدين، ليتخرج الطالب قرآناً يمشي على الأرض نوراً ونفعاً لمجتمعه.",
  },
  {
    icon: ShieldCheck,
    title: "متابعة وثيقة وشراكة مع البيت",
    desc: "نضع ولي الأمر في قلب الرحلة بتقارير إنجاز وتسميع دورية وتواصل دائم، لتشهد نماء ثمرتك خطوة بخطوة.",
  },
  {
    icon: Compass,
    title: "تدرّج يلهم الهمة والشغف",
    desc: "بيئة إيمانية دافئة تزرع حب المسجد والتنافس الشريف في نفوس الصغار، مع مواعيد مدروسة تراعي أوقات دراستهم.",
  },
];

export function FeaturesSection() {
  return (
    <section className="cv-auto py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="لماذا مدرسة القرءان الكريم؟"
          title="ركائز تميزنا في تعليم كتاب الله وتزكية النفوس"
        />

        <Stagger className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="h-full">
              <div className="group card-interactive h-full p-6 sm:p-7">
                <div className="h-14 w-14 rounded-2xl bg-brand-soft group-hover:bg-brand flex items-center justify-center text-brand-ink group-hover:text-on-brand transition-all duration-300 mb-5 sh-soft group-hover:rotate-[-6deg] group-hover:scale-110">
                  <Icon size={26} />
                </div>
                <h3 className="font-extrabold text-ink text-lg mb-2">{title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
