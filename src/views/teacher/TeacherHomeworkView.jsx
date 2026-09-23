import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_HOMEWORKS } from '../../data/teacherData';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Send, 
  Search, 
  X, 
  FileCheck,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const TeacherHomeworkView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [homeworks, setHomeworks] = useState(TEACHER_HOMEWORKS);
  const [selectedHw, setSelectedHw] = useState(homeworks[0]);
  const [activeSubmission, setActiveSubmission] = useState(selectedHw.submissions?.[0] || null);
  const [gradeInput, setGradeInput] = useState(activeSubmission?.score || '');
  const [feedbackInput, setFeedbackInput] = useState(activeSubmission?.feedbackAr || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Homework Form
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-02');
  const [newMaxGrade, setNewMaxGrade] = useState('20');

  const handleSelectSubmission = (sub) => {
    setActiveSubmission(sub);
    setGradeInput(sub.score || '');
    setFeedbackInput(sub.feedbackAr || '');
    setSavedSuccess(false);
  };

  const handleSaveGrading = (e) => {
    e.preventDefault();
    if (!activeSubmission) return;

    const updatedSub = {
      ...activeSubmission,
      status: 'graded',
      score: Number(gradeInput) || 20,
      feedbackAr: feedbackInput
    };

    setActiveSubmission(updatedSub);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateHw = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newHwObj = {
      id: `hw-${Date.now()}`,
      titleAr: newTitle,
      courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
      dueDate: newDueDate,
      totalAssigned: 2450,
      submittedCount: 0,
      gradedCount: 0,
      pendingGrading: 0,
      avgGrade: 0,
      maxGrade: Number(newMaxGrade) || 20,
      submissions: []
    };

    setHomeworks([newHwObj, ...homeworks]);
    setSelectedHw(newHwObj);
    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '32px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <FileText size={13} />
              <span>{lang === 'ar' ? 'التطبيقات والواجبات الأسبوعية' : 'Homework & Submissions'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {lang === 'ar' ? 'إدارة وتصحيح الواجبات المنزلية' : 'Homework Grading & Feedback'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {lang === 'ar' 
              ? 'متابعة حلول الطلاب للواجبات، التصحيح السريع، وإرسال التغذية الراجعة الفورية' 
              : 'Review student homework submissions, assign grades, and provide feedback'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إضافة واجب جديد' : 'New Assignment'}</span>
        </button>
      </div>

      {/* Main Grid: Homeworks list + Submissions review panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '24px'
      }}>
        {/* Left Column: Homeworks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 4px'
          }}>
            {lang === 'ar' ? 'قائمة الواجبات الأسبوعية' : 'Assignments List'}
          </h2>

          {homeworks.map(hw => {
            const isSelected = selectedHw?.id === hw.id;
            return (
              <div
                key={hw.id}
                onClick={() => {
                  setSelectedHw(hw);
                  setActiveSubmission(hw.submissions?.[0] || null);
                }}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {hw.courseTitleAr}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    تسليم {hw.dueDate}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: '0 0 12px',
                  lineHeight: 1.4
                }}>
                  {hw.titleAr}
                </h3>

                {/* Submission Progress bar */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>نسبة التسليم:</span>
                    <strong style={{ color: '#10B981' }}>
                      {hw.totalAssigned > 0 ? Math.round((hw.submittedCount / hw.totalAssigned) * 100) : 0}%
                    </strong>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--bg-main)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${hw.totalAssigned > 0 ? (hw.submittedCount / hw.totalAssigned) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: '#10B981',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)'
                }}>
                  <span>{hw.submittedCount} مسلّم</span>
                  <span>{hw.gradedCount} تم تصحيحه</span>
                  <span style={{ color: hw.pendingGrading > 0 ? '#EA580C' : 'var(--text-muted)', fontWeight: '700' }}>
                    {hw.pendingGrading} قيد الانتظار
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Submissions Inspector & Grading Desk */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  {selectedHw?.titleAr}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  إجمالي المسلّمين: {selectedHw?.submittedCount} طالب • الدرجة الكلية للواجب: {selectedHw?.maxGrade} درجة
                </div>
              </div>
            </div>

            {/* Students Submitted Horizontal / Pill Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {lang === 'ar' ? 'اختر الطالب لمراجعة تسليمه:' : 'Select Student Submission:'}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedHw?.submissions?.map((sub) => {
                  const isCur = activeSubmission?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        border: isCur ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: isCur ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-main)',
                        color: isCur ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: isCur ? '800' : '600'
                      }}
                    >
                      <img
                        src={sub.studentAvatar}
                        alt={sub.studentNameAr}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{sub.studentNameAr}</span>
                      {sub.status === 'graded' ? (
                        <CheckCircle2 size={13} color="#10B981" />
                      ) : (
                        <Clock size={13} color="#F59E0B" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Submission Details & Grading Form */}
            {activeSubmission ? (
              <div style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={activeSubmission.studentAvatar}
                      alt={activeSubmission.studentNameAr}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {activeSubmission.studentNameAr}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {activeSubmission.schoolAr} • وقت التسليم: {activeSubmission.submittedAt}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: activeSubmission.status === 'graded' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    color: activeSubmission.status === 'graded' ? '#10B981' : '#D97706',
                    fontSize: '11.5px',
                    fontWeight: '800'
                  }}>
                    {activeSubmission.status === 'graded' ? 'تم الرصد والاعتماد' : 'قيد المراجعة'}
                  </span>
                </div>

                {/* Uploaded File Attachment Preview */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={18} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {activeSubmission.attachments?.[0] || 'ورقة_إجابة_الواجب.pdf'}
                    </span>
                  </div>
                  <button
                    onClick={() => alert('جاري فتح ملف إجابة الطالب للمعاينة...')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      border: '1px solid rgba(21, 136, 199, 0.3)',
                      color: 'var(--primary)',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    معاينة الحل
                  </button>
                </div>

                {/* Grading Form */}
                <form onSubmit={handleSaveGrading} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      الدرجة المستحقة (من {selectedHw?.maxGrade}):
                    </label>
                    <input
                      type="number"
                      max={selectedHw?.maxGrade}
                      min="0"
                      required
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      placeholder={`أدخل الدرجة (الحد الأقصى ${selectedHw?.maxGrade})`}
                      style={{
                        width: '180px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontWeight: '800',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      ملاحظات وتوجيهات المعلم للطالب (تظهر في حسابه فوراً):
                    </label>
                    <textarea
                      rows="3"
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="اكتب تعليقك وتوجيهاتك للطالب على نقاط القوة أو الأخطاء..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    {savedSuccess ? (
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> تم رصد الدرجة وإرسال الملاحظة للطالب بنجاح!
                      </span>
                    ) : <span />}

                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
                      }}
                    >
                      <Send size={14} />
                      <span>اعتماد الدرجة والتصحيح</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }}>
                لا توجد تسليمات جديدة قيد الانتظار لهذا الواجب حالياً.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create New Homework Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  إضافة واجب وتطبيق أسبوعي جديد
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  عنوان الواجب أو التمرين:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: واجب الدرس 4 - مسائل اتزان معادلات كالفن"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    آخر موعد للتسليم:
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    الدرجة العظمى:
                  </label>
                  <input
                    type="number"
                    value={newMaxGrade}
                    onChange={(e) => setNewMaxGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  نشر الواجب للطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHomeworkView;
