"use client";

import { FormEvent, useState } from "react";
import { Phone, MapPin, Send, MessageCircle, Building2, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

const branches = [
  {
    num: "الفرع الأول",
    area: "قرية النويرة",
    location: "بجوار المدرسة الإعدادية بنين",
    city: "مركز إهناسيا — بني سويف",
    tag: "مقر رئيسي",
  },
  {
    num: "الفرع الثاني",
    area: "قرية النويرة",
    location: "بجوار مجمع الجيدة الإسلامي",
    city: "مركز إهناسيا — بني سويف",
    tag: "مجمع إسلامي",
  },
  {
    num: "الفرع الثالث",
    area: "مدينة إهناسيا",
    location: "بجوار هايبر المصرية",
    city: "مدينة إهناسيا — بني سويف",
    tag: "وسط المدينة",
  },
  {
    num: "الفرع الرابع",
    area: "قرية النويرة",
    location: "المنطقة الجديدة — خلف المدرسة الإعدادية بنين",
    city: "مركز إهناسيا — بني سويف",
    tag: "المنطقة الجديدة",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", branch: "الفرع الأول: قرية النويرة", message: "" });
  const { showToast } = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      showToast("يرجى ملء جميع البيانات المطلوبة (الاسم، رقم الهاتف، والرسالة)", "error");
      return;
    }

    const formattedMessage = [
      "السلام عليكم ورحمة الله وبركاته،",
      "",
      "*رسالة جديدة عبر الموقع الإلكتروني - مدرسة القرءان الكريم التابعة لجميعة شباب المستقبل*",
      "",
      `*الاسم:* ${form.name.trim()}`,
      `*رقم الهاتف:* ${form.phone.trim()}`,
      `*الفرع المستهدف:* ${form.branch}`,
      "",
      "*نص الرسالة:*",
      form.message.trim(),
    ].join("\n");

    const url = `https://api.whatsapp.com/send?phone=201110411408&text=${encodeURIComponent(formattedMessage)}`;

    showToast("تم تجهيز رسالتك! جاري تحويلك إلى واتساب...", "success");

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = url;
    }

    setForm({ name: "", phone: "", branch: "الفرع الأول: قرية النويرة", message: "" });
  }

  return (
    <div className="py-14 sm:py-24">
      <Container>
        <SectionHeading eyebrow="تواصل معنا" title="نسعد بتواصلكم وزيارتكم في فروعنا" />

        {/* قسم فروع المدرسة الأربعة مقسمة بشكل جمالي عصري */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-ink text-xs sm:text-sm font-bold mb-3">
              <Building2 size={16} />
              ٤ فروع لخدمة أهالينا — محافظة بني سويف
            </span>
            <h3 className="font-ruqaa text-2xl sm:text-3xl font-bold text-ink">
              عناوين فروع مدرسة القرءان الكريم
            </h3>
            <p className="text-sm text-ink-mute mt-1.5">
              تتوزع فروعنا بين مدينة إهناسيا وقرية النويرة لتيسير حفظ كتاب الله لأبنائنا وبناتنا
            </p>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {branches.map((b) => (
              <StaggerItem key={b.num} className="h-full">
                <div className="group card-interactive h-full p-5 sm:p-6 !rounded-2xl flex flex-col justify-between border-2 border-line/80 hover:border-brand/40 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-extrabold text-sm px-3 py-1 rounded-xl bg-brand text-on-brand sh-brand">
                        {b.num}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-bg-alt text-ink-mute border border-line">
                        {b.tag}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3">
                      <p className="font-bold text-base text-ink flex items-center gap-1.5">
                        <MapPin size={16} className="text-brand shrink-0" />
                        <span>{b.area}</span>
                      </p>
                      <p className="text-sm text-ink-soft leading-relaxed pr-5 font-medium">
                        {b.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line text-[11px] font-bold text-ink-mute flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>{b.city}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* كروت التواصل السريع ونموذج الرسائل */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* العمود الجانبي لمعلومات التواصل */}
          <div className="lg:col-span-2 space-y-4">
            <Reveal from="start">
              <a
                href="https://api.whatsapp.com/send?phone=201110411408"
                target="_blank"
                rel="noopener noreferrer"
                className="group card-interactive flex items-center gap-4 p-5 !rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5"
              >
                <div className="h-13 w-13 shrink-0 rounded-2xl bg-emerald-500 flex items-center justify-center text-white transition-all duration-300 sh-soft group-hover:scale-105">
                  <MessageCircle size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">تواصل مباشر عبر واتساب</p>
                  <p className="font-mono font-black text-xl text-ink break-words" dir="ltr">
                    01110411408
                  </p>
                  <span className="text-[11px] text-ink-mute font-medium">اضغط للدردشة المباشرة مع الإدارة</span>
                </div>
              </a>
            </Reveal>

            <Reveal from="start" delay={0.08}>
              <div className="card-interactive p-5 !rounded-2xl">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-soft text-brand flex items-center justify-center font-bold">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-ink">التبعية الإدارية</h4>
                    <p className="text-xs text-ink-mute">جمعية شباب المستقبل للتنمية الشاملة</p>
                  </div>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed pr-2">
                  المشهرة برقم 733 لسنة 2005 بقرية النويرة — مركز إهناسيا — محافظة بني سويف.
                </p>
              </div>
            </Reveal>
          </div>

          {/* نموذج إرسال الرسالة إلى الواتساب */}
          <Reveal from="end" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5 !rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h4 className="font-bold text-lg text-ink">إرسال استفسار عبر واتساب</h4>
                <span className="text-xs text-ink-mute">رد سريع ومباشر</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">الاسم الكامل</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="field"
                    placeholder="اسم ولي الأمر أو الطالب"
                    autoComplete="name"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className="field-label">رقم الهاتف</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="field"
                    placeholder="01xxxxxxxxx"
                    inputMode="tel"
                    autoComplete="tel"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label className="field-label">اختر الفرع الأقرب إليك</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="field cursor-pointer"
                  suppressHydrationWarning
                >
                  {branches.map((b) => (
                    <option key={b.num} value={`${b.num}: ${b.area} - ${b.location}`}>
                      {b.num} ({b.area} — {b.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">رسالتك أو استفسارك</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="field resize-none"
                  placeholder="اكتب استفسارك عن الحلقات، المواعيد، أو طريقة التسجيل..."
                  suppressHydrationWarning
                />
              </div>

              <Button type="submit" className="w-full justify-center">
                <Send size={18} />
                إرسال عبر واتساب (01110411408)
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
