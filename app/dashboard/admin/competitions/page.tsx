"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Trophy,
  Plus,
  GraduationCap,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  competitionsApi,
  examsApi,
  eduGroupsApi,
  studentsApi,
  groupsApi,
} from "@/lib/resources";
import { useToast } from "@/components/ui/Toast";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import type {
  CompetitionItem,
  EduGroupItem,
  Student,
  ExamItem,
  GroupItem,
} from "@/types";

// ─────────────────────────────────────────────
// الصفحة الرئيسية
// ─────────────────────────────────────────────
export default function AdminCompetitionsPage() {
  const [tab, setTab] = useState<"quran" | "edu">("quran");

  // ── مسابقات القرآن ──
  const [quranComps, setQuranComps] = useState<CompetitionItem[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allGroups, setAllGroups] = useState<GroupItem[]>([]);
  const [loadingQuran, setLoadingQuran] = useState(true);

  // ── امتحانات التربوي ──
  const [eduGroups, setEduGroups] = useState<EduGroupItem[]>([]);
  const [eduComps, setEduComps] = useState<CompetitionItem[]>([]);
  const [selectedEduGroupId, setSelectedEduGroupId] = useState("");
  const [eduGroupStudents, setEduGroupStudents] = useState<Student[]>([]);
  const [loadingEdu, setLoadingEdu] = useState(true);

  // ── مودال إنشاء مسابقة قرآن ──
  const [showQuranModal, setShowQuranModal] = useState(false);
  const [quranForm, setQuranForm] = useState({
    name: "",
    year: new Date().getFullYear().toString(),
    maxScore: 100,
  });
  const [activeQuranComp, setActiveQuranComp] = useState<CompetitionItem | null>(null);
  // درجات الطلاب في المسابقة المحددة
  const [scoreEntries, setScoreEntries] = useState<{ studentId: string; score: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [savingResults, setSavingResults] = useState(false);

  // ── مودال إنشاء امتحان تربوي ──
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({
    name: "",
    maxScore: 100,
  });
  const [activeEduComp, setActiveEduComp] = useState<CompetitionItem | null>(null);
  const [eduScoreEntries, setEduScoreEntries] = useState<{ studentId: string; score: number }[]>([]);
  const [savingEduResults, setSavingEduResults] = useState(false);

  const { showToast } = useToast();

  // ─── تحميل البيانات ───────────────────────────────
  async function loadQuranData() {
    setLoadingQuran(true);
    try {
      const [compList, sList, gList] = await Promise.all([
        competitionsApi.listByType("quran"),
        studentsApi.list(),
        groupsApi.list(),
      ]);
      setQuranComps(compList);
      setAllStudents(sList.filter((s) => !s.is_waiting));
      setAllGroups(gList);
    } catch {
      showToast("تعذّر تحميل بيانات مسابقات القرآن", "error");
    } finally {
      setLoadingQuran(false);
    }
  }

  async function loadEduData() {
    setLoadingEdu(true);
    try {
      const [egList, compList] = await Promise.all([
        eduGroupsApi.list(),
        competitionsApi.listByType("edu"),
      ]);
      setEduGroups(egList);
      setEduComps(compList);
      if (egList.length && !selectedEduGroupId) setSelectedEduGroupId(egList[0].id);
    } catch {
      showToast("تعذّر تحميل بيانات امتحانات التربوي", "error");
    } finally {
      setLoadingEdu(false);
    }
  }

  useEffect(() => {
    loadQuranData();
    loadEduData();
  }, []);

  // طلاب المجموعة التربوية المختارة
  useEffect(() => {
    if (!selectedEduGroupId || !allStudents.length) return;
    eduGroupsApi.byId(selectedEduGroupId).then((g) => {
      const sIds = (g.students || []).map((s) => s.studentId);
      setEduGroupStudents(allStudents.filter((s) => sIds.includes(s.id)));
    });
  }, [selectedEduGroupId, allStudents]);

  // فلترة امتحانات المجموعة التربوية المختارة
  const filteredEduComps = useMemo(
    () => eduComps.filter((c) => c.eduGroupId === selectedEduGroupId),
    [eduComps, selectedEduGroupId]
  );

  // ─── إنشاء مسابقة قرآن ──────────────────────────
  async function handleCreateQuranComp(e: React.FormEvent) {
    e.preventDefault();
    try {
      await competitionsApi.create({
        name: quranForm.name,
        year: quranForm.year,
        maxScore: quranForm.maxScore,
        type: "quran",
      });
      showToast("تم إنشاء المسابقة وإضافة طلاب الحلقات تلقائيًا", "success");
      setShowQuranModal(false);
      setQuranForm({ name: "", year: new Date().getFullYear().toString(), maxScore: 100 });
      loadQuranData();
    } catch {
      showToast("تعذّر إنشاء المسابقة", "error");
    }
  }

  // ─── فتح صفحة درجات مسابقة قرآن ────────────────
  async function openQuranComp(comp: CompetitionItem) {
    try {
      const details = await competitionsApi.byId(comp.id);
      setActiveQuranComp(details);
      // إعداد درجات الطلاب — الموجود في النتائج أو صفر
      const entries = (details.participants || []).map((p: any) => {
        const existing = (details.results || []).find((r: any) => r.student_id === p.studentId);
        return { studentId: p.studentId, score: existing?.score ?? 0 };
      });
      setScoreEntries(entries);
      setSearchQuery("");
      // فتح أول مجموعة بشكل افتراضي
      const firstGroupId = (details.participants as any[])?.[0]?.groupId;
      if (firstGroupId) setExpandedGroups({ [firstGroupId]: true });
    } catch {
      showToast("تعذّر تحميل تفاصيل المسابقة", "error");
    }
  }

  // ─── حفظ نتائج مسابقة القرآن ────────────────────
  async function handleSaveQuranResults() {
    if (!activeQuranComp) return;
    setSavingResults(true);
    try {
      await competitionsApi.saveResults(activeQuranComp.id, scoreEntries);
      showToast("تم إنهاء النتيجة وإعلانها للطلاب بنجاح ✅", "success");
      setActiveQuranComp(null);
      loadQuranData();
    } catch (err: any) {
      showToast(err.message || "تعذّر حفظ النتائج", "error");
    } finally {
      setSavingResults(false);
    }
  }

  // ─── حذف مسابقة ─────────────────────────────────
  async function handleDeleteComp(id: string, name: string) {
    if (!window.confirm(`هل أنت متأكد من حذف المسابقة "${name}"؟`)) return;
    try {
      await competitionsApi.remove(id);
      showToast("تم حذف المسابقة", "success");
      setQuranComps((p) => p.filter((c) => c.id !== id));
      setEduComps((p) => p.filter((c) => c.id !== id));
      if (activeQuranComp?.id === id) setActiveQuranComp(null);
      if (activeEduComp?.id === id) setActiveEduComp(null);
    } catch {
      showToast("تعذّر حذف المسابقة", "error");
    }
  }

  // ─── إنشاء امتحان تربوي ─────────────────────────
  async function handleCreateEduComp(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEduGroupId) return;
    try {
      await competitionsApi.create({
        name: eduForm.name,
        year: new Date().getFullYear().toString(),
        maxScore: eduForm.maxScore,
        type: "edu",
        eduGroupId: selectedEduGroupId,
      });
      showToast("تم إنشاء المسابقة وإضافة طلاب المجموعة تلقائيًا", "success");
      setShowEduModal(false);
      setEduForm({ name: "", maxScore: 100 });
      loadEduData();
    } catch {
      showToast("تعذّر إنشاء المسابقة", "error");
    }
  }

  // ─── فتح صفحة درجات امتحان تربوي ───────────────
  async function openEduComp(comp: CompetitionItem) {
    try {
      const details = await competitionsApi.byId(comp.id);
      setActiveEduComp(details);
      const entries = (details.participants || []).map((p: any) => {
        const existing = (details.results || []).find((r: any) => r.student_id === p.studentId);
        return { studentId: p.studentId, score: existing?.score ?? 0 };
      });
      setEduScoreEntries(entries);
    } catch {
      showToast("تعذّر تحميل تفاصيل المسابقة", "error");
    }
  }

  // ─── حفظ نتائج امتحان تربوي ─────────────────────
  async function handleSaveEduResults() {
    if (!activeEduComp) return;
    setSavingEduResults(true);
    try {
      await competitionsApi.saveResults(activeEduComp.id, eduScoreEntries);
      showToast("تم إنهاء النتيجة وإعلانها للطلاب بنجاح ✅", "success");
      setActiveEduComp(null);
      loadEduData();
    } catch (err: any) {
      showToast(err.message || "تعذّر حفظ النتائج", "error");
    } finally {
      setSavingEduResults(false);
    }
  }

  // ─── تجميع طلاب المسابقة حسب الحلقة ────────────
  const groupedParticipants = useMemo(() => {
    if (!activeQuranComp) return {};
    const participants = (activeQuranComp.participants || []) as any[];
    const result: Record<string, { groupName: string; participants: any[] }> = {};
    for (const p of participants) {
      const gId = p.groupId || "other";
      const gName = p.groupName || allGroups.find((g) => g.id === gId)?.name || "بدون مجموعة";
      if (!result[gId]) result[gId] = { groupName: gName, participants: [] };
      result[gId].participants.push(p);
    }
    return result;
  }, [activeQuranComp, allGroups]);

  const filteredGrouped = useMemo(() => {
    if (!searchQuery) return groupedParticipants;
    const q = searchQuery.toLowerCase();
    const filtered: typeof groupedParticipants = {};
    for (const [gId, data] of Object.entries(groupedParticipants)) {
      const ps = data.participants.filter((p: any) =>
        (p.studentName || "").toLowerCase().includes(q) || (p.nationalId || "").includes(q)
      );
      if (ps.length) filtered[gId] = { groupName: data.groupName, participants: ps };
    }
    return filtered;
  }, [groupedParticipants, searchQuery]);

  function setScore(studentId: string, score: number) {
    setScoreEntries((prev) => prev.map((e) => (e.studentId === studentId ? { ...e, score } : e)));
  }

  function setEduScore(studentId: string, score: number) {
    setEduScoreEntries((prev) => prev.map((e) => (e.studentId === studentId ? { ...e, score } : e)));
  }

  function toggleGroup(gId: string) {
    setExpandedGroups((prev) => ({ ...prev, [gId]: !prev[gId] }));
  }

  // ══════════════════════════════════════════════
  // الـ Render
  // ══════════════════════════════════════════════
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">المسابقات والاختبارات</h1>
          <p className="text-ink-mute text-sm mt-1">
            إدارة مسابقات حفظ القرآن الكريم واختبارات المجموعات التعليمية
          </p>
        </div>
        <Button
          onClick={() => (tab === "quran" ? setShowQuranModal(true) : setShowEduModal(true))}
          className="flex items-center gap-2"
        >
          <Plus size={17} />
          <span>{tab === "quran" ? "مسابقة قرآن جديدة" : "مسابقة تربوية جديدة"}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          onClick={() => setTab("quran")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm transition-colors border-b-2 -mb-px ${
            tab === "quran" ? "border-brand text-brand-ink" : "border-transparent text-ink-mute hover:text-ink"
          }`}
        >
          <Trophy size={18} />
          <span>مسابقات القرآن ({quranComps.length})</span>
        </button>
        <button
          onClick={() => setTab("edu")}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm transition-colors border-b-2 -mb-px ${
            tab === "edu" ? "border-brand text-brand-ink" : "border-transparent text-ink-mute hover:text-ink"
          }`}
        >
          <GraduationCap size={18} />
          <span>امتحانات المجموعات التعليمية</span>
        </button>
      </div>

      {/* ─── تبويب مسابقات القرآن ─── */}
      {tab === "quran" && (
        <>
          {/* واجهة تفاصيل مسابقة محددة */}
          {activeQuranComp ? (
            <div className="card !rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Header المسابقة */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                <div>
                  <h2 className="font-extrabold text-xl text-ink">{activeQuranComp.name}</h2>
                  <p className="text-xs text-ink-mute mt-1">
                    الدرجة الكلية: <span className="font-bold text-ink">{activeQuranComp.maxScore} درجة</span>
                    {" · "}
                    {(activeQuranComp.participants as any[])?.length || 0} طالب
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSaveQuranResults}
                    disabled={savingResults}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    <span>إنهاء النتيجة وإعلانها</span>
                  </Button>
                  <button
                    onClick={() => setActiveQuranComp(null)}
                    className="icon-btn rounded-lg text-ink-mute hover:text-ink"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* بحث */}
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم الطالب أو الرقم القومي..."
                  className="field pr-9 text-sm"
                />
              </div>

              {/* الطلاب مجمّعين حسب الحلقة */}
              {Object.keys(filteredGrouped).length === 0 ? (
                <p className="text-center text-ink-mute py-8">لا يوجد طلاب مطابقون</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(filteredGrouped).map(([gId, data]) => {
                    const isOpen = expandedGroups[gId] !== false;
                    return (
                      <div key={gId} className="border border-line rounded-2xl overflow-hidden">
                        {/* رأس الحلقة */}
                        <button
                          onClick={() => toggleGroup(gId)}
                          className="w-full flex items-center justify-between px-5 py-3 bg-bg-alt/60 hover:bg-bg-alt font-bold text-sm text-ink transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Trophy size={15} className="text-gold-ink" />
                            {data.groupName}
                            <span className="text-xs font-normal text-ink-mute">({data.participants.length} طالب)</span>
                          </span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* الطلاب */}
                        {isOpen && (
                          <div className="divide-y divide-line">
                            {data.participants.map((p: any) => {
                              const entry = scoreEntries.find((e) => e.studentId === p.studentId);
                              return (
                                <div
                                  key={p.studentId}
                                  className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-bg-alt/30 transition-colors"
                                >
                                  <div>
                                    <p className="font-bold text-sm text-ink">{p.studentName}</p>
                                    <p className="text-xs text-ink-mute font-mono">{p.nationalId}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min={0}
                                      max={activeQuranComp.maxScore}
                                      value={entry?.score ?? 0}
                                      onChange={(e) => setScore(p.studentId, Number(e.target.value))}
                                      className="field w-20 text-center py-1.5 font-bold text-sm"
                                    />
                                    <span className="text-xs text-ink-mute">/ {activeQuranComp.maxScore}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* زر الإنهاء في الأسفل */}
              <div className="flex justify-end pt-4 border-t border-line">
                <Button
                  onClick={handleSaveQuranResults}
                  disabled={savingResults}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 size={16} />
                  <span>إنهاء النتيجة وإعلانها</span>
                </Button>
              </div>
            </div>
          ) : (
            /* قائمة مسابقات القرآن */
            <>
              {loadingQuran ? (
                <Loader size="lg" />
              ) : quranComps.length === 0 ? (
                <div className="card !rounded-2xl p-12 text-center text-ink-mute">
                  <Trophy size={40} className="mx-auto text-ink-mute/50 mb-3" />
                  <p className="font-bold text-lg">لا توجد مسابقات بعد</p>
                  <p className="text-sm mt-1">اضغط "مسابقة قرآن جديدة" لإنشاء أول مسابقة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {quranComps.map((comp) => (
                    <div key={comp.id} className="card !rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="h-11 w-11 rounded-xl bg-gold-soft text-gold-ink flex items-center justify-center">
                            <Trophy size={20} />
                          </div>
                          <button
                            onClick={() => handleDeleteComp(comp.id, comp.name)}
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-mute hover:text-danger-ink hover:bg-danger-soft rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <h3 className="font-extrabold text-lg text-ink">{comp.name}</h3>
                        <p className="text-xs text-ink-mute mt-1">عام {comp.year}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-ink-soft">
                          <span>الدرجة الكلية: <span className="font-bold text-ink">{comp.maxScore}</span></span>
                          <span>{comp.participantsCount} طالب</span>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-line space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                              comp.resultsPublished ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-bg-alt text-ink-mute"
                            }`}
                          >
                            {comp.resultsPublished ? "✅ النتائج معلنة" : "⏳ قيد التنظيم"}
                          </span>
                        </div>
                        <Button size="sm" onClick={() => openQuranComp(comp)} className="w-full text-xs">
                          <Award size={14} className="ml-1" />
                          {comp.resultsPublished ? "تعديل النتائج" : "رصد الدرجات وإنهاء النتيجة"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ─── تبويب امتحانات التربوي ─── */}
      {tab === "edu" && (
        <div className="space-y-6">
          {/* اختيار المجموعة */}
          <div className="card !rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-ink-mute">اختر المجموعة التعليمية:</label>
              <select
                value={selectedEduGroupId}
                onChange={(e) => {
                  setSelectedEduGroupId(e.target.value);
                  setActiveEduComp(null);
                }}
                className="field field-select text-sm py-2 min-w-56"
              >
                {eduGroups.map((eg) => (
                  <option key={eg.id} value={eg.id}>{eg.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-bold text-ink-mute">
              عدد المسابقات: {filteredEduComps.length}
            </span>
          </div>

          {/* تفاصيل امتحان تربوي محدد */}
          {activeEduComp ? (
            <div className="card !rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div>
                  <h2 className="font-extrabold text-lg text-ink">{activeEduComp.name}</h2>
                  <p className="text-xs text-ink-mute mt-1">
                    الدرجة الكلية: <span className="font-bold">{activeEduComp.maxScore} درجة</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSaveEduResults}
                    disabled={savingEduResults}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    <span>إنهاء النتيجة</span>
                  </Button>
                  <button onClick={() => setActiveEduComp(null)} className="icon-btn rounded-lg text-ink-mute hover:text-ink">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {(activeEduComp.participants as any[])?.map((p: any) => {
                  const entry = eduScoreEntries.find((e) => e.studentId === p.studentId);
                  return (
                    <div
                      key={p.studentId}
                      className="flex items-center justify-between gap-4 bg-bg-alt/60 px-4 py-3 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-sm text-ink">{p.studentName}</p>
                        <p className="text-xs text-ink-mute font-mono">{p.nationalId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={activeEduComp.maxScore}
                          value={entry?.score ?? 0}
                          onChange={(e) => setEduScore(p.studentId, Number(e.target.value))}
                          className="field w-20 text-center py-1.5 font-bold text-sm"
                        />
                        <span className="text-xs text-ink-mute">/ {activeEduComp.maxScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3 border-t border-line">
                <Button
                  onClick={handleSaveEduResults}
                  disabled={savingEduResults}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 size={16} />
                  <span>إنهاء النتيجة وإعلانها</span>
                </Button>
              </div>
            </div>
          ) : (
            /* قائمة امتحانات التربوي */
            <>
              {loadingEdu ? (
                <Loader size="lg" />
              ) : filteredEduComps.length === 0 ? (
                <div className="card !rounded-2xl p-12 text-center text-ink-mute">
                  <GraduationCap size={40} className="mx-auto text-ink-mute/50 mb-3" />
                  <p className="font-bold text-lg">لا توجد مسابقات لهذه المجموعة</p>
                  <p className="text-xs mt-1">اضغط "مسابقة تربوية جديدة" لإنشاء مسابقة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEduComps.map((comp) => (
                    <div key={comp.id} className="card !rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="h-11 w-11 rounded-xl bg-brand-soft text-brand-ink flex items-center justify-center">
                            <Medal size={20} />
                          </div>
                          <button
                            onClick={() => handleDeleteComp(comp.id, comp.name)}
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-mute hover:text-danger-ink hover:bg-danger-soft rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <h3 className="font-extrabold text-lg text-ink">{comp.name}</h3>
                        <div className="mt-3 flex items-center gap-3 text-xs text-ink-soft">
                          <span>الدرجة الكلية: <span className="font-bold text-ink">{comp.maxScore}</span></span>
                          <span>{comp.participantsCount} طالب</span>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-line space-y-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                            comp.resultsPublished ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-bg-alt text-ink-mute"
                          }`}
                        >
                          {comp.resultsPublished ? "✅ النتائج معلنة" : "⏳ قيد التنظيم"}
                        </span>
                        <Button size="sm" onClick={() => openEduComp(comp)} className="w-full text-xs mt-2">
                          <Award size={14} className="ml-1" />
                          {comp.resultsPublished ? "تعديل النتائج" : "رصد الدرجات وإنهاء النتيجة"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── Modal: مسابقة قرآن جديدة ─── */}
      {showQuranModal && (
        <div className="modal-overlay">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-float border border-line">
            <h3 className="font-extrabold text-lg text-ink mb-4">إنشاء مسابقة قرآن جديدة</h3>
            <p className="text-xs text-ink-mute mb-5 bg-gold-soft/40 rounded-xl p-3">
              سيتم إضافة جميع طلاب حلقات القرآن تلقائيًا عند إنشاء المسابقة.
            </p>
            <form onSubmit={handleCreateQuranComp} className="space-y-4">
              <div>
                <label className="field-label">اسم المسابقة *</label>
                <input
                  required
                  value={quranForm.name}
                  onChange={(e) => setQuranForm({ ...quranForm, name: e.target.value })}
                  className="field"
                  placeholder="مثال: مسابقة الماهر بالقرآن"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">السنة *</label>
                  <input
                    required
                    value={quranForm.year}
                    onChange={(e) => setQuranForm({ ...quranForm, year: e.target.value })}
                    className="field font-mono"
                  />
                </div>
                <div>
                  <label className="field-label">الدرجة الكلية *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={quranForm.maxScore}
                    onChange={(e) => setQuranForm({ ...quranForm, maxScore: Number(e.target.value) })}
                    className="field font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowQuranModal(false)}>إلغاء</Button>
                <Button type="submit">إنشاء المسابقة</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: مسابقة تربوية جديدة ─── */}
      {showEduModal && (
        <div className="modal-overlay">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-float border border-line">
            <h3 className="font-extrabold text-lg text-ink mb-4">إنشاء مسابقة تربوية جديدة</h3>
            <p className="text-xs text-ink-mute mb-5 bg-brand-soft/40 rounded-xl p-3">
              سيتم إضافة جميع طلاب المجموعة التعليمية المختارة تلقائيًا.
            </p>
            <form onSubmit={handleCreateEduComp} className="space-y-4">
              <div>
                <label className="field-label">المجموعة التعليمية</label>
                <input
                  value={eduGroups.find((g) => g.id === selectedEduGroupId)?.name || ""}
                  readOnly
                  className="field bg-bg-alt text-ink-soft cursor-not-allowed"
                />
              </div>
              <div>
                <label className="field-label">اسم المسابقة / الاختبار *</label>
                <input
                  required
                  value={eduForm.name}
                  onChange={(e) => setEduForm({ ...eduForm, name: e.target.value })}
                  className="field"
                  placeholder="مثال: اختبار الفقه — الوحدة الأولى"
                />
              </div>
              <div>
                <label className="field-label">الدرجة الكلية *</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={eduForm.maxScore}
                  onChange={(e) => setEduForm({ ...eduForm, maxScore: Number(e.target.value) })}
                  className="field font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowEduModal(false)}>إلغاء</Button>
                <Button type="submit">إنشاء المسابقة</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
