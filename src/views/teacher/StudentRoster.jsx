import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_STUDENTS } from '../../data/mockData';
import { RosterFilterBar, RosterTable } from '../../features/teacher/roster';

export const StudentRoster = () => {
  const { lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.nameAr.includes(searchQuery) ||
      s.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'سجل الطلاب والتشخيص الأكاديمي' : 'Student Performance & Diagnostics Roster'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {lang === 'ar' ? 'متابعة تفصيلية لدرجات امتحانات الحصص، الحضور، وتنبيهات المفاهيم الصعبة' : 'Comprehensive tracking of attendance, quiz scores, and AI diagnosed weak areas'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <RosterFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        lang={lang}
        isRtl={isRtl}
      />

      {/* Roster Table */}
      <RosterTable
        filteredStudents={filteredStudents}
        lang={lang}
        isRtl={isRtl}
      />
    </div>
  );
};
