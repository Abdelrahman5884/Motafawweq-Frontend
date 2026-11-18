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

  const countByCategory = (cat) =>
    cat === 'all' ? tasks.length : tasks.filter((t) => t.type === cat).length;

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
              ? 'الحصص والاختبارات والواجبات المطلوبة منك اليوم لإنجاز خطتك الدراسية.'
              : 'Daily lessons, quizzes, and homework scheduled for today.'}
          </p>
        </div>

        {/* Task Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'lesson', labelAr: 'حصص', labelEn: 'Lessons' },
            { id: 'homework', labelAr: 'واجبات', labelEn: 'Homework' },
            { id: 'quiz', labelAr: 'كويزات', labelEn: 'Quizzes' }
          ].map((pill) => {
            const count = countByCategory(pill.id);
            const isActive = taskCategoryFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setTaskCategoryFilter(pill.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)') : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)'),
                  color: isActive ? themeAccent : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? (isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)') : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)')}`,
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lang === 'ar' ? pill.labelAr : pill.labelEn}</span>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  padding: '0 5px',
                  borderRadius: '5px',
                  background: isActive ? (isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.18)') : 'rgba(148, 163, 184, 0.15)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTasks.length === 0 && (
          <div style={{
            padding: '28px 16px',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: '700'
          }}>
            {lang === 'ar' ? 'لا توجد مهام مجدولة في هذا التصنيف حالياً.' : 'No tasks scheduled in this category.'}
          </div>
        )}
        {filteredTasks.map((task) => {
          const targetRoute = task.actionRoute || task.route || '/student/courses';
          return (
            <div key={task.id} className="executive-task-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
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
                    {lang === 'ar' ? task.titleAr : (task.titleEn || task.titleAr)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {task.subjectAr && (
                      <span style={{ color: themeAccent, fontWeight: '700' }}>{task.subjectAr}</span>
                    )}
                    {task.duration && (
                      <>
                        {task.subjectAr && <span>•</span>}
                        <span>{task.duration}</span>
                      </>
                    )}
                    {task.deadline && (
                      <>
                        {(task.subjectAr || task.duration) && <span>•</span>}
                        <span style={{ color: task.priority === 'urgent' ? '#F59E0B' : 'var(--text-secondary)', fontWeight: task.priority === 'urgent' ? '700' : '500' }}>
                          {task.deadline}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(targetRoute)}
                className="executive-task-action-btn"
              >
                <span>
                  {task.type === 'homework'
                    ? (lang === 'ar' ? 'حل الواجب' : 'Solve Homework')
                    : task.type === 'quiz'
                    ? (lang === 'ar' ? 'بدء الاختبار' : 'Start Exam')
                    : (lang === 'ar' ? 'استكمال الحصة' : 'Open Lesson')
                  }
                </span>
                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
