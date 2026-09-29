import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { 
  Building2, 
  Settings, 
  CheckSquare, 
  Bell, 
  FileText, 
  Upload, 
  Database, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  Download, 
  Trash2, 
  Save, 
  ShieldCheck, 
  CreditCard,
  Send,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export const CenterSettingsView = () => {
  const { lang, isRtl } = useLanguage();
  const { branches, exportToCsv } = useCenter();

  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'tasks' | 'announcements' | 'import' | 'backup' | 'kpis'

  // Center Settings State (Feature 13)
  const [centerNameAr, setCenterNameAr] = useState('أكاديمية الرواد التعليمية');
  const [centerPhone, setCenterPhone] = useState('+20 2 3345 6789');
  const [centerAddress, setCenterAddress] = useState('ميدان الدقي، الجيزة، مصر');
  const [workingHours, setWorkingHours] = useState('08:00 ص - 10:00 م');
  const [lateMarginMinutes, setLateMarginMinutes] = useState('15');
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    vodafoneCash: true,
    instaPay: true,
    visa: true
  });
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Task Management State (Feature 74)
  const [tasks, setTasks] = useState([
    { id: 'tsk-1', titleAr: 'مراجعة كشوفات حضور القاعة الكبرى ومطابقة الباركود', assignee: 'أ. ياسمين نبيل', deadline: 'اليوم 04:00 م', completed: true },
    { id: 'tsk-2', titleAr: 'تسوية مستحقات الأسبوع الماضي لدكتور سلمى السيد', assignee: 'أ. مصطفى الجيار', deadline: 'اليوم 06:00 م', completed: false },
    { id: 'tsk-3', titleAr: 'الاتصال بأولياء أمور الطلاب المتغيبين في مجموعة الفيزياء', assignee: 'خدمة العملاء', deadline: 'غداً 11:00 ص', completed: false },
    { id: 'tsk-4', titleAr: 'فحص وصيانة التكييف المركزي بقاعة أينشتاين', assignee: 'أ. سامح عبدالحميد', deadline: 'الخميس 02:00 م', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('أ. ياسمين نبيل');
  const [newTaskDeadline, setNewTaskDeadline] = useState('اليوم 06:00 م');

  // Internal Announcements State (Feature 75)
  const [announcements, setAnnouncements] = useState([
    {
      id: 'anc-1',
      titleAr: 'تحديث سياسة فحص الباركود الذكي على البوابات',
      contentAr: 'يرجى من جميع مسؤولي الاستقبال التأكد من تمرير بطاقات الطلاب الذكية فور الدخول لتفعيل المطابقة الآلية للمواعيد والقاعات.',
      author: 'إدارة السنتر العامة',
      date: '2026-09-28',
      branch: 'جميع الفروع'
    },
    {
      id: 'anc-2',
      titleAr: 'مواعيد حصص المراجعة النهائية لشهر أكتوبر',
      contentAr: 'تم اعتماد جدول القاعات والمدرجات الإضافية للفترة المسائية، يرجى التنسيق مع المدرسين لتوزيع الطلاب.',
      author: 'أ. سامح عبدالحميد (مدير التشغيل)',
      date: '2026-09-25',
      branch: 'فرع الدقي'
    }
  ]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [newAnnouncementBranch, setNewAnnouncementBranch] = useState('جميع الفروع');

  // Excel Import Simulation State (Feature 77)
  const [importedRows, setImportedRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState(null);

  // Backup State (Feature 79)
  const [lastBackupTime, setLastBackupTime] = useState('اليوم، 02:30 م');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState(null);

  // Custom KPI Builder State (Features 72, 94, 95)
  const [targetAttendance, setTargetAttendance] = useState('95');
  const [targetRevenue, setTargetRevenue] = useState('300000');
  const [targetUtilization, setTargetUtilization] = useState('85');
  const [kpiSavedSuccess, setKpiSavedSuccess] = useState(false);

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Toggle Task Completion
  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setTasks(prev => [
      {
        id: `tsk-${Date.now()}`,
        titleAr: newTaskTitle.trim(),
        assignee: newTaskAssignee,
        deadline: newTaskDeadline,
        completed: false
      },
      ...prev
    ]);
    setNewTaskTitle('');
  };

  // Add Announcement
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;

    setAnnouncements(prev => [
      {
        id: `anc-${Date.now()}`,
        titleAr: newAnnouncementTitle.trim(),
        contentAr: newAnnouncementContent.trim(),
        author: 'إدارة السنتر العامة',
        date: new Date().toISOString().split('T')[0],
        branch: newAnnouncementBranch
      },
      ...prev
    ]);
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
  };

  // Simulate File Import
  const handleSimulateExcelImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const mockImported = [
        { name: 'حازم خالد مصطفى', phone: '01019283746', group: 'فيزياء الثانوية العامة', grade: '3 ثانوي' },
        { name: 'رنا إبراهيم الشربيني', phone: '01128374655', group: 'كيمياء اللغات', grade: '3 ثانوي' },
        { name: 'مروان أحمد توفيق', phone: '01239485761', group: 'الرياضيات البحتة', grade: '3 ثانوي' },
        { name: 'سلمى وائل البغدادي', phone: '01558473629', group: 'الأحياء التفاعلية', grade: '2 ثانوي' }
      ];
      setImportedRows(mockImported);
      setIsImporting(false);
      setImportSuccessMessage(`تم استيراد ${mockImported.length} سجل طالب بنجاح وفحص عدم تكرار الأرقام.`);
      setTimeout(() => setImportSuccessMessage(null), 4000);
    }, 700);
  };

  // Trigger Cloud Backup
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      setLastBackupTime(`اليوم، ${now}`);
      setBackupNotice('تم إنشاء نسخة احتياطية مشفرة بنجاح ومزامنتها مع الخوادم السحابية الآمنة.');
      setTimeout(() => setBackupNotice(null), 4000);
    }, 900);
  };

  // Save KPI Targets
  const handleSaveKpiTargets = (e) => {
    e.preventDefault();
    setKpiSavedSuccess(true);
    setTimeout(() => setKpiSavedSuccess(false), 3000);
  };

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
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Settings size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'إعدادات المنظومة والتحكم المؤسسي' : 'System Governance & Settings'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'السياسات مفعلة' : 'Active Policies'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lang === 'ar' ? 'إعدادات السنتر، المهام الداخلية، والنسخ السحابي' : 'Center Configuration, Tasks & Cloud Backup'}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'settings', labelAr: 'بيانات وسياسات السنتر', labelEn: 'Center Policies', icon: Settings },
          { id: 'tasks', labelAr: 'إدارة المهام اليومية (Tasks)', labelEn: 'Daily Tasks', icon: CheckSquare },
          { id: 'announcements', labelAr: 'التعليمات والإعلانات الداخلية', labelEn: 'Announcements', icon: Bell },
          { id: 'import', labelAr: 'استيراد البيانات من Excel', labelEn: 'Excel Import', icon: Upload },
          { id: 'backup', labelAr: 'النسخ السحابي والأمان (Backup)', labelEn: 'Cloud Backup', icon: Database },
          { id: 'kpis', labelAr: 'تخصيص مؤشرات الأداء (KPI Builder)', labelEn: 'KPI Builder', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '700',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Center Settings & Policies (Feature 13) */}
      {activeTab === 'settings' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            {lang === 'ar' ? 'إدارة بيانات السنتر وأوقات العمل والسياسات' : 'Center Identity & Operational Policies'}
          </h3>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'اسم السنتر / الأكاديمية' : 'Center Name'}
                </label>
                <input
                  type="text"
                  required
                  value={centerNameAr}
                  onChange={(e) => setCenterNameAr(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'رقم الهاتف الرئيسي' : 'Primary Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={centerPhone}
                  onChange={(e) => setCenterPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'أوقات التشغيل والعمل اليومي' : 'Operating Hours'}
                </label>
                <input
                  type="text"
                  required
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'مهلة التأخير المسموحة قبل تسجيل الغياب (بالدقائق)' : 'Grace Period (Minutes)'}
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="60"
                  value={lateMarginMinutes}
                  onChange={(e) => setLateMarginMinutes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'طرق الدفع والتحصيل المعتمدة في السنتر:' : 'Approved Payment Methods:'}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { key: 'cash', label: 'دفع نقدي بالاستقبال (Cash Desk)' },
                  { key: 'vodafoneCash', label: 'محافظ إلكترونية / فودافون كاش' },
                  { key: 'instaPay', label: 'إنستاباي (InstaPay IPN)' },
                  { key: 'visa', label: 'بطاقات دفع بنكية (Visa / MasterCard)' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={paymentMethods[item.key]}
                      onChange={(e) => setPaymentMethods(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {saveSettingsSuccess && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                color: 'var(--success)',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>{lang === 'ar' ? 'تم حفظ وتحديث إعدادات السنتر بنجاح.' : 'Settings updated successfully.'}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={15} />
              <span>{lang === 'ar' ? 'حفظ السياسات والإعدادات' : 'Save Policies'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Task Management (Feature 74) */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Add Task Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'إسناد مهمة إدارية جديدة' : 'Assign New Administrative Task'}
            </h3>

            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                required
                placeholder={lang === 'ar' ? 'عنوان المهمة (مثال: التأكد من جاهزية شاشات قاعة 2)...' : 'Task description...'}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{
                  flex: 2,
                  minWidth: '240px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />

              <input
                type="text"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="المسؤول"
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />

              <input
                type="text"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                placeholder="الموعد النهائي"
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={15} />
                <span>{lang === 'ar' ? 'إضافة المهمة' : 'Add Task'}</span>
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? `قائمة المهام الداخلية للموظفين (${tasks.filter(t => t.completed).length} من ${tasks.length} مكتملة)` : 'Staff Daily Task Ledger'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: t.completed ? 'var(--bg-app)' : 'var(--bg-surface)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: t.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                        textDecoration: t.completed ? 'line-through' : 'none'
                      }}>
                        {t.titleAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        المسؤول: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{t.assignee}</span> • الموعد: {t.deadline}
                      </div>
                    </div>
                  </label>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: t.completed ? 'rgba(22, 163, 74, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: t.completed ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {t.completed ? 'مكتمل' : 'قيد التنفيذ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Internal Announcements (Feature 75) */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Post New Announcement */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
              {lang === 'ar' ? 'إرسال تعميم أو إعلان داخلي لموظفي السنتر' : 'Publish Internal Staff Announcement'}
            </h3>

            <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'عنوان الإعلان أو التعميم...' : 'Announcement headline...'}
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />

                <select
                  value={newAnnouncementBranch}
                  onChange={(e) => setNewAnnouncementBranch(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="جميع الفروع">جميع الفروع</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.nameAr}>{b.nameAr}</option>
                  ))}
                </select>
              </div>

              <textarea
                required
                rows="3"
                placeholder={lang === 'ar' ? 'نص التعميم والتعليمات الموجهة للموظفين والسكرتارية...' : 'Content...'}
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} />
                <span>{lang === 'ar' ? 'نشر التعميم للموظفين' : 'Publish Memo'}</span>
              </button>
            </form>
          </div>

          {/* Announcements Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {announcements.map(anc => (
              <div
                key={anc.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="var(--primary)" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {anc.titleAr}
                    </h4>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    fontWeight: '700'
                  }}>
                    {anc.branch}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                  {anc.contentAr}
                </p>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  الناشر: {anc.author} • التاريخ: {anc.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Excel Import (Feature 77) */}
      {activeTab === 'import' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            {lang === 'ar' ? 'استيراد بيانات الطلاب والمجموعات من ملف Excel' : 'Import Center Data from Excel'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            {lang === 'ar'
              ? 'انقل بيانات طلابك ومجموعاتك الحالية إلى منصة متفوق بسهولة. قم بتحميل النموذج المعتمد ثم ارفع الملف لاستيراده تلقائياً.'
              : 'Easily onboard your existing student rosters and groups via Excel spreadsheet.'}
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              onClick={() => {
                const headers = ['اسم الطالب', 'رقم الهاتف', 'المجموعة', 'المرحلة الدراسية'];
                const rows = [
                  ['طالب تجريبي 1', '01000000001', 'فيزياء الثانوية العامة', '3 ثانوي'],
                  ['طالب تجريبي 2', '01000000002', 'كيمياء اللغات', '3 ثانوي']
                ];
                exportToCsv('نموذج_استيراد_الطلاب', headers, rows);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>{lang === 'ar' ? 'تحميل نموذج Excel الفارغ' : 'Download Template'}</span>
            </button>

            <button
              onClick={handleSimulateExcelImport}
              disabled={isImporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isImporting ? 'not-allowed' : 'pointer'
              }}
            >
              <Upload size={15} />
              <span>{isImporting ? (lang === 'ar' ? 'جاري الفحص والاستيراد...' : 'Processing...') : (lang === 'ar' ? 'رفع ملف Excel وتدقيق البيانات' : 'Upload & Process Excel')}</span>
            </button>
          </div>

          {importSuccessMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} />
              <span>{importSuccessMessage}</span>
            </div>
          )}

          {/* Imported Preview Table */}
          {importedRows.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'معاينة السجلات المستوردة بنجاح:' : 'Imported Rows Preview:'}
              </div>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>اسم الطالب</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>الهاتف</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>المجموعة</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>المرحلة</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>حالة التدقيق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-primary)' }}>{r.name}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{r.phone}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--primary)', fontWeight: '600' }}>{r.group}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{r.grade}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>جاهز للمزامنة</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Backup & Cloud Recovery (Feature 79) */}
      {activeTab === 'backup' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            {lang === 'ar' ? 'النسخ الاحتياطي السحابي واسترجاع البيانات (Cloud Backup & Recovery)' : 'Cloud Backup & Data Recovery'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            {lang === 'ar'
              ? 'يتم تشفير وتأمين جميع بيانات السنتر، الحضور، السجلات المالية، والطلاب تلقائياً على خوادم متفوق السحابية الآمنة مع إمكانية أخذ نسخة فورية عند الطلب.'
              : 'All center operations, attendance records, and financials are continuously encrypted and synchronized.'}
          </p>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'حالة المزامنة السحابية:' : 'Sync Status:'} <span style={{ color: 'var(--success)' }}>نشط ومتزامن بالكامل (256-bit AES)</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                آخر نسخة احتياطية ناجحة: {lastBackupTime}
              </div>
            </div>

            <button
              onClick={handleTriggerBackup}
              disabled={isBackingUp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isBackingUp ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={15} className={isBackingUp ? 'animate-spin' : ''} />
              <span>{isBackingUp ? (lang === 'ar' ? 'جاري النسخ الآن...' : 'Backing up...') : (lang === 'ar' ? 'إنشاء نسخة احتياطية فورية' : 'Create Backup Now')}</span>
            </button>
          </div>

          {backupNotice && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{backupNotice}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Custom KPI Builder (Features 72, 94, 95) */}
      {activeTab === 'kpis' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            {lang === 'ar' ? 'تخصيص مؤشرات الأداء والحدود المستهدفة (KPI Targets & Thresholds)' : 'Custom KPI Target Builder'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            {lang === 'ar'
              ? 'حدد المستهدفات الشهرية لسنترك وسيقوم النظام بتنبيهك تلقائياً عند تجاوز أو انخفاض أي مؤشر عن المستوى المحدد.'
              : 'Define target thresholds for your center and receive automated alerts.'}
          </p>

          <form onSubmit={handleSaveKpiTargets} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نسبة الحضور المستهدفة (%)' : 'Target Attendance %'}
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  required
                  value={targetAttendance}
                  onChange={(e) => setTargetAttendance(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الإيراد الشهري المستهدف (ج.م)' : 'Target Monthly Revenue (EGP)'}
                </label>
                <input
                  type="number"
                  min="10000"
                  required
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'معدل إشغال القاعات المستهدف (%)' : 'Target Room Utilization %'}
                </label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  required
                  value={targetUtilization}
                  onChange={(e) => setTargetUtilization(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {kpiSavedSuccess && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                color: 'var(--success)',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>{lang === 'ar' ? 'تم اعتماد أهداف مؤشرات الأداء بنجاح.' : 'KPI thresholds saved.'}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={15} />
              <span>{lang === 'ar' ? 'حفظ مستهدفات الـ KPIs' : 'Save Targets'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
