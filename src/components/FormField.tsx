import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  questionNumber?: number;
  children: React.ReactNode;
  hint?: string;
}

export default function FormField({ label, required = false, error, questionNumber, children, hint }: FormFieldProps) {
  return (
    <div className="mb-6 last:mb-0">
      <label className="block mb-2">
        <span className="text-sm font-semibold text-slate-700 leading-relaxed">
          {questionNumber && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary-100 text-primary-700 text-xs font-bold mr-2">
              {questionNumber}
            </span>
          )}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {hint && (
          <span className="block text-xs text-slate-400 mt-1 ml-8">{hint}</span>
        )}
      </label>
      <div className="ml-0 sm:ml-8">
        {children}
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
