import React, { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_GROUPS = [
  {
    id: 'cls-1',
    nameAr: 'أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة',
    nameEn: 'Thanawya Amma Biology 2026 — Dokki Elite Cohort',
    subjectAr: 'الأحياء (الثانوية العامة)',
    subjectEn: 'Biology',
    gradeAr: 'الصف الثالث الثانوي',
    gradeEn: 'Grade 12',
    scheduleAr: 'الأحد والأربعاء 4:00 عصراً',
    scheduleEn: 'Sundays & Wednesdays 4:00 PM',
    centerName: 'سنتر الرواد التعليمي — الدقي (قاعة 1)',
    priceEgp: 450,
    joinCode: 'BIO-DK-2026',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed'
  },
  {
    id: 'cls-2',
    nameAr: 'فيزياء الثانوية العامة — بنك أفكار كيرشوف والدينامو',
    nameEn: '3rd Secondary Physics — Kirchhoff & Dynamo Problem Bank',
    subjectAr: 'الفيزياء (الثانوية العامة)',
    subjectEn: 'Physics',
    gradeAr: 'الصف الثالث الثانوي',
    gradeEn: 'Grade 12',
    scheduleAr: 'الإثنين والخميس 6:00 مساءً',
    scheduleEn: 'Mondays & Thursdays 6:00 PM',
    centerName: 'سنتر النخبة التعليمي — مدينة نصر',
    priceEgp: 500,
    joinCode: 'PHY-OLYMP-26',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed'
  },
  {
    id: 'cls-3',
    nameAr: 'أحياء ثانية ثانوي — التغذية والنقل في الكائنات الحية',
    nameEn: 'Grade 11 Biology — Nutrition & Transport',
    subjectAr: 'الأحياء (الصف الثاني الثانوي)',
    subjectEn: 'Biology',
    gradeAr: 'الصف الثاني الثانوي',
    gradeEn: 'Grade 11',
    scheduleAr: 'الثلاثاء 5:00 مساءً',
    scheduleEn: 'Tuesdays 5:00 PM',
    centerName: 'سنتر الأوائل — المهندسين',
    priceEgp: 380,
    joinCode: 'BIO-611-FND',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed'
  }
];

const INITIAL_ENROLLED_STUDENTS = {
  'cls-1': [
    {
      id: 'std-1',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: '+20 102 458 9912',
      parentName: 'Eng. Tarek El-Kady',
      parentNameAr: 'م. طارق القاضي',
      parentPhone: '+20 100 123 4567',
      attendanceRate: 96.4,
      attendedSessions: 14,
      totalSessions: 14,
      avgQuizScore: 91.2,
      streakDays: 14,
      status: 'Excellence'
    },
    {
      id: 'std-2',
      name: 'Sarah Khaled Mansour',
      nameAr: 'سارة خالد منصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+20 111 876 5432',
      parentName: 'Dr. Khaled Mansour',
      parentNameAr: 'د. خالد منصور',
      parentPhone: '+20 122 987 6543',
      attendanceRate: 98.0,
      attendedSessions: 21,
      totalSessions: 21,
      avgQuizScore: 95.8,
      streakDays: 21,
      status: 'Top 1%'
    },
    {
      id: 'std-3',
      name: 'Kareem Mostafa Badawi',
      nameAr: 'كريم مصطفى بدوي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+20 106 332 1980',
      parentName: 'Mostafa Badawi',
      parentNameAr: 'أ. مصطفى بدوي',
      parentPhone: '+20 106 554 4332',
      attendanceRate: 82.5,
      attendedSessions: 11,
      totalSessions: 14,
      avgQuizScore: 68.0,
      streakDays: 3,
      status: 'Needs Support'
    },
    {
      id: 'std-4',
      name: 'Mariam Adel Shenouda',
      nameAr: 'مريم عادل شنودة',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+20 120 445 7789',
      parentName: 'Adel Shenouda',
      parentNameAr: 'أ. عادل شنودة',
      parentPhone: '+20 122 334 5566',
      attendanceRate: 92.0,
      attendedSessions: 13,
      totalSessions: 14,
      avgQuizScore: 87.5,
      streakDays: 9,
      status: 'Good'
    }
  ],
  'cls-2': [
    {
      id: 'std-1',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: '+20 102 458 9912',
      parentName: 'Eng. Tarek El-Kady',
      parentNameAr: 'م. طارق القاضي',
      parentPhone: '+20 100 123 4567',
      attendanceRate: 94.0,
      attendedSessions: 12,
      totalSessions: 12,
      avgQuizScore: 89.0,
      streakDays: 14,
      status: 'Excellence'
    },
    {
      id: 'std-2',
      name: 'Sarah Khaled Mansour',
      nameAr: 'سارة خالد منصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+20 111 876 5432',
      parentName: 'Dr. Khaled Mansour',
      parentNameAr: 'د. خالد منصور',
      parentPhone: '+20 122 987 6543',
      attendanceRate: 97.0,
      attendedSessions: 12,
      totalSessions: 12,
      avgQuizScore: 94.5,
      streakDays: 21,
      status: 'Top 1%'
    }
  ],
  'cls-3': [
    {
      id: 'std-5',
      name: 'Youssef Ahmed El-Shennawy',
      nameAr: 'يوسف أحمد الشناوي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+20 109 988 7766',
      parentName: 'Ahmed El-Shennawy',
      parentNameAr: 'أحمد الشناوي',
      parentPhone: '+20 100 998 8776',
      attendanceRate: 90.0,
      attendedSessions: 10,
      totalSessions: 11,
      avgQuizScore: 85.0,
      streakDays: 8,
      status: 'Good'
    }
  ]
};

const INITIAL_PENDING_STUDENTS = {
  'cls-1': [
    {
      id: 'pnd-1',
      name: 'Youssef Ahmed El-Shennawy',
      nameAr: 'يوسف أحمد الشناوي',
      phone: '+20 109 988 7766',
      parentNameAr: 'أحمد الشناوي',
      parentPhone: '+20 100 998 8776',
      requestedAt: 'اليوم، 06:30 م',
      method: 'مسح الباركود (QR Code)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'pnd-2',
      name: 'Salma Mahmoud Ezzat',
      nameAr: 'سلمى محمود عزت',
      phone: '+20 115 544 3322',
      parentNameAr: 'محمود عزت',
      parentPhone: '+20 111 223 3445',
      requestedAt: 'أمس، 09:15 م',
      method: 'دعوة مباشرة بالبحث',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80'
    }
  ],
  'cls-2': [
    {
      id: 'pnd-3',
      name: 'Ahmed Mohamed Fathy',
      nameAr: 'أحمد محمد فتحي',
      phone: '+20 128 877 6655',
      parentNameAr: 'محمد فتحي',
      parentPhone: '+20 122 887 7665',
      requestedAt: 'اليوم، 02:40 م',
      method: 'مسح الباركود (QR Code)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
    }
  ],
  'cls-3': []
};

// Registered students database available for teacher search invitations
export const ALL_REGISTERED_STUDENTS = [
  { id: 'all-std-1', nameAr: 'عمر طارق القاضي', nameEn: 'Omar Tarek El-Kady', phone: '+20 102 458 9912', parentNameAr: 'م. طارق القاضي', parentPhone: '+20 100 123 4567', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-2', nameAr: 'سارة خالد منصور', nameEn: 'Sarah Khaled Mansour', phone: '+20 111 876 5432', parentNameAr: 'د. خالد منصور', parentPhone: '+20 122 987 6543', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-3', nameAr: 'كريم مصطفى بدوي', nameEn: 'Kareem Mostafa Badawi', phone: '+20 106 332 1980', parentNameAr: 'أ. مصطفى بدوي', parentPhone: '+20 106 554 4332', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-4', nameAr: 'مريم عادل شنودة', nameEn: 'Mariam Adel Shenouda', phone: '+20 120 445 7789', parentNameAr: 'أ. عادل شنودة', parentPhone: '+20 122 334 5566', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-5', nameAr: 'يوسف أحمد الشناوي', nameEn: 'Youssef Ahmed El-Shennawy', phone: '+20 109 988 7766', parentNameAr: 'أحمد الشناوي', parentPhone: '+20 100 998 8776', gradeAr: 'الصف الثاني الثانوي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-6', nameAr: 'سلمى محمود عزت', nameEn: 'Salma Mahmoud Ezzat', phone: '+20 115 544 3322', parentNameAr: 'محمود عزت', parentPhone: '+20 111 223 3445', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-7', nameAr: 'أحمد محمد فتحي', nameEn: 'Ahmed Mohamed Fathy', phone: '+20 128 877 6655', parentNameAr: 'محمد فتحي', parentPhone: '+20 122 887 7665', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-8', nameAr: 'نورهان هاني الجوهري', nameEn: 'Nourhan Hany El-Gohary', phone: '+20 101 122 3344', parentNameAr: 'هاني الجوهري', parentPhone: '+20 100 556 6778', gradeAr: 'الصف الثاني الثانوي', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-9', nameAr: 'عبدالرحمن حسن مصطفى', nameEn: 'Abdulrahman Hassan', phone: '+20 100 012 3456', parentNameAr: 'حسن مصطفى', parentPhone: '+20 101 123 4567', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' }
];

const GroupsContext = createContext(null);

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('motafawweq_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [enrolledStudents, setEnrolledStudents] = useState(() => {
    const saved = localStorage.getItem('motafawweq_enrolled_students');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLED_STUDENTS;
  });

  const [pendingStudents, setPendingStudents] = useState(() => {
    const saved = localStorage.getItem('motafawweq_pending_students');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_STUDENTS;
  });

  // Track active group for Student Roster view
  const [activeGroupId, setActiveGroupId] = useState(() => {
    const saved = localStorage.getItem('motafawweq_active_group_id');
    return saved || 'cls-1';
  });

  // Global toast message notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    localStorage.setItem('motafawweq_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('motafawweq_enrolled_students', JSON.stringify(enrolledStudents));
  }, [enrolledStudents]);

  useEffect(() => {
    localStorage.setItem('motafawweq_pending_students', JSON.stringify(pendingStudents));
  }, [pendingStudents]);

  useEffect(() => {
    localStorage.setItem('motafawweq_active_group_id', activeGroupId);
  }, [activeGroupId]);

  // Add new group
  const addGroup = (groupData) => {
    const randomCodeSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = groupData.joinCode?.trim() || `GRP-${Date.now().toString().slice(-4)}-${randomCodeSuffix}`;
    const newGroup = {
      id: `cls-${Date.now()}`,
      nameAr: groupData.nameAr || 'مجموعة دراسية جديدة',
      nameEn: groupData.nameEn || groupData.nameAr || 'New Study Group',
      subjectAr: groupData.subjectAr || 'المادة الدراسية',
      subjectEn: groupData.subjectEn || groupData.subjectAr || 'Subject',
      gradeAr: groupData.gradeAr || 'الصف الثالث الثانوي',
      gradeEn: groupData.gradeEn || '3rd Secondary',
      scheduleAr: groupData.scheduleAr || 'الأحد والأربعاء',
      scheduleEn: groupData.scheduleEn || groupData.scheduleAr,
      centerName: groupData.centerName || 'السنتر التعليمي',
      priceEgp: Number(groupData.priceEgp) || 400,
      joinCode: generatedCode,
      teacherNameAr: 'د. سلمى السيد',
      teacherNameEn: 'Dr. Salma El-Sayed'
    };

    setGroups(prev => [newGroup, ...prev]);
    setEnrolledStudents(prev => ({ ...prev, [newGroup.id]: [] }));
    setPendingStudents(prev => ({ ...prev, [newGroup.id]: [] }));
    showToast('تم إنشاء المجموعة بنجاح وتوليد الباركود وكود الانضمام!');
    return newGroup;
  };

  // Update existing group
  const updateGroup = (groupId, updatedData) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updatedData } : g));
    showToast('تم حفظ تعديلات المجموعة بنجاح!');
  };

  // Delete group
  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setEnrolledStudents(prev => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
    setPendingStudents(prev => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
    if (activeGroupId === groupId) {
      const remaining = groups.filter(g => g.id !== groupId);
      if (remaining.length > 0) setActiveGroupId(remaining[0].id);
    }
    showToast('تم حذف المجموعة وسجلها بنجاح!');
  };

  // Accept pending student
  const acceptPendingStudent = (groupId, pendingId) => {
    const list = pendingStudents[groupId] || [];
    const student = list.find(s => s.id === pendingId);
    if (!student) return;

    // Convert to enrolled student
    const newEnrolled = {
      id: student.id.startsWith('pnd-') ? `std-${Date.now()}` : student.id,
      name: student.name || student.nameAr,
      nameAr: student.nameAr,
      avatar: student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: student.phone,
      parentName: student.parentName || student.parentNameAr,
      parentNameAr: student.parentNameAr,
      parentPhone: student.parentPhone,
      attendanceRate: 100,
      attendedSessions: 1,
      totalSessions: 1,
      avgQuizScore: 90,
      streakDays: 1,
      status: 'Good'
    };

    setEnrolledStudents(prev => ({
      ...prev,
      [groupId]: [newEnrolled, ...(prev[groupId] || [])]
    }));

    setPendingStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== pendingId)
    }));

    showToast(`تم قبول الطالب «${student.nameAr}» وإضافته لقائمة طلاب المجموعة!`);
  };

  // Reject pending student
  const rejectPendingStudent = (groupId, pendingId) => {
    const list = pendingStudents[groupId] || [];
    const student = list.find(s => s.id === pendingId);
    setPendingStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== pendingId)
    }));
    showToast(`تم رفض طلب انضمام «${student?.nameAr || 'الطالب'}».`, 'warning');
  };

  // Remove enrolled student from group
  const removeStudentFromGroup = (groupId, studentId) => {
    const list = enrolledStudents[groupId] || [];
    const student = list.find(s => s.id === studentId);
    setEnrolledStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== studentId)
    }));
    showToast(`تم إلغاء قيد الطالب «${student?.nameAr || ''}» من هذه المجموعة.`);
  };

  // Invite student directly by teacher search
  const inviteStudentToGroup = (groupId, studentData) => {
    const currentEnrolled = enrolledStudents[groupId] || [];
    const currentPending = pendingStudents[groupId] || [];

    if (currentEnrolled.some(s => s.nameAr === studentData.nameAr || s.phone === studentData.phone)) {
      showToast('هذا الطالب مسجل ومقبول بالفعل في هذه المجموعة!', 'warning');
      return false;
    }
    if (currentPending.some(s => s.nameAr === studentData.nameAr || s.phone === studentData.phone)) {
      showToast('يوجد طلب دعوة معلق بالفعل لهذا الطالب!', 'warning');
      return false;
    }

    const pendingItem = {
      id: `pnd-${Date.now()}`,
      name: studentData.nameEn || studentData.nameAr,
      nameAr: studentData.nameAr,
      phone: studentData.phone,
      parentNameAr: studentData.parentNameAr || 'ولي الأمر',
      parentPhone: studentData.parentPhone || studentData.phone,
      requestedAt: 'الآن',
      method: 'دعوة مباشرة من المعلم',
      avatar: studentData.avatar
    };

    setPendingStudents(prev => ({
      ...prev,
      [groupId]: [pendingItem, ...(prev[groupId] || [])]
    }));

    showToast(`تم إرسال دعوة الانضمام للطالب «${studentData.nameAr}» بنجاح!`);
    return true;
  };

  // Student scans QR or submits join code
  const studentJoinByCode = (joinCode, studentProfile = {}) => {
    const cleanCode = joinCode.trim().toUpperCase();
    const group = groups.find(g => g.joinCode.toUpperCase() === cleanCode);
    if (!group) {
      return { success: false, error: 'كود المجموعة غير صحيح أو انتهت صلاحيته' };
    }

    const currentEnrolled = enrolledStudents[group.id] || [];
    const currentPending = pendingStudents[group.id] || [];
    const studentName = studentProfile.nameAr || 'عمر طارق القاضي';
    const studentPhone = studentProfile.phone || '+20 102 458 9912';

    if (currentEnrolled.some(s => s.nameAr === studentName || s.phone === studentPhone)) {
      return { success: false, error: 'أنت مسجل ومقبول بالفعل في هذه المجموعة!' };
    }
    if (currentPending.some(s => s.nameAr === studentName || s.phone === studentPhone)) {
      return { success: false, error: 'طلب انضمامك مسجل بالفعل وقيد انتظار موافقة المعلم!' };
    }

    const newRequest = {
      id: `pnd-${Date.now()}`,
      name: studentProfile.name || studentName,
      nameAr: studentName,
      phone: studentPhone,
      parentNameAr: studentProfile.parentNameAr || 'م. طارق القاضي',
      parentPhone: studentProfile.parentPhone || '+20 100 123 4567',
      requestedAt: 'الآن',
      method: 'مسح الباركود السريع (QR Scan)',
      avatar: studentProfile.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'
    };

    setPendingStudents(prev => ({
      ...prev,
      [group.id]: [newRequest, ...(prev[group.id] || [])]
    }));

    showToast(`تم إرسال طلب الانضمام لمجموعة «${group.nameAr}» بنجاح!`);
    return { success: true, group };
  };

  const getActiveGroup = () => {
    return groups.find(g => g.id === activeGroupId) || groups[0] || null;
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        activeGroupId,
        setActiveGroupId,
        getActiveGroup,
        addGroup,
        updateGroup,
        deleteGroup,
        enrolledStudents,
        pendingStudents,
        acceptPendingStudent,
        rejectPendingStudent,
        removeStudentFromGroup,
        inviteStudentToGroup,
        studentJoinByCode,
        showToast
      }}
    >
      {children}

      {/* Floating Global Notification Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100000,
          backgroundColor: toast.type === 'warning' ? '#B45309' : '#06254E',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(21, 136, 199, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '700',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{toast.message}</span>
        </div>
      )}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const ctx = useContext(GroupsContext);
  if (!ctx) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return ctx;
};
