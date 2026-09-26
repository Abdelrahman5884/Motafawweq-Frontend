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
  lang,
  isRtl
}) => {
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
            <option value="Biology">{lang === 'ar' ? 'الأحياء' : 'Biology'}</option>
            <option value="Physics">{lang === 'ar' ? 'الفيزياء' : 'Physics'}</option>
            <option value="Chemistry">{lang === 'ar' ? 'الكيمياء' : 'Chemistry'}</option>
            <option value="Mathematics">{lang === 'ar' ? 'الرياضيات' : 'Mathematics'}</option>
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
            <option value="3rd Secondary">{lang === 'ar' ? 'الصف الثالث الثانوي (ثانوية عامة)' : '3rd Secondary (Thanawya)'}</option>
            <option value="2nd Secondary">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
            <option value="1st Secondary">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
            <option value="3rd Prep">{lang === 'ar' ? 'الصف الثالث الإعدادي (شهادة إعدادية)' : '3rd Prep'}</option>
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
            <option value="cls-dokki-301">{lang === 'ar' ? 'سنتر الدقي - قاعة النخبة (الأحد 4 عصراً)' : 'Dokki Elite Hall (Sun 4 PM)'}</option>
            <option value="cls-nasr-302">{lang === 'ar' ? 'سنتر مدينة نصر - قاعة 1 (الثلاثاء 6 مساءً)' : 'Nasr City Hall 1 (Tue 6 PM)'}</option>
            <option value="cls-online-303">{lang === 'ar' ? 'مجموعة الأونلاين التفاعلية (الجمعة)' : 'Online Interactive Cohort'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
