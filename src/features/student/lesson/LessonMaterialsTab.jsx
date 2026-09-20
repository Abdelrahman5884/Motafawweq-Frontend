import React from 'react';
import { FileText, Download } from 'lucide-react';

export const LessonMaterialsTab = ({
  attachments,
  handleAttachmentDownloadClick,
  dlId,
  lang
}) => {
  return (
    <div className="lv-materials">
      {attachments.map((a, i) => (
        <div key={a.id} className="lv-att" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="lv-att__icon">
            <FileText size={22} />
          </div>
          <div className="lv-att__info">
            <div className="lv-att__name">{a.titleAr}</div>
            <div className="lv-att__meta">{a.size} • {a.pages} • ملف {a.type}</div>
          </div>
          <button
            className="lv-att__dl"
            onClick={() => handleAttachmentDownloadClick(a)}
            disabled={dlId === a.id}
          >
            <Download size={14} />
            <span>{dlId === a.id ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل' : 'Download')}</span>
          </button>
        </div>
      ))}
    </div>
  );
};
