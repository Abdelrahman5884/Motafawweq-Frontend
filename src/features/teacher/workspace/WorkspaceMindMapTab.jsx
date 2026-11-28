import React, { useState } from 'react';
import {
  Share2,
  Edit3,
  Plus,
  Save,
  X,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { NotebookMindMapCanvas } from '../../../components/knowledge-map/NotebookMindMapCanvas';
import { formatSecondsToTimestamp, parseTimestampToSeconds } from './workspaceUtils';

function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id || `node-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    labelAr: node.labelAr || node.label || '',
    summaryAr: node.summaryAr || '',
    timestamp: node.timestamp || formatSecondsToTimestamp(node.startSeconds || 0),
    children: Array.isArray(node.children) ? node.children.map(cloneTree) : [],
  };
}

function serializeTreeForApi(node) {
  const secs = parseTimestampToSeconds(node.timestamp);
  return {
    id: node.id,
    labelAr: node.labelAr.trim() || 'مفهوم علمي',
    labelEn: node.labelAr.trim() || 'Concept',
    summaryAr: node.summaryAr.trim() || undefined,
    startSeconds: secs,
    timestamp: formatSecondsToTimestamp(secs),
    children: (node.children || []).map(serializeTreeForApi),
  };
}

function updateNodeByPath(tree, path, updater) {
  if (path.length === 0) return updater(tree);
  const [head, ...rest] = path;
  return {
    ...tree,
    children: tree.children.map((child, idx) =>
      idx === head ? updateNodeByPath(child, rest, updater) : child
    ),
  };
}

function removeNodeByPath(tree, path) {
  if (path.length === 1) {
    return { ...tree, children: tree.children.filter((_, idx) => idx !== path[0]) };
  }
  const [head, ...rest] = path;
  return {
    ...tree,
    children: tree.children.map((child, idx) =>
      idx === head ? removeNodeByPath(child, rest) : child
    ),
  };
}

const MAX_EDIT_DEPTH = 4;

const TreeNodeEditor = ({ node, path, depth, isAr, onUpdate, onAddChild, onRemove }) => {
  return (
    <div
      style={{
        marginInlineStart: depth > 0 ? '20px' : 0,
        padding: '10px 12px',
        borderRadius: '10px',
        backgroundColor: depth === 0 ? 'var(--primary-surface)' : 'var(--bg-subtle)',
        border: `1px solid ${depth === 0 ? 'var(--primary)' : 'var(--border-subtle)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={node.labelAr}
          onChange={(e) => onUpdate(path, (n) => ({ ...n, labelAr: e.target.value }))}
          placeholder={depth === 0 ? (isAr ? 'العنوان الرئيسي للخريطة' : 'Root topic') : isAr ? 'اسم المفهوم الفرعي' : 'Sub-concept label'}
          style={{
            flex: 1,
            minWidth: '160px',
            padding: '7px 10px',
            borderRadius: '7px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'inherit',
          }}
        />
        <input
          type="text"
          dir="ltr"
          value={node.timestamp}
          onChange={(e) => onUpdate(path, (n) => ({ ...n, timestamp: e.target.value }))}
          placeholder="00:00"
          style={{
            width: '70px',
            padding: '7px 8px',
            borderRadius: '7px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: '700',
            textAlign: 'center',
          }}
        />
        {depth < MAX_EDIT_DEPTH && (
          <button
            type="button"
            onClick={() => onAddChild(path)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 9px',
              borderRadius: '7px',
              border: '1px solid var(--primary)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--primary)',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} />
            <span>{isAr ? 'فرع' : 'Child'}</span>
          </button>
        )}
        {depth > 0 && (
          <button
            type="button"
            onClick={() => onRemove(path)}
            style={{
              padding: '6px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <input
        type="text"
        value={node.summaryAr}
        onChange={(e) => onUpdate(path, (n) => ({ ...n, summaryAr: e.target.value }))}
        placeholder={isAr ? 'شرح مختصر للمفهوم (اختياري)...' : 'Short explanation (optional)...'}
        style={{
          width: '100%',
          padding: '6px 10px',
          borderRadius: '7px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />

      {node.children?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {node.children.map((child, idx) => (
            <TreeNodeEditor
              key={child.id || idx}
              node={child}
              path={[...path, idx]}
              depth={depth + 1}
              isAr={isAr}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const WorkspaceMindMapTab = ({
  lesson,
  lang,
  isRtl,
  onJumpToTimestamp,
  onSaveConceptGraph,
  onGenerateAiConceptGraph,
  isStartingAi = false,
}) => {
  const isAr = lang === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [treeDraft, setTreeDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const analysisJob = lesson.aiAnalysisJob || null;
  const sttJob = lesson.aiSttJob || null;
  const isAiRunning =
    isStartingAi ||
    ((analysisJob?.status === 'queued' || analysisJob?.status === 'processing') &&
      (!analysisJob?.tasks?.length || analysisJob.tasks.includes('concept_graph'))) ||
    ((sttJob?.status === 'queued' || sttJob?.status === 'processing') &&
      Array.isArray(sttJob?.pendingAnalysisTasks) &&
      sttJob.pendingAnalysisTasks.includes('concept_graph'));
  const aiProgress =
    analysisJob?.status === 'queued' || analysisJob?.status === 'processing'
      ? Math.max(8, Number(analysisJob.progress || 15))
      : sttJob?.status === 'queued' || sttJob?.status === 'processing'
        ? Math.max(6, Math.round(Number(sttJob.progress || 10) * 0.55))
        : 0;
  const canGenerateWithAi =
    Boolean(onGenerateAiConceptGraph) &&
    Boolean(lesson.transcript?.length > 0 || lesson.mediaStreamUrl || lesson.embedUrl);

  const handleGenerateAi = async () => {
    if (!onGenerateAiConceptGraph || isAiRunning) return;
    setError('');
    try {
      await onGenerateAiConceptGraph(lesson.id);
    } catch (err) {
      setError(
        err?.message ||
          (isAr ? 'تعذر بدء توليد خريطة المفاهيم بالذكاء الاصطناعي.' : 'Failed to start AI concept map generation.')
      );
    }
  };

  const openEditor = () => {
    setError('');
    if (lesson.notebookMindMap) {
      setTreeDraft(cloneTree(lesson.notebookMindMap));
    } else {
      setTreeDraft({
        id: 'root-1',
        labelAr: lesson.titleAr || (isAr ? 'موضوع الحصة' : 'Lesson Topic'),
        summaryAr: lesson.descriptionAr || '',
        timestamp: '00:00',
        children: [
          {
            id: `node-${Date.now()}-1`,
            labelAr: isAr ? 'المفهوم الأساسي الأول' : 'Key Concept 1',
            summaryAr: '',
            timestamp: '00:00',
            children: [],
          },
        ],
      });
    }
    setIsEditing(true);
  };

  const handleUpdateNode = (path, updater) => {
    setTreeDraft((prev) => (prev ? updateNodeByPath(prev, path, updater) : prev));
  };

  const handleAddChild = (path) => {
    setTreeDraft((prev) =>
      prev
        ? updateNodeByPath(prev, path, (node) => ({
            ...node,
            children: [
              ...(node.children || []),
              {
                id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                labelAr: '',
                summaryAr: '',
                timestamp: node.timestamp || '00:00',
                children: [],
              },
            ],
          }))
        : prev
    );
  };

  const handleRemoveNode = (path) => {
    setTreeDraft((prev) => (prev ? removeNodeByPath(prev, path) : prev));
  };

  const handleSave = async () => {
    if (!treeDraft) return;
    setError('');
    setSaving(true);
    try {
      const payload = serializeTreeForApi(treeDraft);
      await onSaveConceptGraph(lesson.id, payload);
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر حفظ خريطة المفاهيم.' : 'Failed to save concept graph.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={17} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'خريطة المفاهيم الشجرية' : 'Concept Map Tree'}
          </h3>
        </div>

        {!isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {canGenerateWithAi && (
              <button
                type="button"
                disabled={isAiRunning}
                onClick={handleGenerateAi}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: isAiRunning ? 'wait' : 'pointer',
                  opacity: isAiRunning ? 0.8 : 1,
                }}
              >
                {isAiRunning ? <Loader2 size={14} className="lw-spin" /> : <Sparkles size={14} />}
                <span>
                  {isAiRunning
                    ? isAr
                      ? `جاري البناء بالـ AI (${aiProgress}%)...`
                      : `Generating with AI (${aiProgress}%)...`
                    : lesson.notebookMindMap
                      ? isAr
                        ? 'إعادة التوليد بالـ AI'
                        : 'Regenerate with AI'
                      : isAr
                        ? 'توليد خريطة المفاهيم بالـ AI'
                        : 'Generate Mind Map (AI)'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={openEditor}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>
                {lesson.notebookMindMap
                  ? isAr
                    ? 'تعديل خريطة المفاهيم'
                    : 'Edit Mind Map'
                  : isAr
                    ? 'بناء يدوي'
                    : 'Build Manually'}
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? <Loader2 size={14} className="lw-spin" /> : <Save size={14} />}
              <span>{isAr ? 'حفظ الخريطة' : 'Save Mind Map'}</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsEditing(false)}
              style={{
                padding: '7px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {isAiRunning && (
        <div
          style={{
            marginBottom: '14px',
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '800', color: 'var(--primary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <Loader2 size={14} className="lw-spin" />
              <span>
                {sttJob?.status === 'queued' || sttJob?.status === 'processing'
                  ? isAr
                    ? 'جاري التفريغ الصوتي للحصة تمهيداً لبناء خريطة المفاهيم...'
                    : 'Transcribing lesson audio before building the concept map...'
                  : isAr
                    ? 'جاري استخراج المفاهيم وربط العلاقات الشجرية (NotebookLM AI)...'
                    : 'Extracting concepts and building the interactive NotebookLM tree...'}
              </span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{aiProgress}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ width: `${aiProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.35s ease' }} />
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '14px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {isEditing && treeDraft ? (
        <TreeNodeEditor
          node={treeDraft}
          path={[]}
          depth={0}
          isAr={isAr}
          onUpdate={handleUpdateNode}
          onAddChild={handleAddChild}
          onRemove={handleRemoveNode}
        />
      ) : !lesson.notebookMindMap ? (
        <div
          style={{
            padding: '36px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
          }}
        >
          <Share2 size={26} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.7 }} />
          <div style={{ marginBottom: canGenerateWithAi ? '14px' : 0 }}>
            {isAr
              ? 'لم يتم إنشاء خريطة مفاهيم لهذه الحصة بعد. يمكنك توليدها تلقائياً بالذكاء الاصطناعي (NotebookLM) أو بناؤها يدوياً.'
              : 'No concept map yet. Generate one automatically with AI (NotebookLM) or build it manually.'}
          </div>
          {canGenerateWithAi && (
            <button
              type="button"
              disabled={isAiRunning}
              onClick={handleGenerateAi}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isAiRunning ? 'wait' : 'pointer',
              }}
            >
              {isAiRunning ? <Loader2 size={15} className="lw-spin" /> : <Sparkles size={15} />}
              <span>{isAr ? 'توليد خريطة المفاهيم الآن بالذكاء الاصطناعي' : 'Generate Concept Map Now with AI'}</span>
            </button>
          )}
        </div>
      ) : (
        <NotebookMindMapCanvas
          key={`${lesson.id}-${lesson.notebookMindMap?.labelAr || ''}-${lesson.notebookMindMap?.children?.length || 0}`}
          treeData={lesson.notebookMindMap}
          lessonTitle={isAr ? lesson.titleAr : lesson.title}
          unitTitle={lesson.unitAr || ''}
          onJumpToTimestamp={onJumpToTimestamp}
          lang={lang}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};
