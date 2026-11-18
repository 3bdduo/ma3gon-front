"use client";

import { FormEvent, useState } from "react";
import { Phone, MapPin, Send, MessageCircle, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "الاستفسار عن التسجيل", message: "" });
  const { showToast } = useToast();

  const subjects = [
    "الاستفسار عن التسجيل",
    "مواعيد الحلقات",
    "أحكام التجويد والمناهج",
    "متابعة الطالب",
    "أخرى",
  ];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      showToast("يرجى ملء جميع البيانات المطلوبة", "error");
      return;
    }

    const formattedMessage = [
      "السلام عليكم ورحمة الله وبركاته،",
      "",
      "*رسالة جديدة عبر الموقع — مدرسة القرءان الكريم بقرية معجون*",
      "",
      `*الاسم:* ${form.name.trim()}`,
      `*رقم الهاتف:* ${form.phone.trim()}`,
      `*الموضوع:* ${form.subject}`,
      "",
      "*نص الرسالة:*",
      form.message.trim(),
    ].join("\n");

    const url = `https://api.whatsapp.com/send?phone=201119838926&text=${encodeURIComponent(formattedMessage)}`;

    showToast("تم تجهيز رسالتك! جاري تحويلك إلى واتساب...", "success");

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = url;
    }

    setForm({ name: "", phone: "", subject: "الاستفسار عن التسجيل", message: "" });
  }

  return (
    <div className="py-14 sm:py-24">
      <Container>
        <SectionHeading eyebrow="تواصل معنا" title="نسعد بتواصلكم وزيارتكم" />

        {/* بطاقة موقع المدرسة */}
        <Reveal className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-brand/20 bg-gradient-to-br from-brand/5 via-surface to-bg-alt p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* أيقونة الموقع */}
            <div className="shrink-0 h-16 w-16 rounded-2xl bg-brand flex items-center justify-center text-on-brand sh-brand">
              <Building2 size={28} />
            </div>

            <div className="flex-1 text-center sm:text-start">
              <span className="inline-block text-xs font-bold text-brand-ink bg-brand/10 border border-brand/20 px-3 py-1 rounded-full mb-2">
                المقر الرسمي
              </span>
              <h3 className="font-ruqaa text-2xl sm:text-3xl font-bold text-ink leading-[1.5] mb-1">
                مدرسة القرءان الكريم
              </h3>
              <p className="text-gold-ink font-bold text-base mb-4">بقرية معجون</p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-ink-soft">
                <span className="flex items-center justify-center sm:justify-start gap-2 font-medium">
                  <MapPin size={16} className="text-brand shrink-0" />
                  بني سويف — مركز سمسطا — قرية معجون
                </span>
                <a
                  href="https://api.whatsapp.com/send?phone=201119838926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  dir="ltr"
                >
                  <Phone size={16} className="shrink-0" />
                  01119838926
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* قسم التواصل والنموذج */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* العمود الجانبي */}
          <div className="lg:col-span-2 space-y-4">
            {/* واتساب */}
            <Reveal from="start">
              <a
                href="https://api.whatsapp.com/send?phone=201119838926"
                target="_blank"
                rel="noopener noreferrer"
                className="group card-interactive flex items-center gap-4 p-5 !rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5"
              >
                <div className="h-13 w-13 shrink-0 rounded-2xl bg-emerald-500 flex items-center justify-center text-white sh-soft group-hover:scale-105 transition-transform duration-200">
                  <MessageCircle size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">تواصل مباشر عبر واتساب</p>
                  <p className="font-mono font-black text-xl text-ink" dir="ltr">01119838926</p>
                  <span className="text-[11px] text-ink-mute font-medium">اضغط للدردشة المباشرة مع الإدارة</span>
                </div>
              </a>
            </Reveal>

            {/* عنوان */}
            <Reveal from="start" delay={0.08}>
              <div className="card p-5 !rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-soft flex items-center justify-center text-brand">
                    <MapPin size={18} />
                  </div>
                  <h4 className="font-bold text-sm text-ink">عنوان المدرسة</h4>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed pr-1">
                  محافظة بني سويف<br />
                  مركز سمسطا — قرية معجون
                </p>
              </div>
            </Reveal>
          </div>

          {/* نموذج التواصل */}
          <Reveal from="end" className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5 !rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h4 className="font-bold text-lg text-ink">أرسل استفسارك</h4>
                <span className="text-xs text-ink-mute">يُرسل عبر واتساب</span>
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
                <label className="field-label">موضوع الاستفسار</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="field cursor-pointer"
                  suppressHydrationWarning
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">رسالتك</label>
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
                إرسال عبر واتساب
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
