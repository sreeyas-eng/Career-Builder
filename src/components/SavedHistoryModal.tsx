import React from 'react';
import {
  X,
  Trash2,
  Copy,
  Check,
  FileText,
  HelpCircle,
  CheckCircle2,
  Compass,
  MapPin,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SavedHistoryItem, FeatureTab } from '../types/career';

interface SavedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SavedHistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onSelectSavedItem: (item: SavedHistoryItem) => void;
}

export const SavedHistoryModal: React.FC<SavedHistoryModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onSelectSavedItem,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const getIcon = (type: FeatureTab) => {
    switch (type) {
      case 'resume-builder':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'interview-questions':
        return <HelpCircle className="w-4 h-4 text-indigo-600" />;
      case 'answer-improver':
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case 'career-guidance':
        return <Compass className="w-4 h-4 text-sky-600" />;
      case 'skill-roadmap':
        return <MapPin className="w-4 h-4 text-violet-600" />;
      case 'cover-letter':
        return <Mail className="w-4 h-4 text-cyan-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCopyItem = (item: SavedHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = '';
    if (item.data.fullTextResume) {
      textToCopy = item.data.fullTextResume;
    } else if (item.data.improvedAnswer) {
      textToCopy = item.data.improvedAnswer;
    } else if (item.data.fullLetterText) {
      textToCopy = item.data.fullLetterText;
    } else if (item.data.questions) {
      textToCopy = item.data.questions.map((q: any, i: number) => `${i + 1}. ${q.question}`).join('\n');
    } else {
      textToCopy = JSON.stringify(item.data, null, 2);
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Saved Career Drafts</h3>
            <p className="text-xs text-slate-500">
              Locally saved in your browser ({items.length} {items.length === 1 ? 'item' : 'items'})
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved drafts yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Whenever you generate a resume, interview answers, or cover letters, they are saved here automatically for quick retrieval.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectSavedItem(item);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()} at{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleCopyItem(item, e)}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Copy content"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
