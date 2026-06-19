import { Trash2, GripVertical, Plus, X } from 'lucide-react';
import type { CustomQuestion } from '../types';

interface CustomQuestionBlockProps {
  question: CustomQuestion;
  answer: string;
  onUpdateQuestion: (updated: CustomQuestion) => void;
  onRemoveQuestion: () => void;
  onAnswerChange: (value: string) => void;
}

export default function CustomQuestionBlock({
  question,
  answer,
  onUpdateQuestion,
  onRemoveQuestion,
  onAnswerChange,
}: CustomQuestionBlockProps) {
  const addOption = () => {
    onUpdateQuestion({
      ...question,
      options: [...question.options, `Option ${question.options.length + 1}`],
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdateQuestion({ ...question, options: newOptions });
  };

  const removeOption = (index: number) => {
    onUpdateQuestion({
      ...question,
      options: question.options.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="animate-slide-down border-2 border-dashed border-primary-300 bg-primary-50/50 rounded-2xl p-5 sm:p-6 relative group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <GripVertical className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0 cursor-grab" />
        <div className="flex-1">
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdateQuestion({ ...question, title: e.target.value })}
            placeholder="Type your question here..."
            className="w-full px-0 py-1 bg-transparent border-0 border-b-2 border-primary-300 text-slate-800 text-sm font-semibold 
              placeholder:text-slate-400 focus:border-primary-500 focus:ring-0 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={onRemoveQuestion}
          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
          title="Remove question"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Type selector */}
      <div className="mb-4 ml-8">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
          Answer Type
        </label>
        <select
          value={question.type}
          onChange={(e) =>
            onUpdateQuestion({ ...question, type: e.target.value as 'short' | 'multiple' | 'checkbox' })
          }
          className="px-3 py-2 rounded-lg border-2 border-primary-200 bg-white text-sm text-slate-700 cursor-pointer
            focus:border-primary-500 focus:ring-2 focus:ring-primary-100 appearance-none pr-8"
        >
          <option value="short">Short Answer</option>
          <option value="multiple">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>

      {/* Options editor for multiple choice / checkbox */}
      {(question.type === 'multiple' || question.type === 'checkbox') && (
        <div className="ml-8 mb-4 space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
            Options
          </label>
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 flex-shrink-0 border-2 border-slate-300 ${question.type === 'multiple' ? 'rounded-full' : 'rounded'}`} />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {question.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 mt-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add option
          </button>
        </div>
      )}

      {/* Answer area */}
      <div className="ml-8 pt-3 border-t border-primary-200">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Response
        </label>
        {question.type === 'short' ? (
          <input
            type="text"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Respondent's answer..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm
              placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
          />
        ) : (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <label
                key={opt}
                onClick={() => onAnswerChange(opt)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm
                  ${answer === opt
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
              >
                <div className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center
                  ${question.type === 'multiple' ? 'rounded-full' : 'rounded'}
                  ${answer === opt ? 'border-primary-500' : 'border-slate-300'}`}
                >
                  {answer === opt && question.type === 'multiple' && (
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                  )}
                  {answer === opt && question.type === 'checkbox' && (
                    <svg className="w-2.5 h-2.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
