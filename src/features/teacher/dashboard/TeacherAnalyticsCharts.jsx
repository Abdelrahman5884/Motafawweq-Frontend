import React, { useState } from 'react';
import { Headphones, Users, Building2, BookOpen, Clock, TrendingUp, Sparkles } from 'lucide-react';

// Data 1: Number of students who listened to the lessons today across time intervals
const TODAY_LISTENERS_HOURLY = [
  { timeAr: '8 - 10 ص', timeEn: '8-10 AM', count: 185, isPeak: false, topTopicAr: 'البناء الضوئي' },
  { timeAr: '10 - 12 م', timeEn: '10-12 PM', count: 340, isPeak: false, topTopicAr: 'التنفس الخلوي' },
  { timeAr: '12 - 2 م', timeEn: '12-2 PM', count: 290, isPeak: false, topTopicAr: 'دورة كريبس' },
  { timeAr: '2 - 4 م', timeEn: '2-4 PM', count: 430, isPeak: false, topTopicAr: 'البيولوجيا الجزيئية' },
  { timeAr: '4 - 6 م', timeEn: '4-6 PM', count: 620, isPeak: true, topTopicAr: 'تضاعف DNA ومصائد الامتحان' },
  { timeAr: '6 - 8 م', timeEn: '6-8 PM', count: 480, isPeak: false, topTopicAr: 'حل كويز المناعة' },
  { timeAr: '8 - 10 م', timeEn: '8-10 PM', count: 315, isPeak: false, topTopicAr: 'مراجعة الباب الأول' }
];

// Data 2: Student / User distribution by Subjects
const SUBJECTS_USERS_DATA = [
  {
    id: 'sub-3sec',
    nameAr: 'أحياء 3 ثانوي (ثانوية عامة)',
    nameEn: 'Biology - 3rd Secondary',
    stageAr: 'الثانوية العامة',
    count: 2450,
    pct: 59,
    color: '#0066CC',
    activeToday: 1540
  },
  {
    id: 'sub-2sec',
    nameAr: 'أحياء 2 ثانوي (نقل)',
    nameEn: 'Biology - 2nd Secondary',
    stageAr: 'المرحلة الثانوية',
    count: 840,
    pct: 20,
    color: '#10B981',
    activeToday: 560
  },
  {
    id: 'sub-1sec',
    nameAr: 'أحياء 1 ثانوي (مبادئ البيولوجي)',
    nameEn: 'Biology - 1st Secondary',
    stageAr: 'المرحلة الثانوية',
    count: 530,
    pct: 13,
    color: '#F59E0B',
    activeToday: 380
  },
  {
    id: 'sub-prep',
    nameAr: 'علوم لغات (3 إعدادي متقدم)',
    nameEn: 'Advanced Science - 3rd Prep',
    stageAr: 'المرحلة الإعدادية',
    count: 300,
    pct: 8,
    color: '#8B5CF6',
    activeToday: 180
  }
];

// Data 3: Student / User distribution by Centers & Locations
const CENTERS_USERS_DATA = [
  {
    id: 'ctr-online',
    nameAr: 'أكاديمية المتفوق (أونلاين المنصة)',
    nameEn: 'Motafawweq Online Academy',
    locationAr: 'المنصة الرسمية المباشرة',
    count: 1890,
    pct: 46,
    color: '#0066CC',
    activeToday: 1280
  },
  {
    id: 'ctr-dokki',
    nameAr: 'سنتر الدقي النخبة',
    nameEn: 'El Dokki Elite Center',
    locationAr: 'شارع التحرير، الدقي',
    count: 1250,
    pct: 30,
    color: '#10B981',
    activeToday: 790
  },
  {
    id: 'ctr-nasr',
    nameAr: 'سنتر الرواد بمدينة نصر',
    nameEn: 'El Rowad Center - Nasr City',
    locationAr: 'شارع عباس العقاد',
    count: 980,
    pct: 24,
    color: '#8B5CF6',
    activeToday: 590
  }
];

export const TeacherAnalyticsCharts = ({ lang, isDark, isRtl }) => {
  const [distributionTab, setDistributionTab] = useState('subjects'); // 'subjects' | 'centers'
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

  const totalListenersToday = TODAY_LISTENERS_HOURLY.reduce((sum, item) => sum + item.count, 0);
  const maxListeners = Math.max(...TODAY_LISTENERS_HOURLY.map(d => d.count));

  const activeDistributionData = distributionTab === 'subjects' ? SUBJECTS_USERS_DATA : CENTERS_USERS_DATA;
  const maxDistributionCount = Math.max(...activeDistributionData.map(d => d.count));
  const totalEnrolled = 4120;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {/* ── BAR CHART 1: STUDENTS WHO LISTENED TO LESSONS TODAY ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Header */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 102, 204, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Headphones size={22} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '16.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: '0 0 3px 0'
                }}>
                  {lang === 'ar' ? 'عدد الطلاب الذين استمعوا للحصة اليوم' : 'Students Who Listened Today'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  {lang === 'ar' ? 'إجمالي الحضور والاستماع للشروحات عبر ساعات اليوم' : 'Hourly lesson attendance & audio listeners'}
                </p>
              </div>
            </div>

            {/* Total Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
              border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'}`
            }}>
              <TrendingUp size={14} color="#10B981" />
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#10B981' }}>
                {totalListenersToday.toLocaleString()} {lang === 'ar' ? 'طالب اليوم' : 'Listeners'}
              </span>
            </div>
          </div>

          {/* Vertical Bar Chart (Styled like student WeeklyPerformanceChart) */}
          <div style={{
            position: 'relative',
            paddingTop: '26px',
            paddingBottom: '8px'
          }}>
            {/* Tooltip on hover */}
            {hoveredHourIndex !== null && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: isRtl ? 'auto' : '50%',
                right: isRtl ? '50%' : 'auto',
                transform: 'translateX(50%)',
                backgroundColor: isDark ? '#1E293B' : '#0F172A',
                color: '#FFFFFF',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '700',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                pointerEvents: 'none',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                {lang === 'ar'
                  ? `${TODAY_LISTENERS_HOURLY[hoveredHourIndex].count} طالب • درس: ${TODAY_LISTENERS_HOURLY[hoveredHourIndex].topTopicAr}`
                  : `${TODAY_LISTENERS_HOURLY[hoveredHourIndex].count} students • Topic: ${TODAY_LISTENERS_HOURLY[hoveredHourIndex].topTopicAr}`}
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '175px',
              gap: '10px'
            }}>
              {TODAY_LISTENERS_HOURLY.map((item, index) => {
                const heightPct = Math.max(14, Math.round((item.count / maxListeners) * 100));
                const isHovered = hoveredHourIndex === index;

                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredHourIndex(index)}
                    onMouseLeave={() => setHoveredHourIndex(null)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Top Value Label */}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: item.isPeak ? '900' : '700',
                      color: item.isPeak ? '#10B981' : isHovered ? 'var(--primary)' : 'var(--text-secondary)',
                      marginBottom: '6px',
                      transition: 'color 0.15s ease'
                    }}>
                      {item.count}
                    </span>

                    {/* Bar Cylinder */}
                    <div style={{
                      width: '100%',
                      maxWidth: '44px',
                      height: `${heightPct}%`,
                      borderRadius: '8px 8px 3px 3px',
                      background: item.isPeak
                        ? (isHovered
                          ? 'linear-gradient(180deg, #10B981 0%, #047857 100%)'
                          : 'linear-gradient(180deg, #34D399 0%, #10B981 100%)')
                        : (isHovered
                          ? 'linear-gradient(180deg, #0088FF 0%, #0055BB 100%)'
                          : isDark
                            ? 'linear-gradient(180deg, #0066CC 0%, rgba(0, 102, 204, 0.4) 100%)'
                            : 'linear-gradient(180deg, #38BDF8 0%, #0066CC 100%)'),
                      boxShadow: isHovered
                        ? `0 6px 16px ${item.isPeak ? 'rgba(16, 185, 129, 0.45)' : 'rgba(0, 102, 204, 0.35)'}`
                        : 'none',
                      transform: isHovered ? 'scaleY(1.03)' : 'none',
                      transformOrigin: 'bottom',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />

                    {/* Bottom Time Slot Label */}
                    <span style={{
                      fontSize: '10.5px',
                      color: item.isPeak ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: item.isPeak ? '800' : '500',
                      marginTop: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {lang === 'ar' ? item.timeAr : item.timeEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          marginTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }} />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'ساعة الذروة اليوم:' : 'Peak Listening:'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? '4:00 - 6:00 م (620 طالباً)' : '4:00 - 6:00 PM (620)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>{lang === 'ar' ? 'متوسط الاستماع: 38 دقيقة' : 'Avg. Duration: 38m'}</span>
          </div>
        </div>
      </div>

      {/* ── BAR CHART 2: USERS PER SUBJECT OR TEACHER LOCATIONS/CENTERS ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Header with Switcher between Subjects and Centers */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '16.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: '0 0 3px 0'
                }}>
                  {lang === 'ar' ? 'عدد مستخدمي كل مادة وأماكن المدرس' : 'Students by Subject & Location'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  {distributionTab === 'subjects'
                    ? (lang === 'ar' ? 'إجمالي الطلاب المسجلين بكل مادة ومرحلة' : 'Enrolled students per subject & grade')
                    : (lang === 'ar' ? 'إجمالي الطلاب حسب السناتر وفروع التدريس' : 'Enrolled students per center & branch')}
                </p>
              </div>
            </div>

            {/* Switcher Toggle: Subjects vs Centers */}
            <div style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setDistributionTab('subjects')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: distributionTab === 'subjects' ? '800' : '600',
                  backgroundColor: distributionTab === 'subjects'
                    ? (isDark ? 'var(--primary)' : '#FFFFFF')
                    : 'transparent',
                  color: distributionTab === 'subjects'
                    ? (isDark ? '#FFFFFF' : 'var(--primary)')
                    : 'var(--text-secondary)',
                  boxShadow: distributionTab === 'subjects'
                    ? (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.08)')
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <BookOpen size={14} />
                <span>{lang === 'ar' ? 'حسب المواد' : 'By Subject'}</span>
              </button>

              <button
                onClick={() => setDistributionTab('centers')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: distributionTab === 'centers' ? '800' : '600',
                  backgroundColor: distributionTab === 'centers'
                    ? (isDark ? 'var(--primary)' : '#FFFFFF')
                    : 'transparent',
                  color: distributionTab === 'centers'
                    ? (isDark ? '#FFFFFF' : 'var(--primary)')
                    : 'var(--text-secondary)',
                  boxShadow: distributionTab === 'centers'
                    ? (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.08)')
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Building2 size={14} />
                <span>{lang === 'ar' ? 'أماكن المدرس' : 'Locations'}</span>
              </button>
            </div>
          </div>

          {/* Bar Chart list for the selected dimension */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            paddingTop: '6px'
          }}>
            {activeDistributionData.map((item) => {
              const widthPct = Math.round((item.count / maxDistributionCount) * 100);

              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }} />
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        • {lang === 'ar' ? (item.stageAr || item.locationAr) : (item.stageEn || item.locationEn)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {item.count.toLocaleString()} {lang === 'ar' ? 'طالب' : 'students'}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: item.color,
                        backgroundColor: `${item.color}15`,
                        padding: '2px 7px',
                        borderRadius: '6px'
                      }}>
                        {item.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Graphic */}
                  <div style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-subtle)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${widthPct}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '10px',
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Total Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          marginTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar'
                ? `إجمالي الطلاب المسجلين مع المدرس: ${totalEnrolled.toLocaleString()} طالباً`
                : `Total Enrolled Students: ${totalEnrolled.toLocaleString()}`}
            </span>
          </div>

          <span style={{
            fontSize: '11px',
            color: 'var(--success)',
            fontWeight: '700',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {lang === 'ar' ? 'سعة الفصول منتظمة 100%' : '100% Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
