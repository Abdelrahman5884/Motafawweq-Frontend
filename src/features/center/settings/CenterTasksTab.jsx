import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { errorText } from './centerSettingsUtils';

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
  const isAr = lang === 'ar';

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
          newTaskAssignee.trim() || (isAr ? 'الإدارة العامة' : 'General Admin'),
        deadline_label:
          newTaskDeadline.trim() || (isAr ? 'نهاية الشيفت اليومي' : 'End of daily shift'),
      });
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskDeadline('');
      if (showToast) {
        showToast(
          isAr ? 'تمت إضافة المهمة بنجاح.' : 'Task created successfully.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          errorText(err, isAr ? 'تعذر إضافة المهمة.' : 'Failed to create task.'),
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
          errorText(err, isAr ? 'تعذر تحديث حالة المهمة.' : 'Failed to toggle task.'),
          'warning'
        );
      }
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.titleAr || '');
    setEditTaskAssignee(task.assignee || '');
    setEditTaskDeadline(task.deadline || '');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
    setEditTaskAssignee('');
    setEditTaskDeadline('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTaskTitle.trim()) return;
    setIsUpdating(true);
    try {
      await updateCenterTask(id, {
        title_ar: editTaskTitle.trim(),
        assignee_name:
          editTaskAssignee.trim() || (isAr ? 'الإدارة العامة' : 'General Admin'),
        deadline_label:
          editTaskDeadline.trim() || (isAr ? 'نهاية الشيفت' : 'End of shift'),
      });
      handleCancelEdit();
      if (showToast) {
        showToast(
          isAr ? 'تم تحديث المهمة بنجاح.' : 'Task updated successfully.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          errorText(err, isAr ? 'تعذر حفظ تعديل المهمة.' : 'Failed to update task.'),
          'warning'
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id;
    setTaskToDelete(null);
    if (editingTaskId === id) handleCancelEdit();
    try {
      await deleteCenterTask(id);
      if (showToast) {
        showToast(isAr ? 'تم حذف المهمة.' : 'Task deleted.', 'info');
      }
    } catch (err) {
      if (showToast) {
        showToast(
          errorText(err, isAr ? 'تعذر حذف المهمة.' : 'Failed to delete task.'),
          'warning'
        );
      }
    }
  };

  return (
    <div>
      {/* 1. Add Task Card */}
      <div className="cs-card">
        <div className="cs-card-header">
          <h3 className="cs-card-title">
            <Plus size={18} />
            <span>{isAr ? 'إسناد مهمة تشغيلية جديدة' : 'New Operational Task'}</span>
          </h3>
        </div>

        <form onSubmit={handleAddTask} className="cs-grid">
          <div className="cs-field span-all">
            <input
              type="text"
              required
              maxLength={500}
              className="cs-input"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={
                isAr
                  ? 'وصف المهمة (مثال: مراجعة إيصالات الفترة المسائية وتوريد الخزينة)'
                  : 'Task description...'
              }
            />
          </div>

          <div className="cs-field">
            <input
              type="text"
              list="center-staff-suggestions"
              maxLength={150}
              className="cs-input"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              placeholder={isAr ? 'الموظف المسؤول (اختياري)' : 'Assignee (Optional)'}
            />
            <datalist id="center-staff-suggestions">
              {assigneeSuggestions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          <div className="cs-field">
            <input
              type="text"
              maxLength={150}
              className="cs-input"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
              placeholder={isAr ? 'الموعد النهائي (مثال: 09:00 م)' : 'Deadline'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={isCreating}
              className="cs-btn cs-btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              <Plus size={15} />
              <span>{isAr ? 'إضافة المهمة' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Filter Pills */}
      <div className="cs-pills-bar">
        {[
          { id: 'all', label: isAr ? `الكل (${taskStats.total})` : `All (${taskStats.total})` },
          { id: 'pending', label: isAr ? `قيد التنفيذ (${taskStats.pending})` : `Pending (${taskStats.pending})` },
          { id: 'completed', label: isAr ? `مكتملة (${taskStats.completed})` : `Completed (${taskStats.completed})` },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            className={`cs-pill ${statusFilter === f.id ? 'active' : ''}`}
            onClick={() => setStatusFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 3. Tasks List Card */}
      <div className="cs-card" style={{ padding: '8px 16px' }}>
        {filteredTasks.length === 0 ? (
          <div className="cs-empty">
            {isAr ? 'لا توجد مهام مسجلة ضمن هذا التصنيف.' : 'No tasks found.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <div
                key={task.id}
                style={{
                  padding: '14px 8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: isEditing ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  flexDirection: isEditing ? 'column' : 'row',
                  gap: '12px',
                }}
              >
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <input
                      type="text"
                      className="cs-input"
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                    />
                    <div className="cs-grid">
                      <input
                        type="text"
                        className="cs-input"
                        value={editTaskAssignee}
                        onChange={(e) => setEditTaskAssignee(e.target.value)}
                        placeholder={isAr ? 'المسؤول' : 'Assignee'}
                      />
                      <input
                        type="text"
                        className="cs-input"
                        value={editTaskDeadline}
                        onChange={(e) => setEditTaskDeadline(e.target.value)}
                        placeholder={isAr ? 'الموعد النهائي' : 'Deadline'}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleSaveEdit(task.id)}
                        className="cs-btn cs-btn-primary"
                      >
                        <Check size={14} />
                        <span>{isAr ? 'حفظ' : 'Save'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cs-btn"
                      >
                        <X size={14} />
                        <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
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
                          marginTop: '2px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.6 : 1,
                            lineHeight: '1.4',
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
                            gap: '14px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <UserCheck size={12} />
                            <span>{task.assignee || '—'}</span>
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{task.deadline || '—'}</span>
                          </span>
                        </div>
                      </div>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(task)}
                        className="cs-btn cs-icon-btn"
                        title={isAr ? 'تعديل المهمة' : 'Edit Task'}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskToDelete(task)}
                        className="cs-btn cs-btn-danger cs-icon-btn"
                        title={isAr ? 'حذف المهمة' : 'Delete Task'}
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

      {/* 4. Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="cs-modal-overlay" onClick={() => setTaskToDelete(null)}>
          <div className="cs-modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--color-danger, #DC2626)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Trash2 size={22} />
            </div>

            <h4 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 8px' }}>
              {isAr ? 'هل أنت متأكد من حذف هذه المهمة؟' : 'Delete this task?'}
            </h4>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-app)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                margin: '0 0 18px',
                textAlign: 'start',
              }}
            >
              {taskToDelete.titleAr}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="cs-btn cs-btn-danger"
                style={{ flex: 1 }}
              >
                {isAr ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="cs-btn"
                style={{ flex: 1 }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
