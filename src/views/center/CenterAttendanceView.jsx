import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { 
  CheckCircle2, 
  QrCode, 
  Scan, 
  Clock, 
  Users, 
  Building2, 
  Calendar, 
  AlertCircle, 
  ShieldAlert, 
  Send, 
  Search, 
  Filter, 
  DollarSign, 
  Check, 
  Sparkles,
  ArrowRight,
  UserCheck,
  UserX,
  BellRing,
  Download
} from 'lucide-react';

export const CenterAttendanceView = () => {
  const { lang, isRtl } = useLanguage();
  const { 
    attendanceRecords, 
    processSmartStudentQrScan, 
    branches, 
    selectedBranchId,
    exportToCsv
  } = useCenter();
  const { groups } = useGroups();

  const [scanInput, setScanInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedTime, setSimulatedTime] = useState('14:15'); // 2:15 PM default for demo testing matching the 2 PM cohort
  const [simulatedDay, setSimulatedDay] = useState('Saturday');
  const [alertSentId, setAlertSentId] = useState(null);

  // Quick Demo Student QR Presets for 1-click testing
  const demoStudentQrs = [
    { qrId: 'QR-STU-01001122334', name: 'أحمد محمود رضوان', phone: '01001122334', label: 'طالب مسجل (مجموعة الفيزياء - السبت 2:00 م)' },
    { qrId: 'QR-STU-01009988776', name: 'سارة خالد المنشاوي', phone: '01009988776', label: 'طالبة مسجلة (مجموعة الكيمياء - الأحد 4:00 م)' },
    { qrId: 'QR-STU-01112233445', name: 'محمد إبراهيم الشناوي', phone: '01112233445', label: 'طالب مسجل (مجموعة الأحياء - الاثنين 2:00 م)' }
  ];

  const handleScanSubmit = (e) => {
    if (e) e.preventDefault();
    if (!scanInput.trim()) return;

    const result = processSmartStudentQrScan(scanInput.trim(), simulatedDay, simulatedTime);
    setLastScanResult(result);
    setScanInput('');
  };

  const handleQuickScan = (qrCode, targetDay = 'Saturday', targetTime = '14:15') => {
    setSimulatedDay(targetDay);
    setSimulatedTime(targetTime);
    const result = processSmartStudentQrScan(qrCode, targetDay, targetTime);
    setLastScanResult(result);
  };

  const handleSendAbsenceAlert = (studentName, phone) => {
    setAlertSentId(phone);
    setTimeout(() => {
      setAlertSentId(null);
    }, 2500);
  };

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(rec => {
    const matchesGroup = selectedGroupFilter === 'all' || rec.groupId === selectedGroupFilter;
    const matchesSearch = !searchQuery || 
      rec.studentNameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentPhone?.includes(searchQuery) ||
      rec.groupNameAr?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'var(--bg-surface)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--success-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)'
          }}>
            <Scan size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'بوابة الحضور الذكية' : 'Smart Gate Attendance'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'الماسح التلقائي نشط' : 'Auto-Scanner Active'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'حضور الطلاب بالباركود والمطابقة التلقائية للمواعيد' : 'QR Attendance & Auto Time Matcher'}
            </h1>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            <Calendar size={14} color="var(--primary)" />
            <span>{simulatedDay}</span>
            <span style={{ color: 'var(--text-secondary)' }}>•</span>
            <Clock size={14} color="var(--primary)" />
            <span>{simulatedTime}</span>
          </div>

          {/* Export to Excel (Feature 78) */}
          <button
            onClick={() => {
              const headers = ['اسم الطالب', 'الهاتف', 'المجموعة', 'المادة', 'المدرس', 'القاعة', 'التوقيت', 'طريقة المسح', 'حالة السداد'];
              const rows = filteredRecords.map(r => [
                r.studentNameAr,
                r.studentPhone,
                r.groupNameAr,
                r.subjectAr,
                r.teacherNameAr,
                r.hallName,
                r.timestamp,
                'باركود تلقائي',
                r.paymentStatusAr || 'مسدد'
              ]);
              exportToCsv('سجل_حضور_الطلاب', headers, rows);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span>{lang === 'ar' ? 'تصدير كشف الحضور Excel' : 'Export Excel'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Scanner on Left/Top, Live Feed on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* SCANNER STATION CARD */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <QrCode size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'ماسح باركود بوابة السنتر' : 'Center Entrance Scanner'}
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {lang === 'ar'
                ? 'امسح باركود الطالب أو بطاقته الذكية. سيتعرف النظام تلقائياً على موعد حصته الحالية ويسجل حضوره في القاعة المحددة.'
                : 'Scan student pass. System auto-detects current time slot and registers presence.'}
            </p>
          </div>

          {/* Scanner Input Box */}
          <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                autoFocus
                placeholder={lang === 'ar' ? 'امسح الباركود أو اكتب رقم هاتف / كود الطالب...' : 'Scan barcode or enter student code...'}
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--primary)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '13px 22px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Scan size={16} />
              <span>{lang === 'ar' ? 'مسح' : 'Scan'}</span>
            </button>
          </form>

          {/* Simulated Time Controller for Testing Matcher */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              <Clock size={14} color="var(--primary)" />
              <span>{lang === 'ar' ? 'محاكاة وقت دخول الطالب:' : 'Simulate Entrance Time:'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={simulatedDay}
                onChange={(e) => setSimulatedDay(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                <option value="Saturday">السبت</option>
                <option value="Sunday">الأحد</option>
                <option value="Monday">الاثنين</option>
                <option value="Tuesday">الثلاثاء</option>
                <option value="Wednesday">الأربعاء</option>
                <option value="Thursday">الخميس</option>
              </select>

              <input
                type="time"
                value={simulatedTime}
                onChange={(e) => setSimulatedTime(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>

          {/* Quick Demo Test Buttons */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'اختبار سريع بباركود طالب تجريبي:' : 'Quick Demo Barcode Test:'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {demoStudentQrs.map(s => (
                <button
                  key={s.qrId}
                  onClick={() => handleQuickScan(s.qrId, 'Saturday', '14:15')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    textAlign: isRtl ? 'right' : 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    fontWeight: '700'
                  }}>
                    {lang === 'ar' ? 'مسح الآن' : 'Scan'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SCAN RESULT FEEDBACK CARD */}
          {lastScanResult && (
            <div style={{
              padding: '16px 18px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: lastScanResult.success ? 'var(--success-light)' : 'var(--error-light)',
              border: `1.5px solid ${lastScanResult.success ? 'rgba(22, 163, 74, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {lastScanResult.success ? (
                  <CheckCircle2 size={24} color="var(--success)" />
                ) : (
                  <AlertCircle size={24} color="var(--danger)" />
                )}
                <div>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    margin: 0,
                    color: lastScanResult.success ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {lastScanResult.success 
                      ? (lastScanResult.isDuplicateNotice ? 'تنبيه: تم تسجيل الحضور مسبقاً' : 'تم التحقق وتسجيل الحضور تلقائياً')
                      : 'فشل التعرف على الحصة'}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {lastScanResult.messageAr}
                  </div>
                </div>
              </div>

              {lastScanResult.success && lastScanResult.group && (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>الطالب: </span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{lastScanResult.studentNameAr}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>المادة: </span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{lastScanResult.group.subjectAr}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>المدرس: </span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{lastScanResult.group.teacherNameAr}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>القاعة: </span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      {lastScanResult.record?.hallName || lastScanResult.slot?.hall || 'القاعة 1'}
                    </span>
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>حالة الاشتراك المالي:</span>
                    <span style={{
                      fontWeight: '700',
                      color: 'var(--success)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--success-light)'
                    }}>
                      مسدد بالكامل (لا توجد متأخرات)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ATTENDANCE STATS & ABSENCE ALERTS CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Operations Overview */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
              {lang === 'ar' ? 'مؤشرات الحضور لليوم الحالي' : 'Today Attendance Operations'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-light)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--success)' }}>
                  {attendanceRecords.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  {lang === 'ar' ? 'حضور بالباركود' : 'Scanned Present'}
                </div>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--warning-light)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--warning)' }}>
                  94.2%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  {lang === 'ar' ? 'نسبة الالتزام' : 'Compliance Rate'}
                </div>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--error-light)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--danger)' }}>
                  4
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  {lang === 'ar' ? 'غياب مسجل' : 'Absences'}
                </div>
              </div>
            </div>

            {/* Feature 35: Absence Alerts to Parents */}
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BellRing size={16} color="var(--danger)" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'تنبيهات الغياب الفورية لأولياء الأمور' : 'Absence Alerts to Parents'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'إشعار واتساب / SMS' : 'SMS / WhatsApp'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                {lang === 'ar'
                  ? 'يتم إشعار ولي أمر الطالب تلقائياً في حال انقضاء 20 دقيقة من موعد الحصة دون مسح باركود الدخول.'
                  : 'Automated notification sent to guardian if student passes 20 min mark without gate check-in.'}
              </p>

              {/* Sample student with absence */}
              <div style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>كريم حسام الدين</span>
                  <span style={{ color: 'var(--text-secondary)', marginRight: '6px', marginLeft: '6px' }}>— غياب فيزياء 2:00 م</span>
                </div>
                <button
                  onClick={() => handleSendAbsenceAlert('كريم حسام الدين', '01011224455')}
                  disabled={alertSentId === '01011224455'}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: alertSentId === '01011224455' ? 'var(--success-light)' : 'var(--error-light)',
                    color: alertSentId === '01011224455' ? 'var(--success)' : 'var(--danger)',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '11px',
                    cursor: alertSentId === '01011224455' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Send size={12} />
                  <span>{alertSentId === '01011224455' ? 'تم الإرسال لولي الأمر' : 'إرسال تنبيه الآن'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE ATTENDANCE REGISTER TABLE (Feature 33) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Table Filters Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-app)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل الحضور اللحظي للسنتر' : 'Live Center Attendance Register'}
            </h3>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              fontWeight: '700'
            }}>
              {filteredRecords.length} {lang === 'ar' ? 'سجل حضور' : 'records'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث باسم الطالب أو الهاتف...' : 'Search student...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Group Filter */}
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              <option value="all">{lang === 'ar' ? 'جميع المجموعات' : 'All Cohorts'}</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'اسم الطالب' : 'Student Name'}
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'المجموعة والمادة' : 'Group & Subject'}
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'القاعة' : 'Room'}
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'وقت الدخول' : 'Check-in Time'}
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'طريقة المسح' : 'Method'}
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'الحالة والاشتراك' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {lang === 'ar' ? 'لا توجد سجلات حضور مطابقة لخيارات البحث' : 'No attendance records found'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr
                    key={rec.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {rec.studentNameAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {rec.studentPhone}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {rec.groupNameAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {rec.subjectAr} • {rec.teacherNameAr}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(21, 136, 199, 0.08)'
                      }}>
                        {rec.hallName}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>
                        <Clock size={13} color="var(--primary)" />
                        <span>{rec.timestamp.split(' ')[1] || rec.timestamp}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--success)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Scan size={12} />
                        {lang === 'ar' ? 'باركود تلقائي' : 'Smart Barcode'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--success-light)',
                          color: 'var(--success)'
                        }}>
                          {lang === 'ar' ? 'حاضر' : 'Present'}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)'
                        }}>
                          {rec.paymentStatusAr || 'مسدد'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
