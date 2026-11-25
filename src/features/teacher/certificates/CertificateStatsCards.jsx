import React from 'react';
import { Award, ShieldCheck, ShieldOff, TrendingUp } from 'lucide-react';

export const CertificateStatsCards = ({ stats, lang, isMobile }) => {
  const isAr = lang === 'ar';
  const total = Number(stats?.total ?? 0);
  const verified = Number(stats?.verifiedCount ?? 0);
  const revoked = Number(stats?.revokedCount ?? 0);
  const avgGrade = Number(stats?.averageGrade ?? 0);

  const cards = [
    {
      id: 'total',
      label: isAr ? 'إجمالي الشهادات المصدّرة' : 'Total Issued',
      value: total.toLocaleString(),
      sub: isAr ? 'موقعة رقمياً برمز QR' : 'Cryptographically signed',
      color: 'var(--primary)',
      bg: 'rgba(21, 136, 199, 0.12)',
      Icon: Award,
    },
    {
      id: 'verified',
      label: isAr ? 'شهادات معتمدة وسارية' : 'Active Verified',
      value: verified.toLocaleString(),
      sub:
        avgGrade > 0
          ? isAr
            ? `متوسط الدرجات: ${avgGrade}%`
            : `Avg score: ${avgGrade}%`
          : isAr
            ? 'قابلة للتحقق الفوري'
            : 'Publicly verifiable',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      Icon: ShieldCheck,
    },
    {
      id: 'revoked',
      label: isAr ? 'شهادات ملغاة / مسحوبة' : 'Revoked',
      value: revoked.toLocaleString(),
      sub:
        revoked > 0
          ? isAr
            ? 'تظهر كملغاة في صفحة التحقق'
            : 'Flagged as revoked on verify'
          : isAr
            ? 'لا توجد شهادات ملغاة'
            : 'No revoked certificates',
      color: revoked > 0 ? '#EF4444' : '#64748B',
      bg: revoked > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(100, 116, 139, 0.12)',
      Icon: revoked > 0 ? ShieldOff : TrendingUp,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '14px',
        marginBottom: '22px',
      }}
    >
      {cards.map((card) => {
        const CardIcon = card.Icon;
        return (
          <div
            key={card.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '16px 18px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: card.color, marginTop: '6px' }}>
                {card.sub}
              </div>
            </div>

            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CardIcon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CertificateStatsCards;
