"use client";

import { useEffect, useState } from "react";
import { BookMarked, CalendarCheck, Wallet, TrendingUp, Hand, FileText, Trophy, Medal, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { reportsApi, competitionsApi } from "@/lib/resources";
import { downloadFile } from "@/lib/download";
import { useToast } from "@/components/ui/Toast";
import { Loader, Spinner } from "@/components/ui/Loader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import type { Student, StudentCompetitionResults } from "@/types";

type StudentReport = Student & { stats: { attendanceRate: number; present: number; total: number; paidMonths: number; unpaidMonths: number } };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentReport | null>(null);
  const [compResults, setCompResults] = useState<StudentCompetitionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!user?.studentId) return;
    reportsApi
      .student(user.studentId)
      .then((r) => setData(r as StudentReport))
      .finally(() => setLoading(false));
  }, [user]);

  // جلب نتائج المسابقات بالرقم القومي بعد تحميل بيانات الطالب
  useEffect(() => {
    if (!data?.national_id) return;
    competitionsApi
      .studentResults(data.national_id)
      .then(setCompResults)
      .catch(() => {}); // ممكن ما يكونش في نتائج — مش مشكلة
  }, [data?.national_id]);

  async function handleExportWord() {
    if (!data?.id) return;
    setExporting(true);
    try {
      await downloadFile(`/exports/students/${data.id}.docx`, `تقرير-طالب-${data.name}.docx`);
      showToast("تم تنزيل تقرير الطالب (Word) بنجاح", "success");
    } catch {
      showToast("تعذّر تحميل التقرير", "error");
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <Loader size="lg" />;
  if (!data) return <p className="text-ink-mute">تعذّر تحميل بياناتك، حاول تسجيل الدخول مرة أخرى.</p>;

  const statusLabel: Record<string, string> = { paid: "مدفوع", unpaid: "غير مدفوع", exempt: "معفى" };
  const statusTone: Record<string, "green" | "red" | "gray"> = { paid: "green", unpaid: "red", exempt: "gray" };

  const rankLabel = (rank: number) => {
    if (rank === 1) return { label: "🥇 المركز الأول", cls: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400" };
    if (rank === 2) return { label: "🥈 المركز الثاني", cls: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" };
    if (rank === 3) return { label: "🥉 المركز الثالث", cls: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" };
    return { label: `المركز ${rank}`, cls: "text-ink-soft bg-bg-alt" };
  };

  const hasResults =
    compResults &&
    (compResults.competitions.length > 0 || compResults.exams.length > 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            أهلًا بك، {data.name}{" "}
            <Hand size={22} className="inline text-gold-ink animate-wave origin-bottom-right" aria-hidden="true" />
          </h1>
          <p className="text-ink-mute text-sm mt-1">هنا ملخص تقدمك ومتابعتك في المدرسة</p>
        </div>

        <Button variant="outline" onClick={handleExportWord} disabled={exporting} className="flex items-center gap-2">
          {exporting ? <Spinner size={16} /> : <FileText size={16} />}
          <span>تحميل تقريري الرسمي (Word)</span>
        </Button>
      </div>

      {/* ── نتائج المسابقات والامتحانات ─────────────────────────── */}
      {hasResults && (
        <div className="card !rounded-2xl p-6 space-y-5 border-2 border-gold-ink/20 bg-gradient-to-br from-gold-soft/20 to-transparent">
          <h3 className="font-extrabold text-ink flex items-center gap-2">
            <Trophy size={20} className="text-gold-ink" />
            نتائجك في المسابقات والاختبارات
          </h3>

          {/* مسابقات القرآن */}
          {compResults!.competitions.filter((c) => c.type === "quran").length > 0 && (
            <div>
              <p className="text-xs font-bold text-ink-mute mb-3 flex items-center gap-1">
                <Trophy size={13} className="text-gold-ink" /> مسابقات حفظ القرآن الكريم
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compResults!.competitions
                  .filter((c) => c.type === "quran")
                  .map((c) => {
                    const { label, cls } = rankLabel(c.rank);
                    return (
                      <div
                        key={c.competitionId}
                        className="bg-surface rounded-2xl p-4 border border-line flex flex-col gap-2 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-extrabold text-sm text-ink">{c.competitionName}</p>
                            <p className="text-xs text-ink-mute">عام {c.year}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-line rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 bg-gold-ink rounded-full transition-all"
                              style={{ width: `${Math.min(100, (c.score / c.maxScore) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-ink shrink-0">
                            {c.score} / {c.maxScore}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* امتحانات التربوي */}
          {compResults!.competitions.filter((c) => c.type === "edu").length > 0 && (
            <div>
              <p className="text-xs font-bold text-ink-mute mb-3 flex items-center gap-1">
                <Medal size={13} className="text-brand-ink" /> مسابقات المجموعات التعليمية
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compResults!.competitions
                  .filter((c) => c.type === "edu")
                  .map((c) => {
                    const { label, cls } = rankLabel(c.rank);
                    return (
                      <div
                        key={c.competitionId}
                        className="bg-surface rounded-2xl p-4 border border-line flex flex-col gap-2 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-extrabold text-sm text-ink">{c.competitionName}</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-line rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 bg-brand-ink rounded-full transition-all"
                              style={{ width: `${Math.min(100, (c.score / c.maxScore) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-ink shrink-0">
                            {c.score} / {c.maxScore}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* اختبارات تربوية */}
          {compResults!.exams.length > 0 && (
            <div>
              <p className="text-xs font-bold text-ink-mute mb-3 flex items-center gap-1">
                <Award size={13} className="text-brand-ink" /> اختبارات المجموعات التعليمية
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {compResults!.exams.map((ex) => (
                  <div key={ex.examId} className="bg-surface rounded-2xl p-4 border border-line hover:shadow-sm transition-shadow">
                    <p className="font-bold text-sm text-ink mb-0.5">{ex.name}</p>
                    <p className="text-xs text-ink-mute mb-2">{ex.date}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-line rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-brand-ink rounded-full transition-all"
                          style={{ width: `${Math.min(100, (ex.score / ex.maxScore) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-brand-ink shrink-0">
                        {ex.score} / {ex.maxScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── الإحصائيات ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={BookMarked} label="إجمالي المحفوظ" value={data.memorized_amount} />
        <StatCard icon={CalendarCheck} label="نسبة الحضور" value={`${data.stats.attendanceRate}%`} tone="gold" delay={0.08} />
        <StatCard icon={TrendingUp} label="أشهر مدفوعة" value={data.stats.paidMonths} delay={0.16} />
        <StatCard icon={Wallet} label="الاشتراك الشهري" value={`${data.monthly_fee} جنيه`} tone="gold" delay={0.24} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card !rounded-2xl p-6">
            <h3 className="font-extrabold text-ink mb-5">نسبة الحضور</h3>
            <ProgressBar value={data.stats.attendanceRate} label={`${data.stats.present} من ${data.stats.total} يوم`} />
          </div>

          <div className="card !rounded-2xl p-6">
            <h3 className="font-extrabold text-ink mb-4">سجل الحفظ الأخير</h3>
            {!data.memorizationLog?.length ? (
              <p className="text-sm text-ink-mute py-4 text-center">لا يوجد سجل حفظ بعد</p>
            ) : (
              <ul className="divide-y divide-line">
                {data.memorizationLog.slice(0, 6).map((m) => (
                  <li key={m.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-ink">{m.added_amount}</p>
                      {m.teacher_note && <p className="text-xs text-ink-mute mt-0.5">{m.teacher_note}</p>}
                    </div>
                    <span className="text-xs text-ink-mute font-semibold">{m.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card !rounded-2xl p-6">
            <h3 className="font-extrabold text-ink mb-4">حالة الاشتراك الشهري</h3>
            {!data.payment?.months || Object.keys(data.payment.months).length === 0 ? (
              <p className="text-sm text-ink-mute py-4 text-center">لا توجد بيانات دفع بعد</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(data.payment.months).map(([month, info]) => (
                  <div key={month} className="flex items-center justify-between bg-bg-alt rounded-xl px-4 py-3">
                    <span className="text-sm font-bold text-ink-soft">{month}</span>
                    <Badge tone={statusTone[info.status]}>{statusLabel[info.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
