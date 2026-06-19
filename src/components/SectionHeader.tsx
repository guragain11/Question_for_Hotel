import React from 'react';

interface SectionHeaderProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SectionHeader({ number, title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-200">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-1">
          Section {number}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
