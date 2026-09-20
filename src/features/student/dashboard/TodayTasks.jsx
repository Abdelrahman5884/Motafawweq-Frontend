import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';

export const TodayTasks = ({
  tasks,
  filteredTasks,
  completedTasksCount,
  taskCategoryFilter,
  setTaskCategoryFilter,
  toggleTaskCompleted,
  lang,
  isRtl,
  isDark,
  themeAccent
}) => {
  const navigate = useNavigate();

  return (
    <div className="executive-card">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-heading), var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'مهام اليوم المجدولة' : "Today's Tasks"}
            </h2>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '6px',
              background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)',
              color: themeAccent,
              fontWeight: '700'
            }}>
              {completedTasksCount} / {tasks.length} {lang === 'ar' ? 'مكتملة' : 'completed'}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            {lang === 'ar'
              ? `الحصص والاختبارات والواجبات المطلوبة منك اليوم لإنجاز خطتك الدراسية.`
              : 'Daily lessons, quizzes, and homework scheduled for today.'
            }
          </p>
        </div>

        {/* Task Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'lesson', labelAr: 'حصص', labelEn: 'Lessons' },
            { id: 'homework', labelAr: 'واجبات', labelEn: 'Homework' },
            { id: 'quiz', labelAr: 'كويزات', labelEn: 'Quizzes' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setTaskCategoryFilter(pill.id)}
              style={{
                background: taskCategoryFilter === pill.id ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)') : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)'),
                color: taskCategoryFilter === pill.id ? themeAccent : 'var(--text-secondary)',
                border: `1px solid ${taskCategoryFilter === pill.id ? (isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)') : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)')}`,
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'ar' ? pill.labelAr : pill.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTasks.map((task) => (
          <div key={task.id} className="executive-task-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Clickable Toggle Checkbox */}
              <button
                onClick={() => toggleTaskCompleted(task.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: task.isCompleted ? '#10B981' : 'var(--text-muted)',
                  transition: 'transform 0.15s ease'
                }}
                title={lang === 'ar' ? 'تحديد المهمة كمكتملة' : 'Toggle Completed'}
              >
                {task.isCompleted ? (
                  <CheckCircle2 size={22} fill="#10B981" color={isDark ? '#0E1726' : '#FFFFFF'} />
                ) : (
                  <Circle size={22} />
                )}
              </button>

              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: task.isCompleted ? 'line-through' : 'none'
                }}>
                  {task.titleAr}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: themeAccent, fontWeight: '600' }}>{task.subjectAr}</span>
                  <span>•</span>
                  <span>{task.duration}</span>
                  {task.deadline && (
                    <>
                      <span>•</span>
                      <span style={{ color: task.priority === 'urgent' ? '#F59E0B' : 'var(--text-secondary)', fontWeight: task.priority === 'urgent' ? '700' : '400' }}>
                        {task.deadline}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(task.actionRoute || '/student/courses')}
              className="executive-task-action-btn"
            >
              <span>
                {task.type === 'homework'
                  ? (lang === 'ar' ? 'حل الواجب' : 'Solve Homework')
                  : task.type === 'quiz'
                  ? (lang === 'ar' ? 'بدء الكويز' : 'Start Quiz')
                  : (lang === 'ar' ? 'استكمال الحصة' : 'Continue Lesson')
                }
              </span>
              {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
