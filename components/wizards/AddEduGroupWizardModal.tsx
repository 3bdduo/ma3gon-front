"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  User,
  Phone,
  Clock,
  IdCard,
  BookMarked,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { eduGroupsApi } from "@/lib/resources";
import { isEgyptianName, isPhone, normalizeDigits } from "@/lib/validation";
import { parseEgyptianNationalId, generateRandomPassword } from "@/lib/egyptianNid";

interface AddEduGroupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEduGroupWizardModal({
  isOpen,
  onClose,
  onSuccess,
}: AddEduGroupWizardModalProps) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // الخطوات: 1: اسم المجموعة، 2: اسم المعلم، 3: الرقم القومي، 4: الهاتف، 5: كلمة المرور، 6: النجاح
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const [groupName, setGroupName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // تحليل الرقم القومي
  const nidAnalysis = parseEgyptianNationalId(nationalId);

  // التحقق من صحة الاسم رباعي
  const isTeacherNameValid = isEgyptianName(teacherName);
  const teacherNameParts = teacherName.trim().split(/\s+/).filter(Boolean);

  // اسم المجموعة صالح لو فيه 3 حروف على الأقل
  const isGroupNameValid = groupName.trim().length >= 3;

  // التحقق من الهاتف
  const isPhoneValid = !phone || isPhone(phone);

  // التركيز التلقائي
  useEffect(() => {
    if (isOpen && currentStep <= totalSteps) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [currentStep, isOpen]);

  // إعادة تعيين النموذج عند الفتح
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setGroupName("");
      setTeacherName("");
      setNationalId("");
      setPhone("");
      setPassword(generateRandomPassword());
      setCreatedGroup(null);
      setCopiedField(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`تم نسخ ${fieldName} بنجاح`, "success");
    setTimeout(() => setCopiedField(null), 2500);
  };

  // التحقق قبل الانتقال للخطوة التالية
  const canGoNext = () => {
    if (currentStep === 1) return isGroupNameValid;
    if (currentStep === 2) return isTeacherNameValid;
    if (currentStep === 3) return nidAnalysis.valid;
    if (currentStep === 4) return isPhoneValid;
    if (currentStep === 5) return password.length >= 6;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep <= totalSteps) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const res = await eduGroupsApi.create({
        name: groupName.trim(),
        teacherName: teacherName.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim() || undefined,
        teacherPassword: password,
      });

      setCreatedGroup({
        ...res,
        plainPassword: password,
        teacherName: teacherName.trim(),
        groupName: groupName.trim(),
      });
      setCurrentStep(6); // شاشة النجاح
      onSuccess();
      showToast("تم إنشاء المجموعة التربوية وحساب المعلم بنجاح", "success");
    } catch (err: any) {
      showToast(err.message || "فشل إنشاء المجموعة، يرجى التحقق من البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canGoNext()) {
        handleNext();
      }
    }
  };

  const stepLabels = ["اسم المجموعة", "اسم المعلم", "الرقم القومي", "الهاتف", "كلمة المرور"];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && currentStep !== 6) onClose();
      }}
    >
      <div className="bg-surface rounded-3xl w-full max-w-lg shadow-float border border-line relative overflow-hidden my-auto">
        {/* شريط العنوان والإغلاق */}
        <div className="p-5 sm:p-6 pb-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand-ink flex items-center justify-center font-bold">
              <BookMarked size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-ink">إنشاء مجموعة تربوي جديدة</h2>
              <p className="text-xs text-ink-mute">
                {currentStep <= totalSteps
                  ? `الخطوة ${currentStep} من ${totalSteps}: خطوة بخطوة لدقة البيانات`
                  : "تم الإنشاء بنجاح"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-btn rounded-xl text-ink-mute hover:text-ink hover:bg-bg-alt transition-colors"
          >
            <X size={19} />
          </button>
        </div>

        {/* مؤشر التقدم */}
        {currentStep <= totalSteps && (
          <div className="px-6 pt-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-ink-mute mb-1.5">
              {stepLabels.map((label, i) => (
                <span key={i} className={currentStep >= i + 1 ? "text-brand-ink" : ""}>
                  {label}
                </span>
              ))}
            </div>
            <div className="h-1.5 bg-bg-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-ink transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* محتوى الخطوات */}
        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {/* ── الخطوة 1: اسم مجموعة التربوي ── */}
            {currentStep === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <BookMarked size={16} className="text-brand-ink" />
                      <span>اسم مجموعة التربوي *</span>
                    </label>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isGroupNameValid
                          ? "bg-brand-soft text-brand-ink"
                          : "bg-bg-alt text-ink-mute"
                      }`}
                    >
                      {groupName.trim().length} حرف
                    </span>
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="مثال: مجموعة التربوي - شباب (1)"
                    className="field !text-base sm:!text-lg font-bold py-3.5"
                    dir="rtl"
                  />
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5 transition-colors ${
                    isGroupNameValid
                      ? "bg-brand-soft/60 text-brand-ink border border-brand/25"
                      : "bg-brand-soft/40 text-ink-soft border border-brand-soft"
                  }`}
                >
                  {isGroupNameValid ? (
                    <CheckCircle2 size={18} className="text-brand-ink shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-brand-ink shrink-0 mt-0.5" />
                  )}
                  <div>
                    {isGroupNameValid ? (
                      <p className="font-bold">اسم المجموعة جاهز، اضغط &quot;التالي&quot; للمتابعة.</p>
                    ) : (
                      <p>
                        أدخل اسماً واضحاً للمجموعة التربوية (3 أحرف على الأقل)، مثال:{" "}
                        <strong>مجموعة شباب 1</strong> أو <strong>مجموعة بنات - الإعدادي</strong>.
                      </p>
                    )}
                  </div>
                </div>
              </m.div>
            )}

            {/* ── الخطوة 2: اسم المعلم رباعي ── */}
            {currentStep === 2 && (
              <m.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <User size={16} className="text-brand-ink" />
                      <span>اسم المعلم رباعي باللغة العربية *</span>
                    </label>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isTeacherNameValid
                          ? "bg-brand-soft text-brand-ink"
                          : "bg-bg-alt text-ink-mute"
                      }`}
                    >
                      {teacherNameParts.length} / 4 كلمات
                    </span>
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="مثال: عبد الرحمن محمد السيد علي"
                    className="field !text-base sm:!text-lg font-bold py-3.5"
                    dir="rtl"
                  />
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5 transition-colors ${
                    isTeacherNameValid
                      ? "bg-brand-soft/60 text-brand-ink border border-brand/25"
                      : "bg-brand-soft/40 text-ink-soft border border-brand-soft"
                  }`}
                >
                  {isTeacherNameValid ? (
                    <CheckCircle2 size={18} className="text-brand-ink shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-brand-ink shrink-0 mt-0.5" />
                  )}
                  <div>
                    {isTeacherNameValid ? (
                      <p className="font-bold">الاسم رباعي وصحيح، اضغط &quot;التالي&quot; للمتابعة.</p>
                    ) : (
                      <p>
                        يجب إدخال الاسم كاملاً (<strong>رباعي على الأقل</strong>) باللغة العربية
                        فقط وبدون أرقام أو رموز خاصة.
                      </p>
                    )}
                  </div>
                </div>
              </m.div>
            )}

            {/* ── الخطوة 3: الرقم القومي ── */}
            {currentStep === 3 && (
              <m.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <IdCard size={16} className="text-brand-ink" />
                      <span>الرقم القومي للمعلم (14 رقم) *</span>
                    </label>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                        nidAnalysis.valid
                          ? "bg-brand-soft text-brand-ink"
                          : "bg-bg-alt text-ink-mute"
                      }`}
                    >
                      {normalizeDigits(nationalId).replace(/\D/g, "").length} / 14
                    </span>
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={14}
                    value={nationalId}
                    onChange={(e) =>
                      setNationalId(normalizeDigits(e.target.value).replace(/\D/g, ""))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="2950101XXXXXXX"
                    className="field !text-base sm:!text-lg font-mono font-bold tracking-wider py-3.5"
                    dir="ltr"
                  />
                </div>

                {nidAnalysis.valid && nidAnalysis.data ? (
                  <m.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-brand-soft/50 border border-brand/25 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-brand-ink font-bold text-xs pb-2 border-b border-brand/20">
                      <CheckCircle2 size={15} />
                      <span>بيانات تم استخراجها تلقائياً من الرقم القومي:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="flex items-center gap-2 bg-surface/80 p-2 rounded-xl border border-line">
                        <Calendar size={14} className="text-brand-ink shrink-0" />
                        <div>
                          <span className="text-ink-mute block text-[10px]">تاريخ الميلاد</span>
                          <span className="font-bold text-ink">
                            {nidAnalysis.data.birthDateFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-surface/80 p-2 rounded-xl border border-line">
                        <Clock size={14} className="text-brand-ink shrink-0" />
                        <div>
                          <span className="text-ink-mute block text-[10px]">السن الآن</span>
                          <span className="font-bold text-ink">{nidAnalysis.data.age} سنة</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-surface/80 p-2 rounded-xl border border-line">
                        <MapPin size={14} className="text-brand-ink shrink-0" />
                        <div>
                          <span className="text-ink-mute block text-[10px]">المحافظة</span>
                          <span className="font-bold text-ink">
                            {nidAnalysis.data.governorateName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-surface/80 p-2 rounded-xl border border-line">
                        <User size={14} className="text-brand-ink shrink-0" />
                        <div>
                          <span className="text-ink-mute block text-[10px]">النوع</span>
                          <span className="font-bold text-ink">{nidAnalysis.data.gender}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-brand-ink pt-1 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>إذا كانت هذه البيانات صحيحة، اضغط &quot;التالي&quot; للمتابعة.</span>
                    </p>
                  </m.div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-bg-alt/70 border border-line text-xs text-ink-mute flex items-start gap-2.5">
                    <AlertCircle size={17} className="shrink-0 mt-0.5 text-ink-soft" />
                    <div>
                      {nationalId.length > 0 && nidAnalysis.error ? (
                        <span className="text-danger-ink font-bold">{nidAnalysis.error}</span>
                      ) : (
                        <span>
                          أدخل 14 رقماً للرقم القومي المصري، وسيتم فحص صحته واستخراج بيانات
                          المعلم فوراً.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </m.div>
            )}

            {/* ── الخطوة 4: رقم الهاتف ── */}
            {currentStep === 4 && (
              <m.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <Phone size={16} className="text-brand-ink" />
                      <span>رقم هاتف المعلم (اختياري)</span>
                    </label>
                    <span className="text-xs text-ink-mute font-medium">شبكات مصرية فقط</span>
                  </div>

                  <input
                    ref={inputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(normalizeDigits(e.target.value))}
                    onKeyDown={handleKeyDown}
                    placeholder="010XXXXXXXX"
                    className="field !text-base sm:!text-lg font-mono font-bold py-3.5 text-right"
                    dir="ltr"
                  />
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5 ${
                    phone && !isPhoneValid
                      ? "bg-danger-soft text-danger-ink border border-danger-soft"
                      : "bg-bg-alt/70 text-ink-mute border border-line"
                  }`}
                >
                  <AlertCircle size={17} className="shrink-0 mt-0.5 text-brand-ink" />
                  <div>
                    {phone && !isPhoneValid ? (
                      <p className="font-bold">
                        رقم الهاتف غير صحيح — يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من
                        11 رقماً.
                      </p>
                    ) : (
                      <p>
                        يمكنك إدخال رقم هاتف المعلم للتواصل، أو تركه فارغاً والضغط على{" "}
                        <strong>&quot;تخطي&quot;</strong> للمتابعة.
                      </p>
                    )}
                  </div>
                </div>
              </m.div>
            )}

            {/* ── الخطوة 5: كلمة المرور ── */}
            {currentStep === 5 && (
              <m.div
                key="step5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <KeyRound size={15} className="text-brand-ink" />
                      <span>كلمة مرور حساب المعلم *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPassword(generateRandomPassword())}
                      className="text-xs text-brand-ink font-bold hover:underline"
                    >
                      توليد عشوائي
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      ref={inputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      className="field !pl-20 !text-base font-mono font-bold"
                    />

                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="icon-btn rounded-lg text-ink-mute hover:text-ink"
                        title={showPassword ? "إخفاء" : "إظهار"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(password, "كلمة المرور")}
                        className="p-1.5 text-ink-mute hover:text-brand-ink rounded-lg"
                        title="نسخ كلمة المرور"
                      >
                        {copiedField === "كلمة المرور" ? (
                          <Check size={16} className="text-brand-ink" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-ink-mute mt-1.5">
                    الحد الأدنى 6 أحرف. يمكنك نسخها وإرسالها للمعلم بعد اكتمال الإنشاء.
                  </p>
                </div>

                {/* ملاحظة username تلقائي */}
                <div className="p-3.5 bg-brand-soft/50 rounded-2xl border border-brand-soft/60 text-xs text-brand-ink/90 leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-brand shrink-0 mt-0.5" />
                  <span>
                    سيتم تلقائياً توليد <strong>اسم مستخدم (Username)</strong> باللغة الإنجليزية
                    بناءً على اسم المعلم، وسيقوم المعلم بالدخول به عبر صفحة تسجيل الدخول لاختيار
                    الطلاب وتسجيل الحضور.
                  </span>
                </div>
              </m.div>
            )}

            {/* ── الخطوة 6: شاشة النجاح ── */}
            {currentStep === 6 && createdGroup && (
              <m.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 text-center py-2"
              >
                <div className="w-16 h-16 rounded-full bg-brand-soft text-brand-ink dark:text-brand-strong mx-auto flex items-center justify-center mb-2 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-ink">تم إنشاء المجموعة بنجاح!</h3>
                  <p className="text-xs text-ink-mute mt-1">
                    تم إنشاء حساب المعلم وتوليد اسم المستخدم للدخول تلقائياً
                  </p>
                </div>

                {/* كارت بيانات الدخول */}
                <div className="bg-bg-alt/70 border border-line rounded-2xl p-4 text-right space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs">
                    <span className="text-ink-mute">المجموعة:</span>
                    <span className="font-extrabold text-ink">{createdGroup.name || createdGroup.groupName}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs">
                    <span className="text-ink-mute">اسم المعلم:</span>
                    <span className="font-extrabold text-ink">
                      {createdGroup.teacherName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs">
                    <span className="text-ink-mute">اسم المستخدم (Username):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-brand-ink text-sm">
                        {createdGroup.teacherUsername}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(createdGroup.teacherUsername, "اسم المستخدم")
                        }
                        className="p-1 hover:bg-brand-soft rounded-lg text-ink-mute hover:text-brand-ink transition-colors"
                        title="نسخ اسم المستخدم"
                      >
                        {copiedField === "اسم المستخدم" ? (
                          <Check size={14} className="text-brand-ink" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-mute">كلمة المرور (Password):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-ink text-sm">
                        {createdGroup.plainPassword}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(createdGroup.plainPassword, "كلمة المرور")
                        }
                        className="p-1 hover:bg-brand-soft rounded-lg text-ink-mute hover:text-brand-ink transition-colors"
                        title="نسخ كلمة المرور"
                      >
                        {copiedField === "كلمة المرور" ? (
                          <Check size={14} className="text-brand-ink" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* زر نسخ الكل للواتساب */}
                <Button
                  onClick={() => {
                    const username = createdGroup.teacherUsername || "";
                    const message = `مرحباً أستاذ ${createdGroup.teacherName}، تم إنشاء حسابكم على منصة مدرسة القرآن الكريم بنجاح:\n- المجموعة: ${createdGroup.name || createdGroup.groupName}\n- اسم المستخدم: ${username}\n- كلمة المرور: ${createdGroup.plainPassword}`;
                    copyToClipboard(message, "بيانات الدخول كاملة");
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>نسخ بيانات الدخول كاملة (للإرسال بالواتساب)</span>
                </Button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* أزرار التنقل */}
        <div className="p-4 sm:p-6 pt-3 border-t border-line flex items-center justify-between bg-surface/50">
          {currentStep <= totalSteps ? (
            <>
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack} disabled={loading} className="gap-1.5">
                  <ArrowRight size={16} />
                  <span>السابق</span>
                </Button>
              ) : (
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  إلغاء
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={!canGoNext() || loading}
                loading={loading}
                className="gap-1.5"
              >
                <span>
                  {currentStep === totalSteps
                    ? "إتمام الإنشاء"
                    : currentStep === 4 && !phone
                    ? "تخطي"
                    : "التالي"}
                </span>
                <ArrowLeft size={16} />
              </Button>
            </>
          ) : (
            <div className="w-full flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setGroupName("");
                  setTeacherName("");
                  setNationalId("");
                  setPhone("");
                  setPassword(generateRandomPassword());
                  setCreatedGroup(null);
                }}
                className="flex-1"
              >
                إنشاء مجموعة أخرى
              </Button>
              <Button onClick={onClose} className="flex-1">
                تم وإغلاق
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
