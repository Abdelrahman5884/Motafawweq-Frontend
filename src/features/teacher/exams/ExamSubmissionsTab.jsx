import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  Award,
  FileCheck,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { teacherApi } from '../../../services/teacherApi';
import { formatExamDateTime } from './examConstants';

export const ExamSubmissionsTab = ({
  exam,
  isAr,
  isDark,
  refreshKey = 0,
  onOpenGradeModal,
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    avgScore: 0,
    passRate: 0,
    topScoreCount: 0,
    pendingCount: 0,
    gradedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'submitted' | 'graded'

  const examId = exam?.id;

  const fetchSubmissions = useCallback(async () => {
    if (!examId) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await teacherApi.exams.listSubmissions(examId);
      setSubmissions(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta) {
        setMeta({
          total: Number(res.meta.total ?? 0),
          avgScore: Number(res.meta.avgScore ?? 0),
          passRate: Number(res.meta.passRate ?? 0),
          topScoreCount: Number(res.meta.topScoreCount ?? 0),
          pendingCount: Number(res.meta.pendingCount ?? 0),
          gradedCount: Number(res.meta.gradedCount ?? 0),
        });
      }
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر تحميل تسليمات الطلاب.' : 'Failed to load student submissions.'));
    } finally {
      setIsLoading(false);
    }
  }, [examId, isAr]);

  useEffect(() => {
    if (!examId) return;
    let active = true;
    const load = async () => {
      try {
        const res = await teacherApi.exams.listSubmissions(examId);
        if (!active) return;
        setSubmissions(Array.isArray(res?.data) ? res.data : []);
        if (res?.meta) {
          setMeta({
            total: Number(res.meta.total ?? 0),
            avgScore: Number(res.meta.avgScore ?? 0),
            passRate: Number(res.meta.passRate ?? 0),
            topScoreCount: Number(res.meta.topScoreCount ?? 0),
            pendingCount: Number(res.meta.pendingCount ?? 0),
            gradedCount: Number(res.meta.gradedCount ?? 0),
          });
        }
      } catch (err) {
        if (active) {
          setError(err?.message || (isAr ? 'تعذر تحميل تسليمات الطلاب.' : 'Failed to load student submissions.'));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [examId, refreshKey, isAr]);

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((sub) => {
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      if (!matchStatus) return false;
      if (!q) return true;
      return (
        (sub.student?.name || '').toLowerCase().includes(q) ||
        (sub.student?.email || '').toLowerCase().includes(q) ||
        (sub.student?.studentCode || '').toLowerCase().includes(q)
      );
    });
  }, [submissions, searchQuery, statusFilter]);

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'submitted').length;
  const gradedSubmissionsCount = submissions.filter((s) => s.status === 'graded').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Grading Summary Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 175px), 1fr))',
        gap: '10px',
      }}>
        {[
          {
            label: isAr ? 'إجمالي التسليمات' : 'Total Submitted',
            value: submissions.length.toLocaleString(),
            color: 'var(--text-primary)',
          },
          {
            label: isAr ? 'بانتظار تصحيح المقالي' : 'Pending Review',
            value: pendingSubmissionsCount.toLocaleString(),
            color: pendingSubmissionsCount > 0 ? '#D97706' : 'var(--success)',
          },
          {
            label: isAr ? 'مصححة ومعتمدة' : 'Approved',
            value: gradedSubmissionsCount.toLocaleString(),
            color: 'var(--success)',
          },
          {
            label: isAr ? 'متوسط الدرجات' : 'Average Score',
            value: `${meta.avgScore} / ${exam?.fullMark || 0}`,
            color: 'var(--primary)',
          },
          {
            label: isAr ? 'نسبة النجاح' : 'Pass Rate',
            value: `${meta.passRate}%`,
            color: 'var(--primary)',
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: card.color, fontFamily: 'var(--font-heading)' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '7px',
          padding: '6px 12px',
          flex: 1,
          minWidth: '200px',
          maxWidth: '380px',
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث باسم الطالب أو الكود...' : 'Search by student name or code...'}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: isAr ? `الكل (${submissions.length})` : `All (${submissions.length})` },
            { id: 'submitted', label: isAr ? `بانتظار التصحيح (${pendingSubmissionsCount})` : `Pending (${pendingSubmissionsCount})`, warn: pendingSubmissionsCount > 0 },
            { id: 'graded', label: isAr ? `معتمد (${gradedSubmissionsCount})` : `Approved (${gradedSubmissionsCount})` },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${active ? 'var(--primary)' : tab.warn ? 'rgba(245, 158, 11, 0.38)' : 'var(--border-subtle)'}`,
                  backgroundColor: active ? 'rgba(0, 102, 204, 0.1)' : tab.warn ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                  color: active ? 'var(--primary)' : tab.warn ? '#D97706' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={fetchSubmissions}
            title={isAr ? 'تحديث التسليمات' : 'Refresh submissions'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.28)',
          color: '#EF4444',
          fontSize: '12.5px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                height: '76px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '44px 20px',
          textAlign: 'center',
        }}>
          <Users size={36} color="var(--text-muted)" style={{ opacity: 0.35, margin: '0 auto 10px', display: 'block' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {submissions.length === 0
              ? (isAr ? 'لم يقم أي طالب بتسليم هذا الاختبار بعد' : 'No students have submitted this exam yet')
              : (isAr ? 'لا توجد تسليمات مطابقة لفلتر البحث' : 'No matching submissions found')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {submissions.length === 0
              ? (isAr ? 'بمجرد قيام الطلاب بحل الامتحان ستظهر إجاباتهم هنا للمراجعة وتصحيح الأسئلة المقالية واعتماد الدرجات.' : 'Once students submit this exam, their answers will appear here for review and grading.')
              : (isAr ? 'جرّب تغيير البحث أو اختيار "الكل".' : 'Try adjusting your search or filter.')}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredSubmissions.map((sub) => {
            const isPending = sub.status === 'submitted';
            const isGraded = sub.status === 'graded';

            return (
              <div
                key={sub.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                {/* Student Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: 1 }}>
                  <Avatar
                    src={sub.student?.avatar}
                    name={sub.student?.name || (isAr ? 'طالب' : 'Student')}
                    size={42}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {sub.student?.name || (isAr ? 'طالب غير معروف' : 'Unknown Student')}
                      </span>
                      {sub.student?.studentCode && (
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '700',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono, monospace)',
                        }}>
                          {sub.student.studentCode}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {isAr ? 'تاريخ التسليم: ' : 'Submitted: '}
                      {formatExamDateTime(sub.submittedAt, isAr)}
                    </div>
                  </div>
                </div>

                {/* Score & Status Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {sub.score} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>/ {sub.fullMark}</span>
                    </div>
                    <div style={{ fontSize: '10.5px', fontWeight: '700', color: isGraded ? (sub.isPassed ? 'var(--success)' : '#EF4444') : '#D97706' }}>
                      {isPending
                        ? (isAr ? 'درجة مبدئية' : 'Preliminary')
                        : `${sub.percentage}% • ${sub.isPassed ? (isAr ? 'ناجح' : 'Passed') : (isAr ? 'راسب' : 'Failed')}`}
                    </div>
                  </div>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    backgroundColor: isPending
                      ? (isDark ? 'rgba(245, 158, 11, 0.16)' : '#FFFBEB')
                      : (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'),
                    color: isPending ? '#D97706' : 'var(--success)',
                    border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.3)'}`,
                  }}>
                    {isPending ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                    <span>
                      {isPending
                        ? (isAr ? 'بانتظار التصحيح والاعتماد' : 'Pending Review')
                        : (isAr ? 'معتمد ومصحح' : 'Approved')}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenGradeModal(sub.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isPending ? '#D97706' : 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isPending ? <FileCheck size={14} /> : <Award size={14} />}
                    <span>
                      {isPending
                        ? (isAr ? 'مراجعة وتصحيح واعتماد' : 'Review & Approve')
                        : (isAr ? 'عرض / تعديل الدرجة' : 'Review / Edit')}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
