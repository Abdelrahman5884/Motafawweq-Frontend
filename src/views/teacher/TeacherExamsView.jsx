import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_EXAMS } from '../../data/teacherData';
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Award, 
  HelpCircle, 
  FileText, 
  Eye, 
  X,
  Sparkles,
  BarChart3,
  TrendingUp,
  Download
} from 'lucide-react';

export const TeacherExamsView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [exams, setExams] = useState(TEACHER_EXAMS);
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'details'

  // Form State
  const [examTitle, setExamTitle] = useState('');
  const [examDuration, setExamDuration] = useState('45');
  const [examQuestionsCount, setExamQuestionsCount] = useState('30');
  const [examFullMark, setExamFullMark] = useState('60');

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!examTitle) return;

    const newExam = {
      id: `ex-${Date.now()}`,
      titleAr: examTitle,
      titleEn: examTitle,
      courseId: 'course-bio-301',
      courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
      questionsCount: Number(examQuestionsCount) || 20,
      durationMinutes: Number(examDuration) || 30,
      passScore: (Number(examFullMark) || 60) * 0.6,
      fullMark: Number(examFullMark) || 60,
      studentsSubmitted: 0,
      avgScore: 0,
      passRate: 100,
      status: 'active',
      dueDate: '2026-10-15',
      topScoreCount: 0,
      isBubbleSheet: true,
      questions: []
    };

    setExams([newExam, ...exams]);
    setSelectedExam(newExam);
    setShowCreateModal(false);
    setExamTitle('');
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
              <ClipboardList size={13} />
              <span>{lang === 'ar' ? 'التقييم الأكاديمي وبنك الأسئلة' : 'Assessment & Question Bank'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {lang === 'ar' ? 'بنك الأسئلة وصانع الاختبارات والكويزات' : 'Exam & Question Bank Manager'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {lang === 'ar' 
              ? 'إنشاء امتحانات البابل شيت، رصد نسب النجاح والتفوق، وتحليل استجابات الطلاب' 
              : 'Create bubble sheet exams, track pass rates, full marks, and analyze responses'}
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
          <span>{lang === 'ar' ? 'إنشاء اختبار بابل شيت' : 'Create Bubble Exam'}</span>
        </button>
      </div>

      {/* 4 Summary Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '26px'
      }}>
        {[
          { labelAr: 'إجمالي الاختبارات النشطة', val: exams.length, sub: 'شاملة كويزات الحصص', color: 'var(--primary)', icon: ClipboardList },
          { labelAr: 'إجمالي إجابات الطلاب المصححة', val: '6,240', sub: 'تصحيح إلكتروني فوري', color: '#10B981', icon: CheckCircle2 },
          { labelAr: 'الطلاب الحاصلين على Full Mark', val: '1,410', sub: 'معدل تفوق كامل 100%', color: '#F59E0B', icon: Award },
          { labelAr: 'متوسط درجات الطلاب العام', val: '86.4%', sub: 'مستوى استيعاب متقدم', color: '#8B5CF6', icon: TrendingUp }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '18px 20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {stat.labelAr}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {stat.val}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Exams List */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '22px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ClipboardList size={18} color="var(--primary)" />
            <span>{lang === 'ar' ? 'جدول الاختبارات والكويزات المنشورة' : 'Published Exams'}</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {exams.map(exam => {
              const isSelected = selectedExam?.id === exam.id;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-main)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: exam.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: exam.status === 'active' ? '#10B981' : '#D97706'
                    }}>
                      {exam.status === 'active' ? 'متاح للحل الآن' : 'مجدول'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      حتى {exam.dueDate}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '14.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 4px',
                    lineHeight: 1.4
                  }}>
                    {exam.titleAr}
                  </h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {exam.courseTitleAr}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                      <Clock size={13} />
                      <span>{exam.durationMinutes} دقيقة</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                      <HelpCircle size={13} />
                      <span>{exam.questionsCount} سؤال</span>
                    </div>

                    <div style={{ fontWeight: '800', color: '#10B981' }}>
                      {exam.studentsSubmitted.toLocaleString()} إجابة
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Exam Details & Questions Preview */}
        {selectedExam && (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  نظام البابل شيت الحديث
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => alert('جاري تحميل نموذج الإجابة وبابل شيت PDF المعتمد...')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                    <span>تحميل PDF</span>
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {selectedExam.titleAr}
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 18px' }}>
                {selectedExam.courseTitleAr} • الدرجة النهائية: {selectedExam.fullMark} درجة • درجة النجاح: {selectedExam.passScore}
              </p>

              {/* Performance Indicator Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#10B981' }}>
                    {selectedExam.passRate}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>نسبة الاجتياز</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)' }}>
                    {selectedExam.avgScore} / {selectedExam.fullMark}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>متوسط الدرجات</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#F59E0B' }}>
                    {selectedExam.topScoreCount}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>طلاب Full Mark</div>
                </div>
              </div>

              {/* Sample Questions from this Exam */}
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                {lang === 'ar' ? 'معاينة أسئلة الاختبار ونموذج الإجابة:' : 'Questions & Answer Key:'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(selectedExam.questions && selectedExam.questions.length > 0) ? (
                  selectedExam.questions.map((q) => (
                    <div
                      key={q.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                          سؤال {q.number} ({q.difficulty})
                        </span>
                        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
                          نسبة الحل الصحيح: {q.successRate}%
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {q.questionAr}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11.5px' }}>
                        {q.optionsAr.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              backgroundColor: optIdx === q.correctIndex ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                              color: optIdx === q.correctIndex ? '#10B981' : 'var(--text-secondary)',
                              border: optIdx === q.correctIndex ? '1px solid #10B981' : '1px solid transparent',
                              fontWeight: optIdx === q.correctIndex ? '800' : '500'
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}) {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanationAr && (
                        <div style={{
                          marginTop: '8px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(21, 136, 199, 0.06)',
                          fontSize: '11px',
                          color: 'var(--text-secondary)'
                        }}>
                          <strong>التفسير النموذجي: </strong>{q.explanationAr}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12.5px'
                  }}>
                    {lang === 'ar' ? 'تم توليد أسئلة الاختبار بنجاح في بنك الأسئلة المعتمد.' : 'Exam questions configured in repository.'}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Generator Button */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginTop: '16px' }}>
              <button
                onClick={() => alert('تم توليد 5 أسئلة مستويات تفكير عليا إضافية وإضافتها للاختبار!')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px dashed var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={14} />
                <span>{lang === 'ar' ? 'توليد أسئلة تفكير عليا إضافية بالذكاء الاصطناعي' : 'Generate AI Advanced Questions'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
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
            maxWidth: '520px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'إنشاء اختبار بابل شيت جديد' : 'New Bubble Exam'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'عنوان الاختبار أو الكويز:' : 'Exam Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: امتحان شامل على المناعة والبيولوجيا الجزيئية' : 'e.g. Molecular Genetics Exam'}
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المدة (دقيقة):' : 'Duration (mins):'}
                  </label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
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
                  <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'عدد الأسئلة:' : 'Questions:'}
                  </label>
                  <input
                    type="number"
                    value={examQuestionsCount}
                    onChange={(e) => setExamQuestionsCount(e.target.value)}
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
                  <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'الدرجة الكلية:' : 'Full Mark:'}
                  </label>
                  <input
                    type="number"
                    value={examFullMark}
                    onChange={(e) => setExamFullMark(e.target.value)}
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
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
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
                  {lang === 'ar' ? 'إنشاء وتفعيل الاختبار' : 'Create & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamsView;
