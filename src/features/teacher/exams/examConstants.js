/**
 * Motafawweq — Teacher Exams Helpers, Question Factories & Serializers
 */

export const QUESTION_TYPES = {
  mcq: { id: 'mcq', labelAr: 'اختيار من متعدد', labelEn: 'Multiple Choice' },
  true_false: { id: 'true_false', labelAr: 'صح وخطأ', labelEn: 'True / False' },
  essay: { id: 'essay', labelAr: 'مقالي', labelEn: 'Essay' },
};

export const ARABIC_OPTION_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export function createBlankQuestion(type = 'mcq', number = 1, points = 5) {
  const safeType = QUESTION_TYPES[type] ? type : 'mcq';
  const base = {
    id: `temp-q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    number,
    points: Math.max(1, Math.round(Number(points) || 5)),
    type: safeType,
    typeNameAr: QUESTION_TYPES[safeType].labelAr,
    difficulty: 'متوسط',
    questionAr: '',
    optionsAr: ['', '', '', ''],
    correctIndex: 0,
    correctBool: true,
    modelAnswerAr: '',
    rubricPointsAr: ['استيفاء الفكرة العلمية الأساسية', 'الدقة والتفسير المنطقي'],
    explanationAr: '',
  };
  return base;
}

export function serializeQuestionsForApi(questions = []) {
  return (questions || []).map((q, idx) => {
    const type = QUESTION_TYPES[q.type] ? q.type : 'mcq';
    const isPersistedUuid = typeof q.id === 'string' && !q.id.startsWith('temp-') && q.id.length >= 32;
    const base = {
      ...(isPersistedUuid ? { id: q.id, uuid: q.id } : {}),
      number: idx + 1,
      type,
      points: Math.max(1, Math.round(Number(q.points) || 1)),
      difficulty: q.difficulty || 'متوسط',
      question_ar: q.questionAr?.trim() || `سؤال رقم (${idx + 1})`,
      explanation_ar: q.explanationAr?.trim() || '',
    };

    if (type === 'mcq') {
      const rawOpts = Array.isArray(q.optionsAr) && q.optionsAr.length >= 2
        ? q.optionsAr.map((opt, oIdx) => String(opt ?? '').trim() || `الخيار ${oIdx + 1}`)
        : ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'];
      base.options_ar = rawOpts;
      base.correct_index = Math.min(rawOpts.length - 1, Math.max(0, Number(q.correctIndex) || 0));
    } else if (type === 'true_false') {
      base.correct_bool = Boolean(q.correctBool);
    } else if (type === 'essay') {
      base.model_answer_ar = q.modelAnswerAr?.trim() || '';
      base.rubric_points_ar = Array.isArray(q.rubricPointsAr)
        ? q.rubricPointsAr.map((r) => String(r ?? '').trim()).filter(Boolean)
        : [];
    }

    return base;
  });
}

export function formatExamDateTime(isoStr, isAr) {
  if (!isoStr) return isAr ? 'غير محدد' : 'N/A';
  try {
    return new Date(isoStr).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return isoStr;
  }
}
