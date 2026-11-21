import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  BookOpenCheck,
  Trophy,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const CertificateEligibilityCard = ({
  lang = 'ar',
  eligibility = null,
  claimingKey = null,
  onClaimItem,
}) => {
  const isAr = lang === 'ar';

  const teacherData = eligibility?.teacher || {};
  const ministryData = eligibility?.ministry || {};
  const leagueData = eligibility?.league || {};

  const teacherEligible = Boolean(teacherData.eligible);
  const ministryEligible = Boolean(ministryData.eligible);
  const leagueEligible = Boolean(leagueData.eligible);

  const coursesProgress = Array.isArray(teacherData.coursesProgress)
    ? teacherData.coursesProgress
    : [];

  const claimableItems = [
    ...(Array.isArray(teacherData.claimableCourses)
      ? teacherData.claimableCourses.map((c) => ({
          track: 'teacher',
          targetId: c.targetId || c.courseId,
          badgeAr: 'إتمام مقرر',
          badgeEn: 'Course Completion',
          title: isAr ? c.titleAr : c.titleEn || c.titleAr,
          subtitle: isAr
            ? c.subtitleAr || `${c.teacherName} • ${c.completedLessons}/${c.totalLessons} (100%)`
            : c.subtitleEn || `${c.teacherName} • ${c.completedLessons}/${c.totalLessons} (100%)`,
        }))
      : []),
    ...(Array.isArray(ministryData.claimableExams)
      ? ministryData.claimableExams.map((ex) => ({
          track: 'ministry',
          targetId: ex.targetId,
          badgeAr: 'تفوق اختبار',
          badgeEn: 'Exam Distinction',
          title: isAr ? ex.titleAr : ex.titleEn || ex.titleAr,
          subtitle: isAr ? ex.subtitleAr : ex.subtitleEn || ex.subtitleAr,
        }))
      : []),
    ...(Array.isArray(leagueData.claimableLeagues)
      ? leagueData.claimableLeagues.map((lg) => ({
          track: 'league',
          targetId: lg.targetId,
          badgeAr: 'صدارة الدوري',
          badgeEn: 'League Top 10',
          title: isAr ? lg.titleAr : lg.titleEn || lg.titleAr,
          subtitle: isAr ? lg.subtitleAr : lg.subtitleEn || lg.subtitleAr,
        }))
      : []),
  ];

  const completedCourses = Number(teacherData.progressValue ?? 0);
  const totalCourses = Number(teacherData.totalCourses ?? 0);
  const highExams = Number(ministryData.progressValue ?? 0);
  const bestRank =
    leagueData.progressValue !== null && leagueData.progressValue !== undefined
      ? Number(leagueData.progressValue)
      : null;

  const tracks = [
    {
      id: 'teacher',
      eligible: teacherEligible,
      trackNum: isAr ? 'المسار 01' : 'Track 01',
      trackBadge: isAr ? 'مقررات المعلمين' : 'Teacher Courses',
      title: isAr
        ? 'إتمام المقررات التخصصية للمعلم المشرف'
        : 'Completion of Specialized Educator Courses',
      requirement: isAr
        ? 'إتمام 100% من الحصص المنشورة في المقرر الدراسي للاستحقاق المباشر لشهادة إتمام معتمدة.'
        : 'Complete 100% of published lessons in an enrolled course to earn a verified completion certificate.',
      status: teacherEligible
        ? isAr
          ? `مستوفى الشروط • أتممت ${completedCourses}${totalCourses > 0 ? ` من ${totalCourses}` : ''} مقرر`
          : `Criteria Met • ${completedCourses}${totalCourses > 0 ? ` / ${totalCourses}` : ''} completed`
        : isAr
          ? `قيد التقدم • أكمل دروس مقرر بنسبة 100% (${completedCourses}/${totalCourses || 1})`
          : `In Progress • Complete 100% of a course (${completedCourses}/${totalCourses || 1})`,
      actionTo: '/student/courses',
      actionLabel: isAr ? 'متابعة المقررات' : 'Go to Courses',
      icon: UserCheck,
    },
    {
      id: 'ministry',
      eligible: ministryEligible,
      trackNum: isAr ? 'المسار 02' : 'Track 02',
      trackBadge: isAr ? 'الاختبارات المعتمدة' : 'Accredited Exams',
      title: isAr
        ? 'اجتياز الاختبارات الرسمية بنسبة 80%+'
        : 'Passing Graded Exams with 80%+ Score',
      requirement: isAr
        ? 'اجتياز أي اختبار مُصحّح على المنصة بنسبة لا تقل عن 80% لاستحقاق شهادة تفوق أكاديمي.'
        : 'Pass any graded platform exam with 80% or higher to earn an academic distinction certificate.',
      status: ministryEligible
        ? isAr
          ? `مستوفى الشروط • اجتزت ${highExams} اختبار بنسبة 80%+`
          : `Criteria Met • ${highExams} exam(s) scored 80%+`
        : isAr
          ? 'قيد التقدم • اجتز اختباراً مُصحّحاً بنسبة 80% فأكثر'
          : 'In Progress • Score 80%+ on a graded exam',
      actionTo: '/student/exam',
      actionLabel: isAr ? 'عرض الاختبارات' : 'Go to Exams',
      icon: BookOpenCheck,
    },
    {
      id: 'league',
      eligible: leagueEligible,
      trackNum: isAr ? 'المسار 03' : 'Track 03',
      trackBadge: isAr ? 'دوريات المتفوقين' : 'Honors Leagues',
      title: isAr
        ? 'الصدارة ضمن العشرة الأوائل (Top 10)'
        : 'Ranking Within the Top 10 Standings',
      requirement: isAr
        ? 'تحقيق نقاط فعلية والتواجد ضمن قائمة العشرة الأوائل (Top 10) في دوري المقرر أو دوري الجمهورية.'
        : 'Earn league points and place within the Top 10 in a course league or General Republic League.',
      status: leagueEligible
        ? isAr
          ? `مستوفى الشروط • أفضل مركز حققته #${bestRank}`
          : `Criteria Met • Best Rank #${bestRank}`
        : isAr
          ? 'قيد التقدم • احصد نقاطاً ونافس لدخول Top 10'
          : 'In Progress • Earn points to enter Top 10',
      actionTo: '/student/league',
      actionLabel: isAr ? 'استعراض الدوري' : 'Open Leagues',
      icon: Trophy,
    },
  ];

  const inProgressCourses = coursesProgress.filter((c) => c.progressPercent < 100);

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

                {/* Real Per-Course Completion Mini-Bars for Track 01 */}
                {track.id === 'teacher' && inProgressCourses.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {inProgressCourses.slice(0, 2).map((cp) => (
                      <div key={cp.courseId}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'var(--text-secondary)',
                            marginBottom: '4px',
                            gap: '8px',
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {isAr ? cp.titleAr : cp.titleEn}
                          </span>
                          <span style={{ whiteSpace: 'nowrap', color: 'var(--primary)' }}>
                            {cp.completedLessons}/{cp.totalLessons} ({cp.progressPercent}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: '5px',
                            borderRadius: '999px',
                            backgroundColor: 'var(--bg-subtle)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${cp.progressPercent}%`,
                              height: '100%',
                              backgroundColor: 'var(--primary)',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

                {!track.eligible && (
                  <Link
                    to={track.actionTo}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px 12px',
                      borderRadius: '9px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{track.actionLabel}</span>
                    {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Ready-to-Claim Panel for ALL 3 Tracks */}
      {claimableItems.length > 0 && (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: '900',
              color: 'var(--text-primary)',
            }}
          >
            <Award size={18} color="var(--primary)" />
            <span>
              {isAr
                ? `شهادات مستحقة جاهزة للإصدار الفوري الآن (${claimableItems.length})`
                : `Earned Certificates Ready to Issue Now (${claimableItems.length})`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {claimableItems.map((item) => {
              const itemKey = `${item.track}:${item.targetId}`;
              const isClaiming = claimingKey === itemKey;
              return (
                <div
                  key={itemKey}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(21, 136, 199, 0.12)',
                          color: 'var(--primary)',
                        }}
                      >
                        {isAr ? item.badgeAr : item.badgeEn}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {item.subtitle}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(claimingKey)}
                    onClick={() => onClaimItem?.(item.track, item.targetId)}
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
                      cursor: claimingKey ? 'wait' : 'pointer',
                      opacity: claimingKey && !isClaiming ? 0.65 : 1,
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
