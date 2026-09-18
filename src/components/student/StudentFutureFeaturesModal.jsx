import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LIVE_CLASSES_SCHEDULE, STUDENT_PROFILE } from '../../data/studentData';
import confetti from 'canvas-confetti';
import { 
  WifiOff, 
  Video, 
  Star, 
  Share2, 
  UserPlus, 
  CheckCircle2, 
  X, 
  Bell, 
  Download, 
  Copy, 
  ExternalLink 
} from 'lucide-react';

export const StudentFutureFeaturesModal = ({ isOpen, onClose, defaultTab = 'live' }) => {
  const { lang, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'live' | 'offline' | 'reviews' | 'referral' | 'share'
  const student = STUDENT_PROFILE;

  // Rating state (US-120, US-121)
  const [courseRating, setCourseRating] = useState(5);
  const [teacherRating, setTeacherRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Live classes reminders (US-119)
  const [liveList, setLiveList] = useState(LIVE_CLASSES_SCHEDULE);

  // Offline downloads (US-116)
  const [downloadedLessons, setDownloadedLessons] = useState([
    { id: 'off-1', titleAr: 'البناء الضوئي والتفاعلات الضوئية (فيديو 720p)', size: '185 MB', date: 'تم التنزيل' },
    { id: 'off-2', titleAr: 'مخطط المفاهيم وملزمة الشرح الشاملة (PDF)', size: '14 MB', date: 'تم التنزيل' }
  ]);

  // Referral copy (US-123)
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleReminder = (id) => {
    setLiveList(prev => prev.map(item => item.id === id ? { ...item, reminderSet: !item.reminderSet } : item));
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(student.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setReviewSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: isRtl ? '20px' : 'auto',
            right: isRtl ? 'auto' : '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
          {lang === 'ar' ? 'المميزات المستقبلية والخدمات التفاعلية ⭐' : 'Advanced Student Features'}
        </h2>

        {/* Tab Strip */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '20px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'live', labelAr: 'الحصص المباشرة 🔴', icon: Video },
            { id: 'offline', labelAr: 'مذاكرة أوفلاين 📴', icon: WifiOff },
            { id: 'reviews', labelAr: 'تقييم الكورس والمدرس ⭐', icon: Star },
            { id: 'referral', labelAr: 'دعوة الأصدقاء 🎁', icon: UserPlus },
            { id: 'share', labelAr: 'مشاركة الإنجاز 🚀', icon: Share2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-subtle)',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.labelAr}
            </button>
          ))}
        </div>

        {/* Tab 1: Live Classes (US-119) */}
        {activeTab === 'live' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? 'جدول الحصص المباشرة القادمة (Live Stream Rooms):' : 'Upcoming Live Classes:'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {liveList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {item.titleAr}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      👨‍🏫 {item.teacherNameAr} • 📅 {item.dateAr} • ⏰ {item.timeAr} ({item.duration})
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReminder(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: item.reminderSet ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                      border: '1px solid',
                      borderColor: item.reminderSet ? '#10B981' : 'var(--border-medium)',
                      color: item.reminderSet ? '#059669' : 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <Bell size={14} fill={item.reminderSet ? '#10B981' : 'none'} />
                    <span>{item.reminderSet ? 'تم ضبط التذكير' : 'تذكيري'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Offline Mode (US-116) */}
        {activeTab === 'offline' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'المذاكرة بدون إنترنت (Offline Download Storage):' : 'Offline Download Storage:'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'الحصص والملازم المحملة على هاتفك أو حاسوبك للمذاكرة في أي وقت دون استهلاك باقة الإنترنت.' : 'Available for offline studying.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {downloadedLessons.map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {l.titleAr}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      الحجم: {l.size} • {l.date} ✅
                    </div>
                  </div>

                  <button
                    onClick={() => alert('جاري تشغيل الدرس من الذاكرة المحلية Offline')}
                    style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    تشغيل أوفلاين
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Ratings & Reviews (US-120 & US-121) */}
        {activeTab === 'reviews' && (
          <form onSubmit={handleSubmitReview}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              {lang === 'ar' ? 'تقييم تجربتك مع الكورس والمعلم:' : 'Rate & Review:'}
            </h3>

            {/* Course Rating */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                تقييم محتوى الكورس والشرح:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    fill={star <= courseRating ? '#F59E0B' : 'none'}
                    color={star <= courseRating ? '#F59E0B' : '#94A3B8'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCourseRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Teacher Rating */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                تقييم المعلم (د. سلمى السيد):
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    fill={star <= teacherRating ? '#F59E0B' : 'none'}
                    color={star <= teacherRating ? '#F59E0B' : '#94A3B8'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTeacherRating(star)}
                  />
                ))}
              </div>
            </div>

            <textarea
              rows="3"
              placeholder="اكتب رأيك وتجربتك لمساعدة زملائك الطلاب في اختيار الكورس..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-medium)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none',
                marginBottom: '16px',
                fontSize: '13px'
              }}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '900',
                cursor: 'pointer'
              }}
            >
              {reviewSubmitted ? 'تم إرسال التقييم بنجاح! ⭐' : 'نشر التقييم'}
            </button>
          </form>
        )}

        {/* Tab 4: Referral & Invite (US-123) */}
        {activeTab === 'referral' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎁</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {lang === 'ar' ? 'ادعُ أصدقاءك واحصل على 150 ج.م رصيد مجاني!' : 'Invite Friends, Earn Rewards!'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
              شارك كود الإحالة الخاص بك مع زملائك، وسيحصل كل صديق يسجل على خصم 20% وأنت ستحصل على 150 ج.م رصيد في محفظتك.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '2px dashed var(--primary)',
              borderRadius: '16px',
              padding: '12px 24px',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px' }}>
                {student.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Copy size={13} />
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Share Achievements (US-122) */}
        {activeTab === 'share' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #31104B 100%)',
              border: '2px solid #818CF8',
              borderRadius: '20px',
              padding: '24px',
              color: '#FFFFFF',
              maxWidth: '440px',
              margin: '0 auto 20px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
            }}>
              <div style={{ fontSize: '32px' }}>👑</div>
              <h4 style={{ fontSize: '18px', fontWeight: '900', margin: '8px 0 4px' }}>
                {student.nameAr}
              </h4>
              <div style={{ fontSize: '12px', color: '#C7D2FE' }}>
                {student.gradeNameAr} • المركز 2 بدوري المتفوقين 💎
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#FDE68A', marginTop: '12px' }}>
                {student.xp.toLocaleString()} XP • {student.streakDays} يوماً متواصلاً 🔥
              </div>
            </div>

            <button
              onClick={() => {
                alert(lang === 'ar' ? 'تم نسخ كارت الإنجاز وجاهز للمشاركة على واتساب وفيسبوك!' : 'Copied achievement card to clipboard!');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Share2 size={16} />
              <span>{lang === 'ar' ? 'مشاركة الإنجاز على واتساب وفيسبوك' : 'Share Achievement'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
