import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  FolderCheck,
  PlayCircle,
  Sparkles,
  Search,
  Brain,
  FileText,
  Layers,
  HelpCircle,
  Clock,
  HardDrive,
  Trash2,
  Plus,
  Calendar
} from 'lucide-react';

export const StudentConvertedLecturesView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const [lectures, setLectures] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    let mounted = true;
    studentApi.convertedLectures.list()
      .then((res) => {
        if (!mounted) return;
        setLectures(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Open in "حصصي" (StudentLessonView)
  const handleOpenInLesson = (lecture) => {
    if (lecture.lessonId) {
      navigate(`/student/lesson?id=${lecture.lessonId}`);
    } else {
      navigate('/student/lesson');
    }
  };

  // Open in Conversion Studio
  const handleOpenInStudio = () => {
    navigate('/student/smart-lecture');
  };

  // Delete lecture
  const handleDeleteLecture = async (id) => {
    try {
      await studentApi.convertedLectures.delete(id);
      setLectures((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // ignore
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Filter lectures
  const filteredLectures = lectures.filter(item => {
    const title = item.titleAr || item.titleEn || '';
    const file = item.fileName || '';
    const topics = (item.keyTopics || []).join(' ');
    const query = searchQuery.trim().toLowerCase();

    return !query || 
      title.toLowerCase().includes(query) || 
      file.toLowerCase().includes(query) ||
      topics.toLowerCase().includes(query);
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FolderCheck size={22} />
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {lang === 'ar' ? 'المحاضرات المحولة بالذكاء الاصطناعي' : 'AI Converted Lectures'}
            </h1>
          </div>
          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5
          }}>
            {lang === 'ar'
              ? 'أرشيفك الشامل لجميع المحاضرات والملفات التي حولتها إلى خرائط مفاهيم وتفريغ وكويزات، ويمكنك فتحها للمذاكرة في حصصي.'
              : 'Your archive of converted lectures, mindmaps, and quizzes, ready to open in My Lessons.'}
          </p>
        </div>

        {/* Action Button: Convert New Lecture */}
        <button
          onClick={() => navigate('/student/smart-lecture')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'تحويل محاضرة جديدة' : 'Convert New Lecture'}</span>
        </button>
      </div>

      {/* Calm Search Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '10px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث باسم المحاضرة أو الموضوع أو اسم الملف...' : 'Search lectures, files, or topics...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            width: '100%',
            fontFamily: 'inherit'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Lectures Cards Grid */}
      {filteredLectures.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {filteredLectures.map((lecture) => {
            const hasQuiz = lecture.outputs?.includes('quiz');
            const hasGraph = lecture.outputs?.includes('graph');
            const hasTranscript = lecture.outputs?.includes('transcript');
            const hasTopics = lecture.outputs?.includes('topics');

            return (
              <div
                key={lecture.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                }}
              >
                {/* Card Top: Subject & Date & Delete */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)'
                    }}>
                      {lecture.subjectAr || 'الأحياء'} • {lecture.gradeAr || 'الثانوية العامة'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={12} />
                        {lecture.dateAr || 'اليوم'}
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={() => setDeleteConfirmId(lecture.id)}
                        title={lang === 'ar' ? 'حذف من المحفوظات' : 'Delete'}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.7,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Lecture Title */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4
                  }}>
                    {lecture.titleAr}
                  </h3>

                  {/* File & Meta Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '14px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <HardDrive size={13} />
                      {lecture.fileName || 'ملف المحاضرة'}
                    </span>
                    {lecture.duration && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {lecture.duration}
                      </span>
                    )}
                  </div>

                  {/* Generated Badges - Platform unified styling */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '18px'
                  }}>
                    {hasGraph && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11.5px',
                        padding: '3.5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: '600'
                      }}>
                        <Brain size={13} color="var(--primary)" />
                        <span>{lang === 'ar' ? 'خريطة مفاهيم' : 'Mindmap'}</span>
                      </span>
                    )}
                    {hasTranscript && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11.5px',
                        padding: '3.5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: '600'
                      }}>
                        <FileText size={13} color="var(--primary)" />
                        <span>{lang === 'ar' ? 'تفريغ صوتي' : 'Transcript'}</span>
                      </span>
                    )}
                    {hasTopics && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11.5px',
                        padding: '3.5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: '600'
                      }}>
                        <Layers size={13} color="var(--primary)" />
                        <span>{lang === 'ar' ? 'محاور الدرس' : 'Topics'}</span>
                      </span>
                    )}
                    {hasQuiz && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11.5px',
                        padding: '3.5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: '600'
                      }}>
                        <HelpCircle size={13} color="var(--primary)" />
                        <span>{lang === 'ar' ? `كويز (${lecture.questionsCount || 5} أسئلة)` : 'Quiz'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons: Open in Lesson vs Open in Studio */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  {/* Primary CTA: Open in My Lessons */}
                  <button
                    onClick={() => handleOpenInLesson(lecture)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <PlayCircle size={16} />
                    <span>{lang === 'ar' ? 'فتح في حصصي' : 'Open in My Lessons'}</span>
                  </button>

                  {/* Secondary CTA: Open in Studio */}
                  <button
                    onClick={() => handleOpenInStudio(lecture)}
                    title={lang === 'ar' ? 'عرض في استوديو التحويل' : 'Open in Studio'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <Sparkles size={15} />
                  </button>
                </div>

                {/* Delete Confirmation Modal / Dialog */}
                {deleteConfirmId === lecture.id && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(3px)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    zIndex: 10
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      marginBottom: '14px'
                    }}>
                      {lang === 'ar' ? 'هل تريد بالتأكيد حذف هذه المحاضرة من أرشيفك؟' : 'Delete this lecture from your archive?'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDeleteLecture(lecture.id)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {lang === 'ar' ? 'نعم، احذف' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          backgroundColor: '#4B5563',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '20px',
          padding: '48px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <FolderCheck size={26} />
          </div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0'
          }}>
            {lang === 'ar' ? 'لم يتم العثور على محاضرات محولة' : 'No Converted Lectures Found'}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            margin: '0 auto 20px auto',
            lineHeight: 1.5
          }}>
            {searchQuery
              ? (lang === 'ar' ? 'لا توجد نتائج تطابق بحثك الحالي، جرّب كلمات بحث أخرى.' : 'No results matching your query.')
              : (lang === 'ar' ? 'قم بتحويل أول محاضرة صوتية أو فيديو، وسيتم حفظ نتائجها بالكامل هنا لتفتحها في حصصي في أي وقت.' : 'Convert your first lecture to see it saved here.')}
          </p>
          <button
            onClick={() => navigate('/student/smart-lecture')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'تحويل محاضرة جديدة الآن' : 'Convert Lecture Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentConvertedLecturesView;
