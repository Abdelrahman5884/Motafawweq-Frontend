import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Edit3,
  Plus,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';

export const CenterTasksTab = ({
  lang,
  tasks = [],
  staff = [],
  centerTeachers = [],
  addCenterTask,
  updateCenterTask,
  toggleCenterTask,
  deleteCenterTask,
  showToast,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskAssignee, setEditTaskAssignee] = useState('');
  const [editTaskDeadline, setEditTaskDeadline] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const assigneeSuggestions = useMemo(() => {
    const names = new Set();
    staff.forEach((s) => {
      if (s?.nameAr) names.add(s.nameAr);
    });
    centerTeachers.forEach((t) => {
      if (t?.nameAr) names.add(t.nameAr);
    });
    return Array.from(names);
  }, [staff, centerTeachers]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => Boolean(t.completed)).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'completed') {
      return tasks.filter((t) => Boolean(t.completed));
    }
    if (statusFilter === 'pending') {
      return tasks.filter((t) => !t.completed);
    }
    return tasks;
  }, [tasks, statusFilter]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsCreating(true);
    try {
      await addCenterTask({
        title_ar: newTaskTitle.trim(),
        assignee_name:
          newTaskAssignee.trim() ||
          (lang === 'ar' ? 'الإدارة العامة' : 'General Admin'),
        deadline_label:
          newTaskDeadline.trim() ||
          (lang === 'ar' ? 'نهاية الشيفت اليومي' : 'End of daily shift'),
      });
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskDeadline('');
      if (showToast) {
        showToast(
          lang === 'ar' ? 'تمت إضافة المهمة التشغيلية بنجاح.' : 'Operational task created.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message || (lang === 'ar' ? 'تعذر إضافة المهمة.' : 'Failed to create task.'),
          'warning'
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await toggleCenterTask(id);
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message || (lang === 'ar' ? 'تعذر تحديث حالة المهمة.' : 'Failed to toggle task.'),
          'warning'
        );
      }
    }
  };

  const handleStartEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.titleAr || '');
    setEditTaskAssignee(task.assignee || '');
    setEditTaskDeadline(task.deadline || '');
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
    setEditTaskAssignee('');
    setEditTaskDeadline('');
  };

  const handleSaveEditTask = async (id) => {
    if (!editTaskTitle.trim()) return;
    setIsUpdating(true);
    try {
      await updateCenterTask(id, {
        title_ar: editTaskTitle.trim(),
        assignee_name:
          editTaskAssignee.trim() || (lang === 'ar' ? 'الإدارة العامة' : 'General Admin'),
        deadline_label:
          editTaskDeadline.trim() || (lang === 'ar' ? 'نهاية الشيفت اليومي' : 'End of Shift'),
      });
      handleCancelEditTask();
      if (showToast) {
        showToast(
          lang === 'ar' ? 'تم تحديث بيانات المهمة بنجاح.' : 'Task updated.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message || (lang === 'ar' ? 'تعذر حفظ تعديل المهمة.' : 'Failed to update task.'),
          'warning'
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const targetId = taskToDelete.id;
    setTaskToDelete(null);
    if (editingTaskId === targetId) handleCancelEditTask();
    try {
      await deleteCenterTask(targetId);
      if (showToast) {
        showToast(
          lang === 'ar' ? 'تم حذف المهمة بنجاح.' : 'Task deleted.',
          'info'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message || (lang === 'ar' ? 'تعذر حذف المهمة.' : 'Failed to delete task.'),
          'warning'
        );
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Add Task Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
            <span>
              {lang === 'ar' ? 'إسناد مهمة تشغيلية جديدة' : 'Assign New Operational Task'}
            </span>
          </h3>

          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: '700' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-secondary)',
              }}
            >
              {lang === 'ar'
                ? `قيد التنفيذ: ${taskStats.pending}`
                : `Pending: ${taskStats.pending}`}
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                color: 'var(--success)',
              }}
            >
              {lang === 'ar'
                ? `مكتملة: ${taskStats.completed}`
                : `Completed: ${taskStats.completed}`}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleAddTask}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <input
            type="text"
            required
            maxLength={500}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'وصف المهمة (مثال: مراجعة إيصالات الفترة المسائية)'
                : 'Task description...'
            }
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />
          <div>
            <input
              type="text"
              list="center-staff-Assignees"
              maxLength={150}
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              placeholder={lang === 'ar' ? 'الموظف المسؤول' : 'Assignee'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
            <datalist id="center-staff-Assignees">
              {assigneeSuggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <input
            type="text"
            maxLength={150}
            value={newTaskDeadline}
            onChange={(e) => setNewTaskDeadline(e.target.value)}
            placeholder={
              lang === 'ar' ? 'الموعد النهائي (مثال: 09:00 م)' : 'Deadline (e.g. 09:00 PM)'
            }
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />
          <button
            type="submit"
            disabled={isCreating}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Plus size={15} />
            <span>{lang === 'ar' ? 'إضافة المهمة' : 'Add Task'}</span>
          </button>
        </form>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', labelAr: `الكل (${taskStats.total})`, labelEn: `All (${taskStats.total})` },
          {
            id: 'pending',
            labelAr: `قيد التنفيذ (${taskStats.pending})`,
            labelEn: `Pending (${taskStats.pending})`,
          },
          {
            id: 'completed',
            labelAr: `مكتملة (${taskStats.completed})`,
            labelEn: `Completed (${taskStats.completed})`,
          },
        ].map((f) => {
          const active = statusFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                border: active ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: active ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {lang === 'ar' ? f.labelAr : f.labelEn}
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {filteredTasks.length === 0 ? (
          <div
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
            }}
          >
            {lang === 'ar'
              ? 'لا توجد مهام مسجلة ضمن هذا التصنيف حالياً.'
              : 'No operational tasks found for this filter.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <div
                key={task.id}
                style={{
                  padding: '16px 22px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: isEditing ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  flexDirection: isEditing ? 'column' : 'row',
                  gap: '12px',
                  backgroundColor: task.completed
                    ? 'rgba(22, 163, 74, 0.04)'
                    : 'transparent',
                }}
              >
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          color: 'var(--text-secondary)',
                          marginBottom: '6px',
                        }}
                      >
                        {lang === 'ar' ? 'وصف المهمة التشغيلية' : 'Task Description'}
                      </label>
                      <textarea
                        rows={2}
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--primary)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13.5px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                      }}
                    >
                      <input
                        type="text"
                        value={editTaskAssignee}
                        onChange={(e) => setEditTaskAssignee(e.target.value)}
                        placeholder={lang === 'ar' ? 'المسؤول' : 'Assignee'}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                      <input
                        type="text"
                        value={editTaskDeadline}
                        onChange={(e) => setEditTaskDeadline(e.target.value)}
                        placeholder={lang === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleSaveEditTask(task.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={14} />
                        <span>{lang === 'ar' ? 'حفظ التعديل' : 'Save'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditTask}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                        <span>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(task.completed)}
                        onChange={() => handleToggleTask(task.id)}
                        style={{
                          accentColor: 'var(--success)',
                          width: '18px',
                          height: '18px',
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.65 : 1,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: '1.5',
                          }}
                        >
                          {task.titleAr}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            marginTop: '4px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <UserCheck size={13} />
                            <span>
                              {lang === 'ar' ? 'المسؤول:' : 'Assignee:'} {task.assignee || '—'}
                            </span>
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} />
                            <span>
                              {lang === 'ar' ? 'الموعد:' : 'Due:'} {task.deadline || '—'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </label>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: task.completed
                            ? 'rgba(22, 163, 74, 0.12)'
                            : 'rgba(217, 119, 6, 0.12)',
                          color: task.completed ? 'var(--success)' : 'var(--warning)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {task.completed && <CheckCircle2 size={12} />}
                        {task.completed
                          ? lang === 'ar'
                            ? 'مكتملة'
                            : 'Completed'
                          : lang === 'ar'
                            ? 'قيد التنفيذ'
                            : 'Pending'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleStartEditTask(task)}
                        title={lang === 'ar' ? 'تعديل المهمة' : 'Edit Task'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaskToDelete(task)}
                        title={lang === 'ar' ? 'حذف المهمة' : 'Delete Task'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(220, 38, 38, 0.25)',
                          backgroundColor: 'rgba(220, 38, 38, 0.06)',
                          color: 'var(--color-danger, #DC2626)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setTaskToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '26px 28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--color-danger, #DC2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Trash2 size={24} />
            </div>

            <h4
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: '0 0 10px 0',
              }}
            >
              {lang === 'ar' ? 'هل تريد حذف هذه المهمة؟' : 'Delete this task?'}
            </h4>

            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                margin: '0 0 20px 0',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: 'var(--bg-app)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'start',
              }}
            >
              {taskToDelete.titleAr}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleConfirmDeleteTask}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-danger, #DC2626)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {lang === 'ar' ? 'نعم، حذف' : 'Yes, Delete'}
              </button>

              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
