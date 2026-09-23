import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_ANALYTICS } from '../../data/teacherData';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  Sparkles,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const TeacherAnalyticsView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const [selectedCourse, setSelectedCourse] = useState('all');
  const [remedialGenerated, setRemedialGenerated] = useState(false);
  const [alertSentId, setAlertSentId] = useState(null);

  const analytics = TEACHER_ANALYTICS;

  const handleGenerateRemedial = () => {
    setRemedialGenerated(true);
    setTimeout(() => setRemedialGenerated(false), 4000);
  };

  const handleSendIntervention = (id) => {
    setAlertSentId(id);
    setTimeout(() => setAlertSentId(null), 3000);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <BarChart3 size={13} />
              <span>{lang === 'ar' ? 'تشخيص التحصيل الأكاديمي والذكاء الاصطناعي' : 'Academic Analytics & AI Diagnostics'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            {lang === 'ar' ? 'مركز التحليلات ونقاط الضعف والمتابعة الدقيقة' : 'Analytics & Weakness Diagnostics'}
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {lang === 'ar'
              ? 'مراقبة أداء 4,120 طالباً، واكتشاف المفاهيم الصعبة، وتقديم توصيات ذكية لمنع التعثر الدراسي'
              : 'Monitor student performance across 4,120 enrolled students, detect weak topics, and intervene proactively.'}
          </p>
        </div>

        {/* Filter & AI Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
              border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">{lang === 'ar' ? 'جميع الكورسات والمراحل' : 'All Courses & Stages'}</option>
            <option value="sec3">{lang === 'ar' ? 'الأحياء - 3 ثانوي' : 'Biology - 3rd Sec'}</option>
            <option value="sec2">{lang === 'ar' ? 'الأحياء - 2 ثانوي' : 'Biology - 2nd Sec'}</option>
            <option value="prep3">{lang === 'ar' ? 'العلوم - 3 إعدادي' : 'Sciences - 3rd Prep'}</option>
          </select>

          <button
            onClick={handleGenerateRemedial}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} />
            <span>{remedialGenerated ? (lang === 'ar' ? 'تم إنشاء كويز علاجي!' : 'Quiz Generated!') : (lang === 'ar' ? 'توليد كويز علاجي بالذكاء الاصطناعي' : 'Generate AI Remedial Quiz')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '18px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'متوسط درجات الطلاب العامة' : 'Average Student GPA'}
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {analytics.overallGpa}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>
            +3.8% {lang === 'ar' ? 'مقارنة بالشهر السابق' : 'vs last month'}
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '18px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'إجمالي الطلاب الخاضعين للتحليل' : 'Audited Students'}
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {analytics.totalStudentsAudited.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'بين سناتر القاهرة والأكاديمية الإلكترونية' : 'Across centers and online platform'}
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '18px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'نسبة الالتزام بالحضور والمشاهدة' : 'Attendance & Engagement'}
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {analytics.averageAttendancePct}%
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>
            {lang === 'ar' ? 'مستوى انضباط استثنائي ومستقر' : 'Exceptional discipline level'}
          </div>
        </div>

        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '18px',
          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>
              {lang === 'ar' ? 'طلاب بحاجة لتدخل فوري' : 'At-Risk Students'}
            </span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#EF4444', marginBottom: '4px' }}>
            {analytics.atRiskStudents.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'غياب متكرر أو هبوط درجات الاختبارات' : 'Recurring absences or dropped marks'}
          </div>
        </div>
      </div>

      {/* Grid: Most Missed Questions & At-Risk Radar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(540px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Most Missed Questions */}
        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BrainCircuit size={19} color="#8B5CF6" />
                <span>{lang === 'ar' ? 'المفاهيم الشائعة والأسئلة الأكثر خطأً' : 'Top Missed Topics & Concepts'}</span>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar' ? 'تحليل ذكي للأسئلة التي تعثر فيها الطلاب بنسبة تفوق 30%' : 'AI analysis of items with >30% student error rate'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.mostMissedQuestions.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                  border: `1px solid ${isDark ? 'var(--border-subtle)' : '#EDF2F7'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.16)' : 'rgba(139, 92, 246, 0.1)',
                      color: '#8B5CF6',
                      marginBottom: '6px'
                    }}>
                      {q.topicAr}
                    </span>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {q.questionAr}
                    </h3>
                  </div>

                  <div style={{
                    minWidth: '60px',
                    textAlign: 'center',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    backgroundColor: q.errorRatePct > 40 ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2') : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7'),
                    color: q.errorRatePct > 40 ? '#EF4444' : '#D97706',
                    fontWeight: '900',
                    fontSize: '13px'
                  }}>
                    {q.errorRatePct}%
                    <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.85 }}>
                      {lang === 'ar' ? 'نسبة الخطأ' : 'Error rate'}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '10px',
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FFFFFF',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`
                }}>
                  <strong style={{ color: '#F59E0B' }}>{lang === 'ar' ? 'السبب الشائع: ' : 'Common error: '}</strong>
                  {q.commonMistakeAr}
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#10B981',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <Sparkles size={15} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <div>
                    <strong>{lang === 'ar' ? 'توصية الذكاء الاصطناعي للمحاضرة: ' : 'AI Teaching Advice: '}</strong>
                    {q.aiRecommendationAr}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Students Radar */}
        <div style={{
          backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={19} color="#EF4444" />
                <span>{lang === 'ar' ? 'رادار التدخل ومنع التعثر (At-Risk)' : 'At-Risk Intervention Radar'}</span>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar' ? 'تنبيه تلقائي للطلاب الذين هبطت درجاتهم أو تكرر غيابهم' : 'Automatic early warning for students needing immediate attention'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.atRiskStudents.map((std) => (
              <div
                key={std.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.04)' : '#FEF2F2',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                      {std.nameAr}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {std.groupAr} • {std.gradeAr}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendIntervention(std.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '10px',
                      backgroundColor: alertSentId === std.id ? '#10B981' : '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {alertSentId === std.id ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>{lang === 'ar' ? 'تم إرسال التنبيه' : 'Alert Sent'}</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={14} />
                        <span>{lang === 'ar' ? 'تواصل وتنبيه ولي الأمر' : 'Notify Parent'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Metrics */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '10px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#FFFFFF',
                    color: '#EF4444'
                  }}>
                    {lang === 'ar' ? 'نسبة الحضور: ' : 'Attendance: '} {std.attendancePct}%
                  </div>

                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#FFFFFF',
                    color: '#EF4444'
                  }}>
                    {lang === 'ar' ? 'متوسط الاختبارات: ' : 'Avg Exams: '} {std.avgExamScore}%
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  lineHeight: '1.4'
                }}>
                  <strong style={{ color: '#EF4444' }}>{lang === 'ar' ? 'سبب التحذير: ' : 'Reason: '}</strong>
                  {std.alertReasonAr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centers & Group Comparative Matrix */}
      <div style={{
        backgroundColor: isDark ? 'var(--bg-card)' : '#FFFFFF',
        borderRadius: '20px',
        border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`,
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{
          fontSize: '17px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0'
        }}>
          {lang === 'ar' ? 'مقارنة فروع السناتر والأكاديمية الإلكترونية' : 'Centers & Online Groups Benchmark'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
          {lang === 'ar' ? 'مقارنة متوسطات التحصيل ونسب الحضور والانضباط عبر مختلف الفروع' : 'Cross-center performance comparison for Dr. Salma El-Sayed'}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '18px',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
          }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'سنتر الدقي النخبة' : 'Dokki Elite Center'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              1,250 {lang === 'ar' ? 'طالب مسجل' : 'students'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'متوسط الامتحان' : 'Avg Exam'}:</span>
              <strong style={{ color: '#10B981' }}>87.4%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نسبة الحضور' : 'Attendance'}:</span>
              <strong style={{ color: '#3B82F6' }}>94.2%</strong>
            </div>
          </div>

          <div style={{
            padding: '18px',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
          }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'سنتر الرواد بمدينة نصر' : 'Nasr City Center'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              980 {lang === 'ar' ? 'طالب مسجل' : 'students'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'متوسط الامتحان' : 'Avg Exam'}:</span>
              <strong style={{ color: '#10B981' }}>83.8%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نسبة الحضور' : 'Attendance'}:</span>
              <strong style={{ color: '#3B82F6' }}>91.0%</strong>
            </div>
          </div>

          <div style={{
            padding: '18px',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
            border: `1px solid ${isDark ? 'var(--border-subtle)' : '#E2E8F0'}`
          }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'أكاديمية المتفوق الإلكترونية (أونلاين)' : 'Online Motafawweq Platform'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              1,890 {lang === 'ar' ? 'طالب مسجل' : 'students'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'متوسط الامتحان' : 'Avg Exam'}:</span>
              <strong style={{ color: '#10B981' }}>82.1%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نسبة الحضور' : 'Attendance'}:</span>
              <strong style={{ color: '#3B82F6' }}>92.8%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
