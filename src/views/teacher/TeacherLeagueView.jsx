import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  TEACHER_COURSES_FOR_LEAGUE, 
  INITIAL_LEAGUES_BY_COURSE_GROUP 
} from '../../data/teacherLeagueData';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  Sparkles, 
  Users, 
  Search, 
  Calendar, 
  X, 
  Check, 
  Layers, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const TeacherLeagueView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Screen responsiveness hook
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 960;

  // Stored active leagues dictionary
  const [leaguesData, setLeaguesData] = useState(INITIAL_LEAGUES_BY_COURSE_GROUP);
  
  // Currently active selected league key
  const [activeLeagueKey, setActiveLeagueKey] = useState('course-bio-301_all');

  // Search & Filter in leaderboard
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'Diamond' | 'Gold' | 'Silver'

  // Modals & Feedback
  const [showStartLeagueModal, setShowStartLeagueModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [publishedNotice, setPublishedNotice] = useState(null);
  const [leagueToDelete, setLeagueToDelete] = useState(null);

  // Start League Modal Form State
  const [modalCourseId, setModalCourseId] = useState('course-bio-301');
  const [modalGroupMode, setModalGroupMode] = useState('all'); // 'all' | 'custom'
  const [modalCustomGroups, setModalCustomGroups] = useState(['grp-dokki']);
  const [modalDuration, setModalDuration] = useState('monthly'); // 'weekly' | 'monthly' | 'half_year' | 'full_year'

  // Current active league object
  const currentLeague = useMemo(() => {
    return leaguesData[activeLeagueKey] || Object.values(leaguesData)[0] || {
      leagueTitle: 'دوري الكورس',
      groupNameAr: 'جميع المجموعات',
      totalCompetitors: 0,
      roundDaysRemaining: 0,
      durationLabelAr: 'شهري',
      podium: [],
      leaderboard: []
    };
  }, [leaguesData, activeLeagueKey]);

  // List of all active leagues for the switcher
  const activeLeaguesList = useMemo(() => {
    return Object.keys(leaguesData).map(key => ({
      key,
      ...leaguesData[key]
    }));
  }, [leaguesData]);

  // Selected course object inside modal
  const modalCourse = useMemo(() => {
    return TEACHER_COURSES_FOR_LEAGUE.find(c => c.id === modalCourseId) || TEACHER_COURSES_FOR_LEAGUE[0];
  }, [modalCourseId]);

  // Derived automatic league title based on course & teacher
  const computedLeagueName = useMemo(() => {
    return `دوري ${modalCourse.titleAr} - د. سلمى السيد`;
  }, [modalCourse]);

  // Top 3 Podium
  const top1 = currentLeague.podium?.[0];
  const top2 = currentLeague.podium?.[1];
  const top3 = currentLeague.podium?.[2];

  // Filtered Leaderboard
  const filteredLeaderboard = useMemo(() => {
    let list = currentLeague.leaderboard || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(st => 
        st.nameAr.toLowerCase().includes(q) || 
        (st.schoolAr && st.schoolAr.toLowerCase().includes(q)) ||
        (st.groupAr && st.groupAr.toLowerCase().includes(q))
      );
    }
    if (tierFilter !== 'all') {
      list = list.filter(st => st.tier === tierFilter);
    }
    return list;
  }, [currentLeague, searchQuery, tierFilter]);

  // Duration label mapper
  const getDurationLabel = (durKey) => {
    switch (durKey) {
      case 'weekly': return 'أسبوعي (أسبوع)';
      case 'monthly': return 'شهري (شهر)';
      case 'half_year': return 'نصف سنة (فصل دراسي)';
      case 'full_year': return 'سنة كاملة (عام دراسي)';
      default: return 'شهري';
    }
  };

  // Announce Champions Ceremony
  const handleAnnounceWinners = () => {
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setPublishedNotice({
      title: lang === 'ar' ? 'تم تكريم أبطال الجولة بنجاح' : 'Champions Crowned Successfully',
      desc: lang === 'ar' 
        ? `تم إرسال إشعار التتويج وأوسمة الشرف لجميع طلاب ${currentLeague.groupNameAr} (${currentLeague.totalCompetitors.toLocaleString()} طالب).`
        : `Honor badges and celebration sent to all ${currentLeague.totalCompetitors.toLocaleString()} students.`
    });

    setTimeout(() => {
      setPublishedNotice(null);
    }, 4000);
  };

  // Create / Start League submission
  const handleStartLeague = (e) => {
    e.preventDefault();
    const isAll = modalGroupMode === 'all';
    
    let totalStudents = modalCourse.totalStudents;
    let groupLabel = 'جميع المجموعات (دوري موحد)';

    if (!isAll) {
      const selectedGroups = modalCourse.groups.filter(g => modalCustomGroups.includes(g.id));
      if (selectedGroups.length > 0) {
        totalStudents = selectedGroups.reduce((acc, g) => acc + g.studentCount, 0);
        groupLabel = selectedGroups.map(g => g.nameAr).join(' + ');
      } else {
        totalStudents = 148;
        groupLabel = 'مجموعة محددة';
      }
    }

    const durationDays = modalDuration === 'weekly' ? 7 : modalDuration === 'monthly' ? 30 : modalDuration === 'half_year' ? 90 : 270;
    const newKey = `${modalCourseId}_${isAll ? 'all' : modalCustomGroups.join('_')}`;

    const baseLeague = leaguesData[`${modalCourseId}_all`] || leaguesData['course-bio-301_all'];

    const newLeagueObj = {
      courseId: modalCourseId,
      groupId: isAll ? 'all' : modalCustomGroups[0],
      leagueTitle: computedLeagueName,
      courseNameAr: modalCourse.titleAr,
      groupNameAr: groupLabel,
      durationLabelAr: getDurationLabel(modalDuration),
      durationDays: durationDays,
      totalCompetitors: totalStudents,
      roundDaysRemaining: durationDays,
      isActive: true,
      podium: baseLeague.podium || [],
      leaderboard: baseLeague.leaderboard || []
    };

    setLeaguesData(prev => ({
      ...prev,
      [newKey]: newLeagueObj
    }));

    setActiveLeagueKey(newKey);
    setShowStartLeagueModal(false);

    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (err) {}

    setPublishedNotice({
      title: lang === 'ar' ? 'تم بدء الدوري بنجاح' : 'League Started Successfully',
      desc: lang === 'ar'
        ? `تم تفعيل (${computedLeagueName}) لـ ${groupLabel} بعدد ${totalStudents.toLocaleString()} طالب.`
        : 'League has been launched and students notified.'
    });

    setTimeout(() => {
      setPublishedNotice(null);
    }, 4500);
  };

  // Delete an active league
  const handleDeleteLeague = (leagueKey) => {
    if (!leagueKey) return;
    setLeaguesData(prev => {
      const updated = { ...prev };
      delete updated[leagueKey];
      const remainingKeys = Object.keys(updated);
      if (activeLeagueKey === leagueKey) {
        if (remainingKeys.length > 0) {
          setActiveLeagueKey(remainingKeys[0]);
        } else {
          setActiveLeagueKey(null);
        }
      }
      return updated;
    });
    setLeagueToDelete(null);
    setPublishedNotice({
      title: lang === 'ar' ? 'تم حذف الدوري بنجاح' : 'League Deleted Successfully',
      desc: lang === 'ar' ? 'تمت إزالة الدوري بنجاح من قائمة الدوريات النشطة.' : 'The league has been removed.'
    });
    setTimeout(() => {
      setPublishedNotice(null);
    }, 4000);
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: isMobile ? '20px 14px 60px' : '32px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* 1. Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(21, 136, 199, 0.16)' : 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <Trophy size={13} />
              <span>{lang === 'ar' ? 'بطولة الكورس والمنافسات' : 'Course Leagues'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Crown size={isMobile ? 22 : 24} color="#D97706" />
            <span>{lang === 'ar' ? 'إدارة دوري الكورس وصدارة الطلاب' : 'Course League Leaderboard'}</span>
          </h1>
        </div>

        {/* Top Buttons: Start League + Announce Champions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button
            onClick={() => setShowStartLeagueModal(true)}
            style={{
              flex: isMobile ? '1 1 auto' : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: isMobile ? '9px 14px' : '10px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={15} />
            <span>{lang === 'ar' ? 'بدء دوري جديد' : 'New League'}</span>
          </button>

          <button
            onClick={handleAnnounceWinners}
            style={{
              flex: isMobile ? '1 1 auto' : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: isMobile ? '9px 14px' : '10px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease'
            }}
          >
            <Award size={15} color="var(--primary)" />
            <span>{lang === 'ar' ? 'إعلان تكريم الأسبوع' : 'Announce Champions'}</span>
          </button>

          {currentLeague && currentLeague.leagueTitle && (
            <button
              type="button"
              onClick={() => setLeagueToDelete({ key: activeLeagueKey, ...currentLeague })}
              style={{
                flex: isMobile ? '1 1 auto' : 'initial',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: isMobile ? '9px 12px' : '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              }}
            >
              <Trash2 size={14} />
              <span>{lang === 'ar' ? 'حذف الدوري' : 'Delete League'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Notification Banner */}
      {publishedNotice && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '14px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1.5px solid #10B981',
          color: '#065F46',
          fontSize: '12.5px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '900', color: isDark ? '#34D399' : '#065F46', fontSize: '13px' }}>
              {publishedNotice.title}
            </div>
            <div style={{ color: isDark ? '#E2E8F0' : '#047857', marginTop: '2px' }}>
              {publishedNotice.desc}
            </div>
          </div>
        </div>
      )}

      {/* 2. Multiple Active Leagues Switcher Bar (التبديل السريع بين الدوريات النشطة) */}
      <div style={{
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              الدوريات النشطة لديك
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              {activeLeaguesList.length} دوريات
            </span>
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            اضغط على أي دوري للتبديل الفوري وعرض نتائجه
          </span>
        </div>

        {/* Scrollable League Cards Carousel */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}>
          {activeLeaguesList.map((lg) => {
            const isSelected = lg.key === activeLeagueKey;
            return (
              <div
                key={lg.key}
                onClick={() => setActiveLeagueKey(lg.key)}
                role="button"
                tabIndex={0}
                style={{
                  flex: isMobile ? '0 0 210px' : '0 0 250px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: isSelected 
                    ? (isDark ? 'rgba(21, 136, 199, 0.16)' : 'rgba(21, 136, 199, 0.08)')
                    : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(21, 136, 199, 0.2)' : 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)'
                    }}>
                      {lg.durationLabelAr.split(' ')[0]}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSelected && (
                        <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '800' }}>
                          المعروض حالياً
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeagueToDelete(lg);
                        }}
                        title={lang === 'ar' ? 'حذف الدوري' : 'Delete League'}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '3px',
                          borderRadius: '6px',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.7,
                          transition: 'opacity 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    lineHeight: 1.35,
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {lg.leagueTitle}
                  </div>

                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px'
                  }}>
                    {lg.groupNameAr}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: isSelected ? '1px solid rgba(21, 136, 199, 0.25)' : '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)'
                }}>
                  <span>{lg.totalCompetitors.toLocaleString()} طالب</span>
                  <span style={{ color: '#10B981', fontWeight: '700' }}>
                    {lg.roundDaysRemaining} يوم متبقي
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick Add League Card */}
          <div
            onClick={() => setShowStartLeagueModal(true)}
            role="button"
            tabIndex={0}
            style={{
              flex: isMobile ? '0 0 140px' : '0 0 160px',
              padding: '12px',
              borderRadius: '14px',
              border: '1.5px dashed var(--primary)',
              backgroundColor: isDark ? 'rgba(21, 136, 199, 0.05)' : 'rgba(21, 136, 199, 0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={16} />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
              إضافة دوري جديد
            </span>
          </div>
        </div>
      </div>

      {/* 3. Stepped Olympic 3D Podium (منصة التتويج والمراكز الثلاثة الأولى) */}
      <div style={{
        position: 'relative',
        background: isDark 
          ? 'radial-gradient(ellipse at 50% 15%, #182845 0%, #0B1322 65%, #060A13 100%)' 
          : 'radial-gradient(ellipse at 50% 15%, #FEF9C3 0%, #FFFBEB 30%, #F8FAFC 80%)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '24px',
        padding: isMobile ? '18px 12px 14px' : '28px 24px 20px',
        boxShadow: isDark 
          ? '0 20px 50px -10px rgba(0, 0, 0, 0.7)' 
          : '0 16px 40px -8px rgba(245, 158, 11, 0.15)',
        overflow: 'hidden',
        marginBottom: '28px'
      }}>
        {/* Arena Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: isMobile ? '18px' : '26px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              fontWeight: '800',
              color: '#D97706',
              marginBottom: '2px'
            }}>
              <Trophy size={13} />
              <span>منصة التتويج الرسمية</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>{currentLeague.groupNameAr}</span>
            </div>
            <h2 style={{
              fontSize: isMobile ? '16px' : '19px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: 0
            }}>
              المراكز الثلاثة الأولى
            </h2>
          </div>

          <div>
            <span style={{
              padding: '3px 10px',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)',
              color: isDark ? '#E2E8F0' : '#1E293B',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              {currentLeague.totalCompetitors.toLocaleString()} طالب في المنافسة
            </span>
          </div>
        </div>

        {/* Stepped Olympic Podium: Order #2 (Silver, left), #1 (Gold, Center, Tallest), #3 (Bronze, right) */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: isMobile ? '6px' : '16px',
          maxWidth: '860px',
          margin: '0 auto',
          paddingBottom: '4px'
        }}>
          {/* 2nd Place (Silver - Medium elevation) */}
          {top2 && (
            <div
              onClick={() => setSelectedStudentForModal(top2)}
              role="button"
              tabIndex={0}
              style={{
                flex: isMobile ? '1 1 0' : '1 1 230px',
                minWidth: 0,
                maxWidth: isMobile ? '120px' : '240px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Avatar & Badge */}
              <div style={{ position: 'relative', marginBottom: isMobile ? '4px' : '8px' }}>
                <img
                  src={top2.avatar}
                  alt={top2.nameAr}
                  style={{
                    width: isMobile ? '46px' : '64px',
                    height: isMobile ? '46px' : '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid #38BDF8',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  right: '-3px',
                  width: isMobile ? '18px' : '22px',
                  height: isMobile ? '18px' : '22px',
                  borderRadius: '50%',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  fontSize: isMobile ? '10px' : '11px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF'
                }}>
                  #2
                </div>
              </div>

              {/* Student Name */}
              <div style={{
                fontSize: isMobile ? '11.5px' : '13.5px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                marginBottom: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}>
                {top2.nameAr}
              </div>
              {!isMobile && (
                <div style={{ fontSize: '10.5px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '4px' }}>
                  {top2.schoolAr}
                </div>
              )}

              {/* Score pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: isMobile ? '2px 6px' : '3px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: isDark ? '#38BDF8' : '#0284C7',
                fontSize: isMobile ? '10px' : '11.5px',
                fontWeight: '900',
                marginBottom: isMobile ? '6px' : '10px'
              }}>
                <span>{top2.score.toLocaleString()} XP</span>
              </div>

              {/* Stepped Pedestal 2 (Height: 80px mobile / 100px desktop) */}
              <div style={{
                width: '100%',
                height: isMobile ? '80px' : '100px',
                borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0',
                background: isDark 
                  ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.28) 0%, rgba(15, 23, 42, 0.95) 100%)' 
                  : 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
                border: '1.5px solid #38BDF8',
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -4px 14px rgba(56, 189, 248, 0.15)'
              }}>
                <div style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: '900', color: '#0284C7' }}>2</div>
                <div style={{ fontSize: isMobile ? '10px' : '11.5px', color: isDark ? '#BAE6FD' : '#0369A1', fontWeight: '800' }}>
                  وصيف الكورس
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Gold - Tallest & Largest in Center) */}
          {top1 && (
            <div
              onClick={() => setSelectedStudentForModal(top1)}
              role="button"
              tabIndex={0}
              style={{
                flex: isMobile ? '1.15 1 0' : '1 1 260px',
                minWidth: 0,
                maxWidth: isMobile ? '135px' : '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Floating Crown above avatar */}
              <div style={{ position: 'relative', marginBottom: isMobile ? '4px' : '8px' }}>
                <Crown 
                  size={isMobile ? 20 : 26} 
                  color="#F59E0B" 
                  style={{
                    position: 'absolute',
                    top: isMobile ? '-15px' : '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    filter: 'drop-shadow(0 2px 6px rgba(245, 158, 11, 0.5))'
                  }} 
                />
                <img
                  src={top1.avatar}
                  alt={top1.nameAr}
                  style={{
                    width: isMobile ? '56px' : '78px',
                    height: isMobile ? '56px' : '78px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #F59E0B',
                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  right: '-3px',
                  width: isMobile ? '20px' : '24px',
                  height: isMobile ? '20px' : '24px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF'
                }}>
                  #1
                </div>
              </div>

              {/* Student Name */}
              <div style={{
                fontSize: isMobile ? '12.5px' : '15px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                marginBottom: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}>
                {top1.nameAr}
              </div>
              {!isMobile && (
                <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '4px' }}>
                  {top1.schoolAr}
                </div>
              )}

              {/* Score pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: isMobile ? '2px 8px' : '3px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(245, 158, 11, 0.22)',
                color: isDark ? '#FDE68A' : '#B45309',
                fontSize: isMobile ? '11px' : '12.5px',
                fontWeight: '900',
                marginBottom: isMobile ? '6px' : '10px',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                <span>{top1.score.toLocaleString()} XP</span>
              </div>

              {/* Stepped Pedestal 1 (Height: 110px mobile / 140px desktop - Tallest!) */}
              <div style={{
                width: '100%',
                height: isMobile ? '110px' : '140px',
                borderRadius: isMobile ? '14px 14px 0 0' : '18px 18px 0 0',
                background: isDark 
                  ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.35) 0%, rgba(15, 23, 42, 0.95) 100%)' 
                  : 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
                border: '2px solid #F59E0B',
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -6px 25px rgba(245, 158, 11, 0.25)'
              }}>
                <div style={{ fontSize: isMobile ? '28px' : '38px', fontWeight: '900', color: '#D97706', lineHeight: 1 }}>1</div>
                <div style={{ fontSize: isMobile ? '10.5px' : '12.5px', color: isDark ? '#FDE68A' : '#92400E', fontWeight: '900', marginTop: '3px' }}>
                  بطل الكورس
                </div>
                <div style={{ fontSize: isMobile ? '9px' : '10.5px', color: isDark ? '#CBD5E1' : '#B45309', fontWeight: '700' }}>
                  المركز الأول
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze - Lowest elevation) */}
          {top3 && (
            <div
              onClick={() => setSelectedStudentForModal(top3)}
              role="button"
              tabIndex={0}
              style={{
                flex: isMobile ? '1 1 0' : '1 1 220px',
                minWidth: 0,
                maxWidth: isMobile ? '115px' : '230px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Avatar & Badge */}
              <div style={{ position: 'relative', marginBottom: isMobile ? '4px' : '8px' }}>
                <img
                  src={top3.avatar}
                  alt={top3.nameAr}
                  style={{
                    width: isMobile ? '42px' : '58px',
                    height: isMobile ? '42px' : '58px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid #EA580C',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  right: '-3px',
                  width: isMobile ? '18px' : '20px',
                  height: isMobile ? '18px' : '20px',
                  borderRadius: '50%',
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  fontSize: isMobile ? '10px' : '11px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF'
                }}>
                  #3
                </div>
              </div>

              {/* Student Name */}
              <div style={{
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                marginBottom: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}>
                {top3.nameAr}
              </div>
              {!isMobile && (
                <div style={{ fontSize: '10.5px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '4px' }}>
                  {top3.schoolAr}
                </div>
              )}

              {/* Score pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: isMobile ? '2px 6px' : '3px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                color: isDark ? '#FDBA74' : '#C2410C',
                fontSize: isMobile ? '10px' : '11.5px',
                fontWeight: '900',
                marginBottom: isMobile ? '6px' : '10px'
              }}>
                <span>{top3.score.toLocaleString()} XP</span>
              </div>

              {/* Stepped Pedestal 3 (Height: 60px mobile / 75px desktop - Lowest) */}
              <div style={{
                width: '100%',
                height: isMobile ? '60px' : '75px',
                borderRadius: isMobile ? '12px 12px 0 0' : '14px 14px 0 0',
                background: isDark 
                  ? 'linear-gradient(180deg, rgba(234, 88, 12, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)' 
                  : 'linear-gradient(180deg, #FFEDD5 0%, #FED7AA 100%)',
                border: '1.5px solid #EA580C',
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -4px 12px rgba(234, 88, 12, 0.12)'
              }}>
                <div style={{ fontSize: isMobile ? '18px' : '26px', fontWeight: '900', color: '#C2410C' }}>3</div>
                <div style={{ fontSize: isMobile ? '9.5px' : '11px', color: isDark ? '#FED7AA' : '#9A3412', fontWeight: '800' }}>
                  المركز الثالث
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Official Approved Scoring Rules Banner (قواعد احتساب نقاط الدوري المعتمدة) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: isMobile ? '16px 14px' : '20px 22px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={17} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'قواعد احتساب نقاط الدوري المعتمدة للمادة' : 'Official League Scoring Rules'}
              </h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                {lang === 'ar' ? 'النظام التلقائي لاحتساب رصيد النقاط وتصعيد الترتيب للطلاب في هذا الدوري' : 'Automated scoring rules for calculating student rankings'}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '12px'
        }}>
          {/* Rule 1: Exams */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
              {lang === 'ar' ? 'الامتحانات والاختبارات' : 'Exams'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'ar' ? 'كل سؤال صحيح = نقطة واحدة (1 pt)' : '1 pt per correct question'}
            </div>
          </div>

          {/* Rule 2: Full Mark Bonus */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#D97706', marginBottom: '4px' }}>
              {lang === 'ar' ? 'تقفيل الامتحان (Full Mark)' : 'Full Mark Bonus'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'ar' ? '+3 نقاط إضافية بونص عند إحراز الدرجة النهائية كاملة' : '+3 bonus points for full mark'}
            </div>
          </div>

          {/* Rule 3: Daily Streak */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', marginBottom: '4px' }}>
              {lang === 'ar' ? 'الستريك اليومي (المذاكرة)' : 'Daily Streak'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'ar' ? 'نقطة واحدة (1 pt) لكل يوم التزام ومتابعة' : '1 pt per daily streak day'}
            </div>
          </div>

          {/* Rule 4: Homework */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#8B5CF6', marginBottom: '4px' }}>
              {lang === 'ar' ? 'الواجبات والتكليفات' : 'Homework'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'ar' ? 'كل درجة = نقطة (مثال: واجب من 20 درجة = 20 نقطة)' : '1 pt per grade mark (20-mark HW = 20 pts)'}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Full Leaderboard Standings Table (جدول الترتيب الشامل لجميع طلاب الدوري) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: isMobile ? '16px 12px' : '24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Table Top Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Layers size={16} color="var(--primary)" />
              <span>جدول الترتيب العام ({filteredLeaderboard.length} طالب)</span>
            </h3>
          </div>

          {/* Search & Tier Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto'
          }}>
            {/* Search Input */}
            <div style={{
              flex: isMobile ? '1 1 auto' : 'initial',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '6px 10px'
            }}>
              <Search size={13} color="var(--text-secondary)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث بالاسم...' : 'Search student...'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  width: isMobile ? '100%' : '140px',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Tier Filters */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '10px',
              padding: '2px',
              gap: '2px'
            }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'Diamond', label: 'الماسي' },
                { id: 'Gold', label: 'الذهبي' },
                { id: 'Silver', label: 'الفضي' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTierFilter(t.id)}
                  style={{
                    border: 'none',
                    borderRadius: '7px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: tierFilter === t.id ? '800' : '600',
                    backgroundColor: tierFilter === t.id ? 'var(--primary)' : 'transparent',
                    color: tierFilter === t.id ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredLeaderboard.map((st) => {
            const isTop3 = st.rank <= 3;

            return (
              <div
                key={st.rank}
                onClick={() => setSelectedStudentForModal(st)}
                role="button"
                tabIndex={0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '10px 12px' : '12px 18px',
                  borderRadius: '14px',
                  backgroundColor: isTop3 
                    ? (isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.05)') 
                    : 'var(--bg-subtle)',
                  border: isTop3 
                    ? '1.5px solid rgba(245, 158, 11, 0.25)' 
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'transform 0.12s ease',
                  gap: '10px'
                }}
              >
                {/* Left: Rank, Avatar, Student Name, School */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', minWidth: 0, flex: 1 }}>
                  {/* Rank Badge */}
                  <span style={{
                    width: isMobile ? '26px' : '30px',
                    height: isMobile ? '26px' : '30px',
                    borderRadius: '8px',
                    backgroundColor: st.rank === 1 ? '#F59E0B' : st.rank === 2 ? '#38BDF8' : st.rank === 3 ? '#EA580C' : 'var(--border-subtle)',
                    color: isTop3 ? '#FFFFFF' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '11.5px' : '13px',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    #{st.rank}
                  </span>

                  {/* Avatar */}
                  <img
                    src={st.avatar}
                    alt={st.nameAr}
                    style={{
                      width: isMobile ? '36px' : '42px',
                      height: isMobile ? '36px' : '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isTop3 ? '2px solid #F59E0B' : '1.5px solid var(--border-medium)',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontSize: isMobile ? '13px' : '14px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <span>{st.nameAr}</span>
                      {st.rank === 1 && <Crown size={13} color="#F59E0B" />}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '10px' : '11.5px',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {st.schoolAr} • <span style={{ color: 'var(--primary)' }}>{st.groupAr || currentLeague.groupNameAr}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics + XP (Strictly rule-based, no manual granting) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '18px', flexShrink: 0 }}>
                  {!isMobile && (
                    <>
                      <div style={{ textAlign: 'center', minWidth: '55px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: '#10B981' }}>
                          {st.perfectExams || 12}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>فول مارك</div>
                      </div>

                      <div style={{ textAlign: 'center', minWidth: '55px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {st.examsSolved || 20}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>امتحان محلول</div>
                      </div>
                    </>
                  )}

                  {/* Total XP Points */}
                  <div style={{ textAlign: 'left', minWidth: isMobile ? 'auto' : '85px' }}>
                    <div style={{ fontSize: isMobile ? '13.5px' : '15px', fontWeight: '900', color: 'var(--primary)' }}>
                      {st.score.toLocaleString()} XP
                    </div>
                    {isMobile && (
                      <div style={{ fontSize: '9.5px', color: '#10B981', fontWeight: '700' }}>
                        {st.perfectExams || 12} فول مارك
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Start New League Modal (نافذة بدء دوري تنافسي جديد) */}
      {showStartLeagueModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: isMobile ? '20px 16px' : '26px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'بدء دوري تنافسي جديد' : 'Launch New League'}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {lang === 'ar' ? 'حدد الكورس والمجموعات المشاركة ومدة المنافسة' : 'Configure participating course and cohorts'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowStartLeagueModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStartLeague}>
              {/* Step 1: Select Course */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? '١. الكورس والمادة المستهدفة:' : '1. Target Course:'}
                </label>
                <select
                  value={modalCourseId}
                  onChange={(e) => setModalCourseId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    outline: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  {TEACHER_COURSES_FOR_LEAGUE.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.titleAr} ({c.totalStudents.toLocaleString()} طالب مسجل)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Choose Cohorts Participation */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? '٢. تحديد المجموعات التي تدخل الدوري:' : '2. Cohort Inclusion:'}
                </label>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setModalGroupMode('all')}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '10px',
                      border: modalGroupMode === 'all' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: modalGroupMode === 'all' ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                      color: modalGroupMode === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    كل المجموعات (دوري موحد)
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalGroupMode('custom')}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '10px',
                      border: modalGroupMode === 'custom' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: modalGroupMode === 'custom' ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-subtle)',
                      color: modalGroupMode === 'custom' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    مجموعة محددة بالاسم
                  </button>
                </div>

                {modalGroupMode === 'custom' && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {modalCourse.groups
                      .filter(g => g.id !== 'all')
                      .map(g => {
                        const isChecked = modalCustomGroups.includes(g.id);
                        return (
                          <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setModalCustomGroups(prev => 
                                  isChecked ? prev.filter(x => x !== g.id) : [...prev, g.id]
                                );
                              }}
                            />
                            <span style={{ fontWeight: isChecked ? '800' : '600', color: 'var(--text-primary)' }}>
                              {g.nameAr} ({g.studentCount} طالب)
                            </span>
                          </label>
                        );
                      })
                    }
                  </div>
                )}
              </div>

              {/* Step 3: League Name (Automatic based on course/teacher) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                  {lang === 'ar' ? '٣. اسم الدوري:' : '3. League Title:'}
                </label>
                <div style={{
                  padding: '9px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  fontSize: '12.5px'
                }}>
                  {computedLeagueName}
                </div>
              </div>

              {/* Step 4: Duration (4 options: weekly, monthly, half_year, full_year) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? '٤. مدة المنافسة:' : '4. Competition Duration:'}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px'
                }}>
                  {[
                    { id: 'weekly', label: 'أسبوعي (أسبوع)' },
                    { id: 'monthly', label: 'شهري (شهر)' },
                    { id: 'half_year', label: 'نصف سنة (فصل دراسي)' },
                    { id: 'full_year', label: 'سنة كاملة (عام دراسي)' }
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setModalDuration(d.id)}
                      style={{
                        padding: '9px',
                        borderRadius: '10px',
                        border: modalDuration === d.id ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: modalDuration === d.id ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                        color: modalDuration === d.id ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Fixed Standard Scoring Criteria */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  قواعد احتساب نقاط الدوري المعتمدة للمادة:
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  • <strong style={{ color: 'var(--text-primary)' }}>الامتحان:</strong> كل سؤال بنقطة واحدة (1 pt).<br />
                  • <strong style={{ color: 'var(--text-primary)' }}>تقفيل الامتحان (Full Mark):</strong> +3 نقاط بونص إضافية عند الدرجة النهائية كاملة.<br />
                  • <strong style={{ color: 'var(--text-primary)' }}>الستريك اليومي:</strong> نقطة واحدة لكل يوم التزام ومذاكرة.<br />
                  • <strong style={{ color: 'var(--text-primary)' }}>الواجبات:</strong> كل درجة بنقطة كاملة (مثال: واجب من 20 درجة = 20 نقطة).
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowStartLeagueModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)'
                  }}
                >
                  <span>بدء الدوري</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Student Profile & Achievement Modal (Strictly info, no manual point granting) */}
      {selectedStudentForModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            padding: isMobile ? '20px 16px' : '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar & Rank */}
            <div style={{ position: 'relative', width: '74px', height: '74px', margin: '0 auto 10px' }}>
              <img
                src={selectedStudentForModal.avatar}
                alt={selectedStudentForModal.nameAr}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 6px 20px rgba(21, 136, 199, 0.25)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: selectedStudentForModal.rank === 1 ? '#F59E0B' : selectedStudentForModal.rank === 2 ? '#38BDF8' : '#EA580C',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                #{selectedStudentForModal.rank}
              </div>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 3px' }}>
              {selectedStudentForModal.nameAr}
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              {selectedStudentForModal.schoolAr} • {selectedStudentForModal.groupAr || currentLeague.groupNameAr}
            </p>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
                  {selectedStudentForModal.score.toLocaleString()}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>مجموع النقاط</div>
              </div>

              <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981' }}>
                  {selectedStudentForModal.perfectExams || 16}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>فول مارك</div>
              </div>

              <div style={{ padding: '10px 6px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#D97706' }}>
                  {selectedStudentForModal.streak || 18} يوم
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>أيام الالتزام</div>
              </div>
            </div>

            {/* Performance breakdown pills */}
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <span>الامتحانات المحلولة: <strong>{selectedStudentForModal.examsSolved || 24}</strong></span>
              <span>تسليم الواجبات: <strong>{selectedStudentForModal.homeworkRate || '96%'}</strong></span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedStudentForModal(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* 7. Delete League Confirmation Modal */}
      {leagueToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setLeagueToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {lang === 'ar' ? 'تأكيد حذف الدوري' : 'Delete League'}
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px' }}>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف دوري "${leagueToDelete.leagueTitle || 'المحدد'}"؟ ستتم إزالة تصنيفات الطلاب الخاصة به نهائياً.`
                : `Are you sure you want to delete "${leagueToDelete.leagueTitle || 'this league'}"? Student leaderboard ranks will be removed.`}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setLeagueToDelete(null)}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteLeague(leagueToDelete.key)}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLeagueView;
