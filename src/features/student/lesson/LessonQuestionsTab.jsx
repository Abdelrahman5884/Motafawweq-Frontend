import React from 'react';
import { Star } from 'lucide-react';

export const LessonQuestionsTab = ({
  questions,
  savedQ,
  handleSaveQuestionClick,
  revealedA,
  setRevealedA,
  lang
}) => {
  return (
    <div className="lv-questions">
      {questions.map((q, i) => (
        <div key={q.id} className="lv-q" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="lv-q__head">
            <span className={`lv-q__diff ${q.diff === 'صعب' ? 'hard' : q.diff === 'سهل' ? 'easy' : 'med'}`}>
              {q.diff}
            </span>
            <span className="lv-q__src">{q.src}</span>
            <button
              className={`lv-q__save ${savedQ[q.id] ? 'on' : ''}`}
              onClick={() => handleSaveQuestionClick(q)}
              title="حفظ السؤال للمراجعة"
            >
              <Star size={14} fill={savedQ[q.id] ? 'currentColor' : 'transparent'} />
            </button>
          </div>

          <p className="lv-q__text">{q.q}</p>

          <div className="lv-q__reveal-action">
            <button
              className="lv-q__toggle-btn"
              onClick={() => setRevealedA(p => ({ ...p, [q.id]: !p[q.id] }))}
            >
              {revealedA[q.id] ? (lang === 'ar' ? 'إخفاء الإجابة النموذجية' : 'Hide Answer') : (lang === 'ar' ? 'عرض الإجابة النموذجية والتفسير' : 'Show Model Answer')}
            </button>
          </div>

          {revealedA[q.id] && (
            <div className="lv-q__answer">
              <div className="lv-q__answer-bar" />
              <div className="lv-q__answer-content">
                <strong>{lang === 'ar' ? 'الإجابة المعتمدة: ' : 'Official Answer: '}</strong>
                <span>{q.a}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
