import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Calendar } from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentAvatar } from './ParentAvatar';
import { ParentEmptyState } from './ParentEmptyState';

export const ParentCoursesTab = ({ coursesData, lang }) => {
  const [sourceFilter, setSourceFilter] = useState('all');

  const items = useMemo(() => coursesData?.items || [], [coursesData]);
  const summary = coursesData?.summary || { totalCourses: items.length, avgProgress: 0 };

  const hasCourses = useMemo(() => items.some((i) => i.source === 'course'), [items]);
  const hasGroups = useMemo(() => items.some((i) => i.source === 'group'), [items]);

  const filteredItems = useMemo(() => {
    if (sourceFilter === 'all') return items;
    return items.filter((item) => item.source === sourceFilter);
  }, [items, sourceFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'المقررات والمجموعات الدراسية' : 'Enrolled Courses & Groups'}
          </h3>
          <InfoTooltip
            text={lang === 'ar'
              ? 'يعرض جميع المقررات والمجموعات النشطة المسجل بها الطالب ونسبة إتمام الحصص ومتوسط الدرجات.'
              : 'Shows all active courses and study groups with lesson completion and average quiz scores.'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {hasCourses && hasGroups && (
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            >
              <option value="all">{lang === 'ar' ? `الكل (${items.length})` : `All (${items.length})`}</option>
              <option value="course">{lang === 'ar' ? 'مقررات المنصة' : 'Online Courses'}</option>
              <option value="group">{lang === 'ar' ? 'مجموعات السنتر' : 'Center Groups'}</option>
            </select>
          )}

          {items.length > 0 && (
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
            }}>
              {lang === 'ar'
                ? `متوسط التقدم العام: ${summary.avgProgress}%`
                : `Avg Progress: ${summary.avgProgress}%`}
            </span>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <ParentEmptyState
          icon={BookOpen}
          title={lang === 'ar' ? 'لم ينضم الطالب لأي مقرر أو مجموعة بعد' : 'No active courses or groups'}
          subtitle={lang === 'ar'
            ? 'فور تسجيل الطالب في مقرر أو مجموعة دراسية ستظهر هنا تفاصيل تقدمه وحصصه تلقائياً.'
            : 'Once the student enrolls in a course or study group, progress details will appear here automatically.'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
          {filteredItems.map((c) => {
            const isGroup = c.source === 'group';
            const unitLabel = isGroup
              ? (lang === 'ar' ? 'حصة محضورة' : 'sessions attended')
              : (lang === 'ar' ? 'درس مكتمل' : 'lessons completed');

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ParentAvatar
                        src={c.teacherAvatar}
                        name={c.teacherNameAr}
                        size={46}
                        border="2px solid var(--primary-light)"
                      />
                      <div>
                        <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {lang === 'ar' ? c.nameAr : c.name}
                        </h4>
                        <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                          {lang === 'ar' ? c.teacherNameAr : c.teacherName}
                        </div>
                        {c.teacherTitleAr && (
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {c.teacherTitleAr}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      whiteSpace: 'nowrap',
                    }}>
                      {c.room}
                    </span>
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '14px',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {isGroup
                        ? (lang === 'ar' ? 'جدول المجموعة:' : 'Group Schedule:')
                        : (lang === 'ar' ? 'آخر درس:' : 'Latest Lesson:')}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {lang === 'ar' ? c.lastLessonAr : c.lastLesson}
                    </div>
                    {!isGroup && c.scheduleAr && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11.5px', color: 'var(--primary)', fontWeight: '600' }}>
                        <Calendar size={12} />
                        <span>{c.scheduleAr}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التقدم:' : 'Progress:'}</span>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                        {c.completedLessons} / {c.totalLessons} {unitLabel} ({c.progress}%)
                      </span>
                    </div>
                    <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success, #16A34A)' }}>
                    <CheckCircle2 size={14} />
                    <span>{lang === 'ar' ? `الحضور: ${c.attendance}` : `Attendance: ${c.attendance}`}</span>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                    {lang === 'ar' ? `المتوسط: ${c.avgScore}` : `Avg: ${c.avgScore}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
