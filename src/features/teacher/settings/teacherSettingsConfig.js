export const TEACHER_SETTINGS_TABS = ['profile', 'stages', 'payouts', 'preferences', 'security'];

export const DEFAULT_STAGES_CATALOG = [
  {
    id: 'stage-thanawya',
    nameAr: 'مرحلة الثانوية العامة',
    nameEn: 'Thanawya Amma Stage',
    descAr: 'الشهادة الرسمية والمؤهلة للجامعات ونظام البابل شيت الحديث',
    descEn: 'Official high school exit certification & university admission',
    grades: [
      { id: 'g-sec3', nameAr: 'الصف الثالث الثانوي', nameEn: '3rd Secondary (Thanawya Amma)' },
    ],
  },
  {
    id: 'stage-secondary',
    nameAr: 'المرحلة الثانوية',
    nameEn: 'Secondary Stage',
    descAr: 'صفوف النقل وتأسيس المواد العلمية والأدبية',
    descEn: '1st & 2nd secondary transition and foundation curricula',
    grades: [
      { id: 'g-sec2', nameAr: 'الصف الثاني الثانوي', nameEn: '2nd Secondary' },
      { id: 'g-sec1', nameAr: 'الصف الأول الثانوي', nameEn: '1st Secondary' },
    ],
  },
  {
    id: 'stage-prep',
    nameAr: 'المرحلة الإعدادية',
    nameEn: 'Preparatory Stage',
    descAr: 'مناهج العلوم والرياضيات واللغات للإعدادية العامة والشهادة',
    descEn: 'General prep stage curriculum and certificate level',
    grades: [
      { id: 'g-prep3', nameAr: 'الصف الثالث الإعدادي', nameEn: '3rd Preparatory' },
      { id: 'g-prep2', nameAr: 'الصف الثاني الإعدادي', nameEn: '2nd Preparatory' },
      { id: 'g-prep1', nameAr: 'الصف الأول الإعدادي', nameEn: '1st Preparatory' },
    ],
  },
  {
    id: 'stage-primary',
    nameAr: 'المرحلة الابتدائية',
    nameEn: 'Primary Stage',
    descAr: 'التأسيس المبكر ومناهج الصفوف الابتدائية المطورة',
    descEn: 'Early education foundations and primary grades',
    grades: [
      { id: 'g-pri6', nameAr: 'الصف السادس الابتدائي', nameEn: '6th Primary' },
      { id: 'g-pri5', nameAr: 'الصف الخامس الابتدائي', nameEn: '5th Primary' },
      { id: 'g-pri4', nameAr: 'الصف الرابع الابتدائي', nameEn: '4th Primary' },
    ],
  },
];

export const PAYOUT_ACCOUNT_TYPES = [
  {
    value: 'instapay',
    labelAr: 'عنوان إنستاباي الفوري (InstaPay IPA)',
    labelEn: 'InstaPay IPA',
    placeholderAr: 'مثال: teacher.name@instapay',
    placeholderEn: 'e.g. teacher.name@instapay',
  },
  {
    value: 'vodafone',
    labelAr: 'محفظة فودافون كاش / محفظة محمول',
    labelEn: 'Vodafone Cash / Mobile Wallet',
    placeholderAr: 'مثال: 010xxxxxxxx',
    placeholderEn: 'e.g. 010xxxxxxxx',
  },
  {
    value: 'cib',
    labelAr: 'حساب بنكي (IBAN / Account Number)',
    labelEn: 'Bank Account / IBAN',
    placeholderAr: 'مثال: EG890044556677889900112233445',
    placeholderEn: 'e.g. EG890044556677889900112233445',
  },
  {
    value: 'card',
    labelAr: 'بطاقة بنكية / فيزا للاستلام',
    labelEn: 'Bank / Debit Card',
    placeholderAr: 'مثال: 4111-xxxx-xxxx-1234',
    placeholderEn: 'e.g. 4111-xxxx-xxxx-1234',
  },
];

export function normalizePayoutAccount(pm) {
  if (!pm || typeof pm !== 'object') return null;
  const id = pm.id || pm.uuid;
  if (!id) return null;

  const value = String(
    pm.value ??
    pm.account_identifier ??
    pm.address ??
    pm.phone ??
    pm.accountNumber ??
    ''
  ).trim();

  return {
    id,
    type: pm.type || 'instapay',
    labelAr: pm.labelAr || pm.label_ar || 'حساب استلام مالي',
    labelEn: pm.labelEn || pm.label_en || 'Receiving Account',
    value,
    maskedValue: pm.maskedValue || value,
    isDefault: Boolean(pm.isDefault ?? pm.is_default),
    isActive: Boolean(pm.isActive ?? pm.is_active ?? true),
  };
}

export function buildTeacherFormState(settings = {}, fallbackUser = null) {
  const s = settings || {};
  const u = fallbackUser || {};

  return {
    nameAr: String(s.nameAr ?? s.name_ar ?? u.name ?? u.nameAr ?? ''),
    nameEn: String(s.nameEn ?? s.name_en ?? ''),
    titleAr: String(s.titleAr ?? s.title_ar ?? ''),
    subjectAr: String(s.subjectAr ?? s.subject_ar ?? u.subject ?? ''),
    email: String(s.email ?? u.email ?? ''),
    emailVerified: Boolean(s.emailVerified ?? u.email_verified ?? false),
    phone: String(s.phone ?? u.phone ?? ''),
    bioAr: String(s.bioAr ?? s.bio_ar ?? ''),
    avatar: s.avatar ?? u.avatar ?? null,
    isVerifiedEducator: Boolean(s.isVerifiedEducator ?? true),
    stagesTaught: Array.isArray(s.stagesTaught ?? s.stages_taught)
      ? [...(s.stagesTaught ?? s.stages_taught)]
      : [],
  };
}

export function isTeacherFormDirty(current, snapshot) {
  if (!current || !snapshot) return false;

  const scalarKeys = ['nameAr', 'nameEn', 'titleAr', 'subjectAr', 'phone', 'bioAr'];
  for (const key of scalarKeys) {
    if (String(current[key] ?? '').trim() !== String(snapshot[key] ?? '').trim()) {
      return true;
    }
  }

  const curStages = [...(current.stagesTaught || [])].sort();
  const snapStages = [...(snapshot.stagesTaught || [])].sort();
  if (curStages.length !== snapStages.length) return true;
  return curStages.some((val, idx) => val !== snapStages[idx]);
}
