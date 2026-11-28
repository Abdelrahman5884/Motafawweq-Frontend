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
  Calendar,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

export const StudentConvertedLecturesView = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

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

  const handleOpenInLesson = (lecture) => {
    if (lecture.lessonId) {
      navigate(`/student/lesson?id=${encodeURIComponent(lecture.lessonId)}`);
    } else {
      handleOpenInStudio(lecture);
    }
  };

  const handleOpenInStudio = (lecture) => {
    if (lecture?.id) {
      navigate(`/student/smart-lecture?lecture=${encodeURIComponent(lecture.id)}`);
    } else {
      navigate('/student/smart-lecture');
    }
  };

  const handleOpenQuiz = (lecture) => {
    if (lecture?.id) {
      navigate(`/student/quiz?convertedLecture=${encodeURIComponent(lecture.id)}`);
    }
  };

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

  const filteredLectures = lectures.filter((item) => {
    const title = item.titleAr || item.titleEn || '';
    const file = item.fileName || '';
    const topics = (item.keyTopics || []).join(' ');
    const query = searchQuery.trim().toLowerCase();

    return (
      !query ||
      title.toLowerCase().includes(query) ||
      file.toLowerCase().includes(query) ||
      topics.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: 'var(--font-arabic)',
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px',
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
              justifyContent: 'center',
            }}>
              <FolderCheck size={22} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'المحاضرات المحولة بالذكاء الاصطناعي' : 'AI Converted Lectures'}
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {isAr
              ? 'أرشيفك الشامل لجميع المحاضرات والتسجيلات والملفات التي حولتها إلى خرائط مفاهيم وتفريغ نصي وكويزات ذكية.'
              : 'Your archive of AI-converted lectures, mind maps, transcripts, and interactive quizzes.'}
          </p>
        </div>

        <button
          type="button"
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
          }}
        >
          <Plus size={16} />
          <span>{isAr ? 'تحويل محاضرة جديدة' : 'Convert New Lecture'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '10px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder={isAr ? 'ابحث باسم المحاضرة أو الموضوع أو اسم الملف...' : 'Search lectures, files, or topics...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            width: '100%',
            fontFamily: 'inherit',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
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
          gap: '20px',
        }}>
          {filteredLectures.map((lecture) => {
            const hasQuiz = lecture.outputs?.includes('quiz') || Number(lecture.questionsCount || 0) > 0;
            const hasGraph = lecture.outputs?.includes('graph');
            const hasTranscript = lecture.outputs?.includes('transcript');
            const hasTopics = lecture.outputs?.includes('topics');
            const isProcessing = lecture.overallStatus === 'processing' || lecture.overallStatus === 'queued';
            const isFailed = lecture.overallStatus === 'failed';
            const tagLabel = [lecture.subjectAr, lecture.gradeAr].filter(Boolean).join(' • ')
              || (isAr ? 'محاضرة ذكية (AI)' : 'AI Smart Lecture');

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
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    gap: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}>
                        {tagLabel}
                      </span>
                      {isProcessing && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          color: '#D97706',
                        }}>
                          <Loader2 size={11} className="spin" />
                          {isAr ? `${lecture.overallProgress || 15}%` : `${lecture.overallProgress || 15}%`}
                        </span>
                      )}
                      {isFailed && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#DC2626',
                        }}>
                          <AlertCircle size={11} />
                          {isAr ? 'فشل التحليل' : 'Failed'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Calendar size={12} />
                        {lecture.dateAr || (isAr ? 'اليوم' : 'Today')}
                      </span>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(lecture.id)}
                        title={isAr ? 'حذف من المحفوظات' : 'Delete'}
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
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4,
                  }}>
                    {lecture.titleAr}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <HardDrive size={13} />
                      {lecture.fileName || (isAr ? 'ملف المحاضرة' : 'Lecture file')}
                    </span>
                    {lecture.duration && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {lecture.duration}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
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
                        fontWeight: '600',
                      }}>
                        <Brain size={13} color="var(--primary)" />
                        <span>{isAr ? 'خريطة مفاهيم' : 'Mind Map'}</span>
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
                        fontWeight: '600',
                      }}>
                        <FileText size={13} color="var(--primary)" />
                        <span>{isAr ? 'تفريغ نصي' : 'Transcript'}</span>
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
                        fontWeight: '600',
                      }}>
                        <Layers size={13} color="var(--primary)" />
                        <span>{isAr ? 'محاور الدرس' : 'Topics'}</span>
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
                        fontWeight: '600',
                      }}>
                        <HelpCircle size={13} color="var(--primary)" />
                        <span>
                          {lecture.questionsCount > 0
                            ? isAr ? `كويز (${lecture.questionsCount} أسئلة)` : `Quiz (${lecture.questionsCount})`
                            : isAr ? 'كويز ذكي' : 'AI Quiz'}
                        </span>
                      </span>
                    )}
                    {Number(lecture.attachmentsCount || 0) > 0 && (
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
                        fontWeight: '600',
                      }}>
                        <ImageIcon size={13} color="#059669" />
                        <span>
                          {isAr
                            ? `صور ومرفقات (${lecture.attachmentsCount})`
                            : `Files & Photos (${lecture.attachmentsCount})`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Smart Card Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <button
                    type="button"
                    onClick={() => handleOpenInStudio(lecture)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={15} />
                    <span>{isAr ? 'فتح الخريطة والمحاضرة' : 'Open AI Studio'}</span>
                  </button>

                  {Number(lecture.questionsCount || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(lecture)}
                      title={isAr ? 'حل الكويز الذكي' : 'Start AI Quiz'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <HelpCircle size={15} />
                      <span>{isAr ? 'كويز' : 'Quiz'}</span>
                    </button>
                  )}

                  {lecture.lessonId && (
                    <button
                      type="button"
                      onClick={() => handleOpenInLesson(lecture)}
                      title={isAr ? 'فتح في حصصي' : 'Open in My Lessons'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      <PlayCircle size={15} />
                    </button>
                  )}
                </div>

                {/* Delete Confirmation Overlay */}
                {deleteConfirmId === lecture.id && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.72)',
                    backdropFilter: 'blur(3px)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    zIndex: 10,
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
                      {isAr ? 'هل تريد بالتأكيد حذف هذه المحاضرة من أرشيفك؟' : 'Delete this lecture from your archive?'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteLecture(lecture.id)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        {isAr ? 'نعم، احذف' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          backgroundColor: '#4B5563',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '20px',
          padding: '48px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)',
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
            marginBottom: '14px',
          }}>
            <FolderCheck size={26} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            {isAr ? 'لم يتم العثور على محاضرات محولة' : 'No Converted Lectures Found'}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            margin: '0 auto 20px auto',
            lineHeight: 1.5,
          }}>
            {searchQuery
              ? (isAr ? 'لا توجد نتائج تطابق بحثك الحالي، جرّب كلمات بحث أخرى.' : 'No results matching your query.')
              : (isAr ? 'قم بتحويل أول محاضرة صوتية أو فيديو أو مستند، وسيتم حفظ نتائجها بالكامل هنا.' : 'Convert your first lecture to see it saved here.')}
          </p>
          <button
            type="button"
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
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'تحويل محاضرة جديدة الآن' : 'Convert Lecture Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentConvertedLecturesView;
