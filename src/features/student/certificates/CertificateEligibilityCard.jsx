import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  BookOpenCheck,
  Trophy,
  Award,
  Loader2,
} from 'lucide-react';

export const CertificateEligibilityCard = ({
  lang = 'ar',
  eligibility = null,
  claimingCourseId = null,
  onClaimCourse,
}) => {
  const isAr = lang === 'ar';

  const teacherData = eligibility?.teacher || {};
  const ministryData = eligibility?.ministry || {};
  const leagueData = eligibility?.league || {};

  const teacherEligible = Boolean(teacherData.eligible);
  const ministryEligible = Boolean(ministryData.eligible);
  const leagueEligible = Boolean(leagueData.eligible);
  const claimableCourses = Array.isArray(teacherData.claimableCourses)
    ? teacherData.claimableCourses
    : [];

  const completedCourses = Number(teacherData.progressValue ?? 0);
  const totalCourses = Number(teacherData.totalCourses ?? 0);
  const highExams = Number(ministryData.progressValue ?? 0);
  const bestRank = leagueData.progressValue !== null && leagueData.progressValue !== undefined
    ? Number(leagueData.progressValue)
    : null;

  const tracks = [
    {
      id: 'teacher',
      eligible: teacherEligible,
      trackNum: isAr ? 'المسار 01' : 'Track 01',
      trackBadge: isAr ? 'مقررات المعلمين المعتمدين' : 'Certified Teacher Courses',
      title: isAr
        ? 'إتمام المقررات التخصصية للمعلم المشرف'
        : 'Completion of Specialized Educator Courses',
      requirement: isAr
        ? 'إتمام 100% من الحصص المنشورة في المقرر الدراسي للاستحقاق المباشر لشهادة إتمام معتمدة وموثّقة.'
        : 'Complete 100% of published lessons in an enrolled course to earn an official verified certificate.',
      status: teacherEligible
        ? isAr
          ? `مستوفى الشروط • أتممت ${completedCourses} ${totalCourses > 0 ? `من ${totalCourses}` : ''} مقرر`
          : `Criteria Met • ${completedCourses}${totalCourses > 0 ? ` / ${totalCourses}` : ''} courses completed`
        : isAr
          ? `قيد التقدم • أكمل دروس مقرر بنسبة 100% (${completedCourses}/${totalCourses || 1})`
          : `In Progress • Complete 100% of a course (${completedCourses}/${totalCourses || 1})`,
      icon: UserCheck,
    },
    {
      id: 'ministry',
      eligible: ministryEligible,
      trackNum: isAr ? 'المسار 02' : 'Track 02',
      trackBadge: isAr ? 'الاختبارات التقييمية المعتمدة' : 'Accredited Platform Exams',
      title: isAr
        ? 'اجتياز الاختبارات الرسمية بنسبة تفوق 80%+'
        : 'Passing Accredited Exams with 80%+ Score',
      requirement: isAr
        ? 'اجتياز الاختبارات المُصحّحة على المنصة بنسبة لا تقل عن 80% لتأهيلك لشهادات التفوق الأكاديمي.'
        : 'Pass graded platform examinations with a score of 80% or higher to qualify for excellence credentials.',
      status: ministryEligible
        ? isAr
          ? `مستوفى الشروط • اجتزت ${highExams} اختبار بنسبة 80%+`
          : `Criteria Met • ${highExams} exam(s) scored 80%+`
        : isAr
          ? 'قيد التقدم • اجتز اختباراً مُصحّحاً بنسبة 80% فأكثر'
          : 'In Progress • Score 80%+ on a graded exam',
      icon: BookOpenCheck,
    },
    {
      id: 'league',
      eligible: leagueEligible,
      trackNum: isAr ? 'المسار 03' : 'Track 03',
      trackBadge: isAr ? 'بطولات دوري المتفوقين' : 'Student Honors Leagues',
      title: isAr
        ? 'الصدارة ضمن العشرة الأوائل (Top 10)'
        : 'Ranking Within the Top 10 Standings',
      requirement: isAr
        ? 'تحقيق نقاط فعلية والتواجد ضمن قائمة العشرة الأوائل (Top 10) في دوري المقرر أو دوري الجمهورية العام.'
        : 'Earn league points and place within the Top 10 in a course league or the General Republic League.',
      status: leagueEligible
        ? isAr
          ? `مستوفى الشروط • أفضل مركز حققته #${bestRank}`
          : `Criteria Met • Best Rank #${bestRank}`
        : isAr
          ? 'قيد التقدم • احصد نقاطاً ونافس لدخول Top 10'
          : 'In Progress • Earn points to enter the Top 10',
      icon: Trophy,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '22px',
        padding: '24px 26px',
        boxShadow: 'var(--shadow-sm)',
        direction: isAr ? 'rtl' : 'ltr',
        fontFamily: isAr ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-latin), "Inter", sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '11px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: isAr ? '0' : '0.5px',
                marginBottom: '2px',
              }}
            >
              {isAr ? 'معايير الاعتماد الرسمي' : 'Official Accreditation Standards'}
            </div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {isAr ? 'ضوابط ومعايير استحقاق الشهادات المعتمدة' : 'Certificate Eligibility Standards'}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.6 }}>
          {isAr
            ? 'تخضع كل شهادة لتوثيق رقمي مشفّر (HMAC-SHA256) برقم تسلسلي وكود QR قابل للتحقق الفوري عبر 3 مسارات أكاديمية:'
            : 'Every certificate is cryptographically authenticated with a unique serial ID and scannable QR verification across 3 academic tracks:'}
        </p>
      </div>

      {/* 3 Tracks Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 275px), 1fr))',
          gap: '16px',
        }}
      >
        {tracks.map((track) => {
          const IconComponent = track.icon;
          return (
            <div
              key={track.id}
              style={{
                backgroundColor: 'var(--bg-app)',
                border: track.eligible
                  ? '1.5px solid rgba(21, 136, 199, 0.42)'
                  : '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '900',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: track.eligible ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: track.eligible ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    >
                      {track.trackNum}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                      {track.trackBadge}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={16} />
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '14.5px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0',
                    lineHeight: 1.35,
                  }}
                >
                  {track.title}
                </h3>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {track.requirement}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: track.eligible ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                  color: track.eligible ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  border: track.eligible
                    ? '1px solid rgba(21, 136, 199, 0.28)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                {track.eligible ? (
                  <CheckCircle2 size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                ) : (
                  <Clock size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                )}
                <span>{track.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ready-to-Claim 100% Completed Courses */}
      {claimableCourses.length > 0 && (
        <div
          style={{
            marginTop: '18px',
            padding: '16px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(21, 136, 199, 0.07)',
            border: '1.5px solid rgba(21, 136, 199, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
            <Award size={18} color="var(--primary)" />
            <span>
              {isAr
                ? `مقررات مكتملة 100% جاهزة لإصدار شهادتك المعتمدة (${claimableCourses.length})`
                : `100% Completed Courses Ready to Issue (${claimableCourses.length})`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {claimableCourses.map((course) => {
              const isClaiming = claimingCourseId === course.courseId;
              return (
                <div
                  key={course.courseId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {isAr ? course.titleAr : course.titleEn || course.titleAr}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {course.teacherName} •{' '}
                      {isAr
                        ? `أتممت ${course.completedLessons} من ${course.totalLessons} حصة (100%)`
                        : `${course.completedLessons}/${course.totalLessons} lessons completed (100%)`}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(claimingCourseId)}
                    onClick={() => onClaimCourse?.(course.courseId)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: claimingCourseId ? 'wait' : 'pointer',
                      opacity: claimingCourseId && !isClaiming ? 0.65 : 1,
                    }}
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>{isAr ? 'جاري إصدار الشهادة...' : 'Issuing...'}</span>
                      </>
                    ) : (
                      <>
                        <Award size={14} />
                        <span>{isAr ? 'إصدار الشهادة الآن' : 'Issue Certificate'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
