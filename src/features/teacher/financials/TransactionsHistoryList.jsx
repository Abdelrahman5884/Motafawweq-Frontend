import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  Smartphone,
  CreditCard,
  Zap,
  Building,
  CheckCircle2,
  Calendar,
  BookOpen,
  User,
  Phone
} from 'lucide-react';

export const TransactionsHistoryList = ({ transactions = [], lang = 'ar', isRtl = true }) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all'); // 'all' | 'instapay' | 'vodafone' | 'cib'

  const filtered = transactions.filter((tx) => {
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !s ||
      (tx.studentNameAr && tx.studentNameAr.toLowerCase().includes(s)) ||
      (tx.studentNameEn && tx.studentNameEn.toLowerCase().includes(s)) ||
      (tx.courseNameAr && tx.courseNameAr.toLowerCase().includes(s)) ||
      (tx.courseNameEn && tx.courseNameEn.toLowerCase().includes(s)) ||
      (tx.referenceNum && tx.referenceNum.toLowerCase().includes(s));

    const matchesMethod = methodFilter === 'all' || tx.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const getMethodIcon = (method) => {
    switch (method) {
      case 'instapay':
        return <Zap size={16} color="var(--primary)" />;
      case 'vodafone':
        return <Smartphone size={16} color="var(--error)" />;
      case 'cib':
        return <Building size={16} color="var(--primary)" />;
      default:
        return <CreditCard size={16} color="var(--primary)" />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '26px 28px',
        boxShadow: 'var(--shadow-sm)',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* Header and Filter Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'سجل اشتراكات الطلاب والتحويلات المستلمة' : 'Student Purchases & Direct Receipts'}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {isAr
              ? 'الطلاب الذين اشتركوا في كورساتك وملازمك وحوّلوا المبلغ مباشرة لحساباتك'
              : 'Students enrolled in your courses with direct transfers to your verified accounts'}
          </p>
        </div>

        {/* Method Filter Pills */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '99px',
            padding: '3px',
            gap: '3px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'instapay', labelAr: 'إنستاباي', labelEn: 'InstaPay' },
            { id: 'vodafone', labelAr: 'فودافون كاش', labelEn: 'Vodafone Cash' },
            { id: 'cib', labelAr: 'تحويل بنكي', labelEn: 'Bank CIB' }
          ].map((pill) => {
            const isSelected = methodFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setMethodFilter(pill.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '99px',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isSelected ? '800' : '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isAr ? pill.labelAr : pill.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Box */}
      <div style={{ marginBottom: '18px', position: 'relative' }}>
        <input
          type="text"
          placeholder={
            isAr
              ? 'البحث باسم الطالب، اسم الكورس، أو رقم العملية المرجعي...'
              : 'Search by student name, course title, or reference ID...'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 40px 11px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-medium)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <Search
          size={16}
          color="var(--text-muted)"
          style={{
            position: 'absolute',
            insetInlineEnd: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* List of Direct Transactions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '13.5px'
            }}
          >
            {isAr ? 'لا توجد نتائج مطابقة لخيارات البحث' : 'No transactions matching your criteria'}
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '14px',
                transition: 'background-color 0.15s ease'
              }}
            >
              {/* Left Student & Course Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(21, 136, 199, 0.12)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <BookOpen size={20} />
                </div>

                <div>
                  {/* Student Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? tx.studentNameAr : (tx.studentNameEn || tx.studentNameAr)}
                    </span>
                    {tx.gradeAr && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '1px 7px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {tx.gradeAr}
                      </span>
                    )}
                  </div>

                  {/* Course Subscribed to */}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '600' }}>
                    {isAr ? `اشترك في: ${tx.courseNameAr}` : `Enrolled: ${tx.courseNameEn || tx.courseNameAr}`}
                  </div>

                  {/* Payment Channel & Meta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '11.5px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: '700' }}>
                      {getMethodIcon(tx.method)}
                      <span>{isAr ? tx.methodAr : (tx.methodEn || tx.methodAr)}</span>
                    </span>
                    <span>•</span>
                    <span>{tx.date} ({tx.time})</span>
                    <span>•</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>رقم العملية: {tx.referenceNum || tx.id}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Amount & Confirmed Badge */}
              <div style={{ textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: 'var(--success)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  +{tx.amountEgp.toLocaleString()} <span style={{ fontSize: '13px' }}>{isAr ? 'ج.م' : 'EGP'}</span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    marginTop: '4px'
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>{isAr ? (tx.statusAr || 'مستلم ومؤكد مباشرة') : (tx.statusEn || 'Received Direct')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsHistoryList;
