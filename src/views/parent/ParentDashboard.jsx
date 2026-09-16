import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  CheckCircle2, 
  Award, 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const ParentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [selectedChild, setSelectedChild] = useState('child-omar');

  const children = [
    {
      id: 'child-omar',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      grade: '3rd Secondary (Thanawya Amma)',
      gradeAr: 'الصف الثالث الثانوي (شعبة علمي علوم)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      attendanceRate: 96.5,
      avgQuizScore: 89.0,
      streakDays: 14,
      nextSession: 'Sunday 4:00 PM - Biology (Dr. Salma)',
      nextSessionAr: 'الأحد 4:00 عصراً - أحياء (د. سلمى السيد)',
      teacherNotes: 'Omar shows exceptional grasp in Cell Biology. Needs slight revision on Calvin Cycle calculations.',
      teacherNotesAr: 'عمر ممتاز جداً ومتفاعل في القاعة. مطلوب منه مراجعة حسابات الطاقة في دورة كالفن فقط.'
    },
    {
      id: 'child-sarah',
      name: 'Sarah Tarek El-Kady',
      nameAr: 'سارة طارق القاضي',
      grade: '1st Prep',
      gradeAr: 'الصف الأول الإعدادي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      attendanceRate: 98.0,
      avgQuizScore: 94.5,
      streakDays: 19,
      nextSession: 'Monday 5:00 PM - Science',
      nextSessionAr: 'الإثنين 5:00 مساءً - علوم',
      teacherNotes: 'Top of her class this week in Matter & Structure quiz!',
      teacherNotesAr: 'الأولى على مجموعتها هذا الأسبوع في كويز تركيب المادة!'
    }
  ];

  const activeChild = children.find(c => c.id === selectedChild) || children[0];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header with Child Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? 'بوابة ولي الأمر للمتابعة والتقارير' : 'Parent Monitoring Portal'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar' ? 'متابعة لحظية لحضور وغياب الأبناء في السنتر ونتائج امتحاناتهم' : 'Real-time attendance checks, weekly quiz grades, and direct teacher communications'}
          </p>
        </div>

        {/* Child Switcher Pills */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: selectedChild === child.id ? 'var(--primary)' : 'transparent',
                color: selectedChild === child.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <img src={child.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
              <span>{lang === 'ar' ? child.nameAr.split(' ')[0] : child.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Child Summary Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={activeChild.avatar}
            alt=""
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-light)'
            }}
          />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? activeChild.nameAr : activeChild.name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {lang === 'ar' ? activeChild.gradeAr : activeChild.grade}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'نسبة الحضور بالسنتر' : 'Attendance'}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
              {activeChild.attendanceRate}%
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'متوسط الامتحانات' : 'Exam Average'}</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {activeChild.avgQuizScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Next Session & Teacher Notes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'الحصة القادمة وجدول الحضور' : 'Upcoming Session'}
            </h3>
          </div>
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {lang === 'ar' ? activeChild.nextSessionAr : activeChild.nextSession}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', marginTop: '10px' }}>
            <CheckCircle2 size={14} />
            <span>{lang === 'ar' ? 'تم تأكيد حجز مقعد القاعة' : 'Seat reservation confirmed'}</span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <MessageSquare size={18} color="#06B6D4" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'ملاحظات المعلمين الأسبوعية' : 'Teacher Weekly Feedback'}
            </h3>
          </div>
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '13.5px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)'
          }}>
            "{lang === 'ar' ? activeChild.teacherNotesAr : activeChild.teacherNotes}"
          </div>
        </div>
      </div>
    </div>
  );
};
