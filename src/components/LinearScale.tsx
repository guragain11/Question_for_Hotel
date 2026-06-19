interface LinearScaleProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  hasError?: boolean;
}

export default function LinearScale({
  value,
  onChange,
  min = 1,
  max = 5,
  minLabel = 'Definitely Not',
  maxLabel = 'Absolutely Yes',
  hasError = false,
}: LinearScaleProps) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
        {points.map((point) => (
          <button
            key={point}
            type="button"
            onClick={() => onChange(point)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-sm font-bold transition-all duration-200 border-2
              ${value === point
                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200 scale-110'
                : hasError
                  ? 'bg-white border-red-200 text-slate-500 hover:border-red-300'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
              }`}
          >
            {point}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-slate-400 font-medium">{min} — {minLabel}</span>
        <span className="text-xs text-slate-400 font-medium">{max} — {maxLabel}</span>
      </div>
    </div>
  );
}
