import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'دمياط',
  'كفر الشيخ',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان'
];

export const RegisterRoleFields = ({
  role,
  grade,
  setGrade,
  track,
  setTrack,
  governorate,
  setGovernorate,
  parentPhone,
  setParentPhone,
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
        {/* المرحلة والصف الدراسي */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'المرحلة والصف الدراسي *' : 'Educational Stage & Grade *'}
          </label>
          <select
            value={grade || '3rd Secondary (Thanawya Amma)'}
            onChange={(e) => {
              const newGrade = e.target.value;
              setGrade(newGrade);
              // Smart track adjustment
              if (setTrack) {
                if (newGrade.includes('Primary') || newGrade.includes('Preparatory') || newGrade === '1st Secondary') {
                  setTrack('عام');
                } else if (newGrade === '2nd Secondary') {
                  setTrack('علمي');
                } else if (newGrade.includes('3rd Secondary')) {
                  setTrack('علمي علوم');
                }
              }
            }}
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
            {/* المرحلة الابتدائية */}
            <optgroup label={lang === 'ar' ? 'المرحلة الابتدائية (Primary)' : 'Primary Stage'}>
              <option value="1st Primary">{lang === 'ar' ? 'الصف الأول الابتدائي' : '1st Primary'}</option>
              <option value="2nd Primary">{lang === 'ar' ? 'الصف الثاني الابتدائي' : '2nd Primary'}</option>
              <option value="3rd Primary">{lang === 'ar' ? 'الصف الثالث الابتدائي' : '3rd Primary'}</option>
              <option value="4th Primary">{lang === 'ar' ? 'الصف الرابع الابتدائي' : '4th Primary'}</option>
              <option value="5th Primary">{lang === 'ar' ? 'الصف الخامس الابتدائي' : '5th Primary'}</option>
              <option value="6th Primary">{lang === 'ar' ? 'الصف السادس الابتدائي' : '6th Primary'}</option>
            </optgroup>

            {/* المرحلة الإعدادية */}
            <optgroup label={lang === 'ar' ? 'المرحلة الإعدادية (Preparatory)' : 'Preparatory Stage'}>
              <option value="1st Preparatory">{lang === 'ar' ? 'الصف الأول الإعدادي' : '1st Preparatory'}</option>
              <option value="2nd Preparatory">{lang === 'ar' ? 'الصف الثاني الإعدادي' : '2nd Preparatory'}</option>
              <option value="3rd Preparatory (Certificate)">{lang === 'ar' ? 'الصف الثالث الإعدادي (الشهادة الإعدادية)' : '3rd Preparatory (Middle School Cert)'}</option>
            </optgroup>

            {/* المرحلة الثانوية */}
            <optgroup label={lang === 'ar' ? 'المرحلة الثانوية (Secondary)' : 'Secondary / High School'}>
              <option value="1st Secondary">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
              <option value="2nd Secondary">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
              <option value="3rd Secondary (Thanawya Amma)">{lang === 'ar' ? 'الصف الثالث الثانوي (الثانوية العامة)' : '3rd Secondary (Thanawya Amma)'}</option>
            </optgroup>
          </select>
        </div>

        {/* الشعبة والتخصص */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'الشعبة والتخصص *' : 'Track / Stream *'}
          </label>
          <select
            value={track || 'علمي علوم'}
            onChange={(e) => setTrack && setTrack(e.target.value)}
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
            {(grade?.includes('Primary') || grade?.includes('Preparatory') || grade === '1st Secondary') && (
              <>
                <option value="عام">{lang === 'ar' ? 'شعبة عامة (المنهج المطور الموحد)' : 'General Unified Curriculum'}</option>
                <option value="لغات">{lang === 'ar' ? 'مدارس لغات ورسمية تجريبية' : 'Experimental / Languages'}</option>
                <option value="أزهر">{lang === 'ar' ? 'التعليم الأزهري النموذجي' : 'Al-Azhar Curriculum'}</option>
              </>
            )}

            {grade === '2nd Secondary' && (
              <>
                <option value="علمي">{lang === 'ar' ? 'الشعبة العلمية (علمي)' : 'Scientific Track'}</option>
                <option value="أدبي">{lang === 'ar' ? 'الشعبة الأدبية (أدبي)' : 'Humanities / Literary'}</option>
                <option value="علمي لغات">{lang === 'ar' ? 'علمي لغات وتجريبي' : 'Scientific (Languages)'}</option>
                <option value="أدبي لغات">{lang === 'ar' ? 'أدبي لغات وتجريبي' : 'Literary (Languages)'}</option>
              </>
            )}

            {(!grade || grade.includes('3rd Secondary')) && (
              <>
                <option value="علمي علوم">{lang === 'ar' ? 'علمي علوم (الأحياء والجيولوجيا)' : 'Scientific - Biology'}</option>
                <option value="علمي رياضة">{lang === 'ar' ? 'علمي رياضة (الرياضيات والفيزياء)' : 'Scientific - Mathematics'}</option>
                <option value="أدبي">{lang === 'ar' ? 'الشعبة الأدبية (التاريخ والجغرافيا)' : 'Humanities / Literary'}</option>
                <option value="علمي علوم لغات">{lang === 'ar' ? 'علمي علوم (مدارس لغات)' : 'Biology Track (Languages)'}</option>
                <option value="علمي رياضة لغات">{lang === 'ar' ? 'علمي رياضة (مدارس لغات)' : 'Math Track (Languages)'}</option>
              </>
            )}
          </select>
        </div>

        {/* المحافظة */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'المحافظة / المدينة' : 'Governorate / City'}
          </label>
          <select
            value={governorate || 'الجيزة'}
            onChange={(e) => setGovernorate && setGovernorate(e.target.value)}
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
            {EGYPT_GOVERNORATES.map(gov => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>

        {/* رقم هاتف ولي الأمر (اختياري) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'رقم ولي الأمر (اختياري للمتابعة)' : 'Parent Phone (Optional)'}
          </label>
          <input
            type="tel"
            value={parentPhone || ''}
            onChange={(e) => setParentPhone && setParentPhone(e.target.value)}
            placeholder="01223344556"
            dir="ltr"
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

        {/* كود السنتر أو المدرس */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('centerCodeLabel')}
          </label>
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder={lang === 'ar' ? 'مثال: ROWAD-301 أو اتركه فارغاً' : 'e.g. ROWAD-301 or leave empty'}
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
