import React from 'react';
import { BookOpen, Users, Type, AlignRight, GraduationCap } from 'lucide-react';

export const StudioLessonConfigCard = ({
  title,
  setTitle,
  description,
  setDescription,
  classGroup,
  setClassGroup,
  groups = [],
  courses = [],
  selectedCourseId = '',
  setSelectedCourseId,
  subject = '',
  grade = '',
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '800',
            }}
          >
            1
          </div>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'بيانات الحصة والمقرر' : 'Lesson & Course Details'}
          </h3>
        </div>

        {(subject || grade) && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 9px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <GraduationCap size={12} color="var(--primary)" />
            <span>{[subject, grade].filter(Boolean).join(' • ')}</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Lesson Title */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            <Type size={13} color="var(--primary)" />
            <span>{isAr ? 'عنوان الحصة أو المحاضرة' : 'Lesson Title'}</span>
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              isAr
                ? 'مثال: شرح الفصل الأول — الدعامة في الكائنات الحية'
                : 'e.g., Chapter 1: Support in Living Organisms'
            }
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Course & Study Group Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              <BookOpen size={13} color="var(--primary)" />
              <span>{isAr ? 'المقرر الدراسي (الكورس)' : 'Target Course'}</span>
            </label>
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId && setSelectedCourseId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            >
              <option value="">{isAr ? '-- بدون ربط بمقرر --' : '-- No Course Linked --'}</option>
              {courses.map((c) => {
                const cid = c.uuid || c.id;
                return (
                  <option key={cid} value={cid}>
                    {isAr ? c.titleAr || c.title_ar || c.title : c.titleEn || c.title || c.titleAr}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              <Users size={13} color="var(--primary)" />
              <span>{isAr ? 'المجموعة والقاعة' : 'Target Group / Hall'}</span>
            </label>
            <select
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            >
              <option value="">{isAr ? '-- جميع المجموعات --' : '-- All Study Groups --'}</option>
              {groups.map((grp) => {
                const val = grp.code || grp.uuid || grp.id;
                const name = isAr
                  ? grp.nameAr || grp.name_ar || grp.name || grp.title || grp.code
                  : grp.nameEn || grp.name || grp.name_en || grp.title || grp.code;
                const hall = grp.hallName || grp.hall || grp.centerName || grp.center || '';
                return (
                  <option key={grp.uuid || grp.id || grp.code} value={val}>
                    {hall ? `${name} — ${hall}` : name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Lesson Description */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            <AlignRight size={13} color="var(--primary)" />
            <span>{isAr ? 'وصف الحصة وأهم النقاط' : 'Lesson Overview & Notes'}</span>
          </label>
          <textarea
            rows={3}
            value={description || ''}
            onChange={(e) => setDescription && setDescription(e.target.value)}
            placeholder={
              isAr
                ? 'اكتب نبذة مختصرة عن أهم النقاط المشروحة في هذه الحصة وملاحظات المذاكرة لطلابك...'
                : 'Add a short overview of concepts covered in this lesson...'
            }
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              lineHeight: 1.55,
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
