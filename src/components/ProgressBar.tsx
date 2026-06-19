interface ProgressBarProps {
  progress: number;
  totalSections: number;
  currentSection: number;
}

export default function ProgressBar({ progress, totalSections, currentSection }: ProgressBarProps) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500">
          Section {currentSection} of {totalSections}
        </span>
        <span className="text-xs font-bold text-primary-600">{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
