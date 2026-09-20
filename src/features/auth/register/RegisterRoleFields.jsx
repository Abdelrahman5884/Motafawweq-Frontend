import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

export const RegisterRoleFields = ({
  role,
  grade,
  setGrade,
  studentCode,
  setStudentCode,
  subject,
  setSubject,
  centerName,
  setCenterName
}) => {
  const { lang, t } = useLanguage();

  if (role === 'student') {
    return (
      <div className="auth-grid-2">
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('gradeLabel')}
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          >
            {/* روضة */}
            <optgroup label={lang === 'ar' ? 'روضة الأطفال' : 'Kindergarten'}>
              <option value="kg1">{lang === 'ar' ? 'كجي 1 (روضة أولى)' : 'KG1 (Nursery)'}</option>
              <option value="kg2">{lang === 'ar' ? 'كجي 2 (روضة ثانية)' : 'KG2 (Reception)'}</option>
            </optgroup>
            {/* ابتدائي */}
            <optgroup label={lang === 'ar' ? 'المرحلة الابتدائية' : 'Primary Stage'}>
              <option value="primary1">{lang === 'ar' ? 'الصف الأول الابتدائي' : 'Primary 1st Grade'}</option>
              <option value="primary2">{lang === 'ar' ? 'الصف الثاني الابتدائي' : 'Primary 2nd Grade'}</option>
              <option value="primary3">{lang === 'ar' ? 'الصف الثالث الابتدائي' : 'Primary 3rd Grade'}</option>
              <option value="primary4">{lang === 'ar' ? 'الصف الرابع الابتدائي' : 'Primary 4th Grade'}</option>
              <option value="primary5">{lang === 'ar' ? 'الصف الخامس الابتدائي' : 'Primary 5th Grade'}</option>
              <option value="primary6">{lang === 'ar' ? 'الصف السادس الابتدائي' : 'Primary 6th Grade'}</option>
            </optgroup>
            {/* إعدادي */}
            <optgroup label={lang === 'ar' ? 'المرحلة الإعدادية' : 'Preparatory Stage'}>
              <option value="prep1">{lang === 'ar' ? 'الصف الأول الإعدادي' : 'Prep 1st Grade'}</option>
              <option value="prep2">{lang === 'ar' ? 'الصف الثاني الإعدادي' : 'Prep 2nd Grade'}</option>
              <option value="prep3">{lang === 'ar' ? 'الصف الثالث الإعدادي' : 'Prep 3rd Grade'}</option>
            </optgroup>
            {/* ثانوي */}
            <optgroup label={lang === 'ar' ? 'المرحلة الثانوية' : 'Secondary Stage'}>
              <option value="grade-sec1">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
              <option value="grade-sec2">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
              <option value="grade-sec3">{lang === 'ar' ? 'الصف الثالث الثانوي (ثانوية عامة)' : '3rd Secondary (Thanawya Amma)'}</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('centerCodeLabel')}
          </label>
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder={lang === 'ar' ? 'مثال: ROWAD-301' : 'e.g. ROWAD-301'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>
      </div>
    );
  }

  if (role === 'teacher') {
    return (
      <div className="auth-grid-2">
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('subjectLabel')}
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          >
            <option value="Biology">{lang === 'ar' ? 'الأحياء (Biology)' : 'Biology'}</option>
            <option value="Physics">{lang === 'ar' ? 'الفيزياء (Physics)' : 'Physics'}</option>
            <option value="Chemistry">{lang === 'ar' ? 'الكيمياء (Chemistry)' : 'Chemistry'}</option>
            <option value="Mathematics">{lang === 'ar' ? 'الرياضيات (Math)' : 'Mathematics'}</option>
            <option value="Arabic">{lang === 'ar' ? 'اللغة العربية' : 'Arabic Language'}</option>
            <option value="English">{lang === 'ar' ? 'اللغة الإنجليزية' : 'English'}</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'السنتر الرئيسي أو أونلاين' : 'Main Center or Online'}
          </label>
          <input
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder={lang === 'ar' ? 'مثال: سنتر الرواد بالدقي' : 'e.g. Dokki Center'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>
      </div>
    );
  }

  if (role === 'parent') {
    return (
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
          {lang === 'ar' ? 'كود الطالب لربط المتابعة' : 'Student Link Code'}
        </label>
        <input
          type="text"
          required
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          placeholder={lang === 'ar' ? 'أدخل كود ابنك المسجل بالمنصة (مثال: OMAR-2026)' : 'e.g. OMAR-2026'}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
        />
      </div>
    );
  }

  if (role === 'center') {
    return (
      <div className="auth-grid-2">
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('centerNameLabel')}
          </label>
          <input
            type="text"
            required
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder={lang === 'ar' ? 'أكاديمية النور التعليمية' : 'Al-Noor Academy'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('governorateLabel')}
          </label>
          <input
            type="text"
            required
            placeholder={lang === 'ar' ? 'الجيزة / الدقي' : 'Giza / Dokki'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};
