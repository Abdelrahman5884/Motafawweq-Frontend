import React from 'react';

export const StudioLessonConfigCard = ({
  title,
  setTitle,
  description,
  setDescription,
  subject,
  setSubject,
  grade,
  setGrade,
  classGroup,
  setClassGroup,
  groups = [],
  courses = [],
  selectedCourseId = '',
  setSelectedCourseId,
  subjectOptions = [],
  stageOptions = [],
  lang,
  isRtl
}) => {
  const defaultSubjects = [
    { value: 'Biology', labelAr: 'الأحياء', labelEn: 'Biology' },
    { value: 'Physics', labelAr: 'الفيزياء', labelEn: 'Physics' },
    { value: 'Chemistry', labelAr: 'الكيمياء', labelEn: 'Chemistry' },
    { value: 'Mathematics', labelAr: 'الرياضيات', labelEn: 'Mathematics' },
  ];
  const resolvedSubjects = subjectOptions.length > 0 ? subjectOptions : defaultSubjects;

  const defaultStages = [
    { value: '3rd Secondary', labelAr: 'الصف الثالث الثانوي (ثانوية عامة)', labelEn: '3rd Secondary (Thanawya)' },
    { value: '2nd Secondary', labelAr: 'الصف الثاني الثانوي', labelEn: '2nd Secondary' },
    { value: '1st Secondary', labelAr: 'الصف الأول الثانوي', labelEn: '1st Secondary' },
    { value: '3rd Prep', labelAr: 'الصف الثالث الإعدادي (شهادة إعدادية)', labelEn: '3rd Prep' },
  ];
  const resolvedStages = stageOptions.length > 0 ? stageOptions : defaultStages;
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
        {lang === 'ar' ? '1. بيانات الحصة والمجموعة' : '1. Lesson & Class Details'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Lesson Title */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'عنوان الحصة أو المحاضرة' : 'Lesson Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
        </div>

        {/* Lesson Description */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'وصف الحصة ومحاور الشرح (Description)' : 'Lesson Description & Key Topics'}
          </label>
          <textarea
            rows={3}
            value={description || ''}
            onChange={(e) => setDescription && setDescription(e.target.value)}
            placeholder={lang === 'ar' 
              ? 'اكتب نبذة مختصرة عن أهم النقاط المشروحة في هذه الحصة، وملاحظات المذاكرة لطلابك...' 
              : 'Add an overview of concepts explained in this lesson and study notes for students...'}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              lineHeight: 1.5,
              resize: 'vertical',
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
            }}
          />
        </div>

        {/* Subject */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'المادة الدراسية' : 'Subject'}
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px'
            }}
          >
            {resolvedSubjects.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {lang === 'ar' ? opt.labelAr : opt.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'المرحلة الدراسية' : 'Educational Stage'}
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px'
            }}
          >
            {resolvedStages.map((st) => (
              <option key={st.value} value={st.value}>
                {lang === 'ar' ? st.labelAr : st.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'المقرر الدراسي (الكورس)' : 'Target Course'}
          </label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId && setSelectedCourseId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px'
            }}
          >
            <option value="">{lang === 'ar' ? '-- بدون ربط بمقرر --' : '-- No Course Linked --'}</option>
            {courses.map((c) => {
              const cid = c.uuid || c.id;
              return (
                <option key={cid} value={cid}>
                  {lang === 'ar' ? (c.titleAr || c.title_ar || c.title) : (c.titleEn || c.title || c.titleAr)}
                </option>
              );
            })}
          </select>
        </div>

        {/* Class Group */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'المجموعة والقاعة' : 'Target Group / Hall'}
          </label>
          <select
            value={classGroup}
            onChange={(e) => setClassGroup(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px'
            }}
          >
            <option value="">{lang === 'ar' ? '-- اختر المجموعة الدراسية --' : '-- Select Study Group --'}</option>
            {groups.map((grp) => {
              const val = grp.code || grp.uuid || grp.id;
              const name = lang === 'ar'
                ? (grp.nameAr || grp.name_ar || grp.name || grp.title || grp.code)
                : (grp.nameEn || grp.name || grp.name_en || grp.title || grp.code);
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
    </div>
  );
};
