export const CENTER_SETTINGS_TABS = ['profile', 'preferences', 'security'];

export const CENTER_PLANS = {
  free: {
    tier: 'free',
    nameAr: 'الباقة المجانية',
    nameEn: 'Free Plan',
  },
  plus: {
    tier: 'plus',
    nameAr: 'باقة سنتر بلس',
    nameEn: 'Center Plus',
  },
  pro: {
    tier: 'pro',
    nameAr: 'باقة سنتر برو',
    nameEn: 'Center Pro',
  },
};

export function buildCenterFormState(settings = {}, fallbackUser = null) {
  const s = settings || {};
  const u = fallbackUser || {};

  return {
    centerNameAr: String(s.centerNameAr ?? s.nameAr ?? u.centerNameAr ?? u.center_name_ar ?? ''),
    centerNameEn: String(s.centerNameEn ?? s.nameEn ?? u.centerNameEn ?? u.center_name_en ?? ''),
    managerName: String(s.managerName ?? u.name ?? u.nameAr ?? ''),
    email: String(s.email ?? u.email ?? ''),
    emailVerified: Boolean(s.emailVerified ?? u.email_verified ?? false),
    phone: String(s.phone ?? s.centerPhone ?? u.phone ?? ''),
    workingHours: String(s.workingHours ?? s.workingHoursAr ?? '08:00 ص - 10:00 م'),
    addressAr: String(s.addressAr ?? s.centerAddress ?? ''),
    avatar: s.avatar ?? s.logoUrl ?? u.avatar ?? null,
    isVerifiedCenter: Boolean(s.isVerifiedCenter ?? false),
    planTier: String(s.planTier ?? u.plan_tier ?? 'free').toLowerCase(),
    planNameAr: s.planNameAr ?? u.plan_name_ar ?? null,
    planNameEn: s.planNameEn ?? u.plan_name_en ?? null,
  };
}

export function isCenterFormDirty(current, snapshot) {
  if (!current || !snapshot) return false;

  const scalarKeys = [
    'centerNameAr',
    'centerNameEn',
    'managerName',
    'phone',
    'workingHours',
    'addressAr',
  ];

  for (const key of scalarKeys) {
    if (String(current[key] ?? '').trim() !== String(snapshot[key] ?? '').trim()) {
      return true;
    }
  }

  return false;
}
