interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hasError?: boolean;
}

export default function RadioGroup({ value, onChange, options, hasError = false }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${value === opt.value
              ? 'border-primary-500 bg-primary-50 shadow-sm'
              : hasError
                ? 'border-red-200 bg-white hover:border-red-300'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${value === opt.value
              ? 'border-primary-500'
              : 'border-slate-300'
            }`}
          >
            {value === opt.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
            )}
          </div>
          <span className={`text-sm ${value === opt.value ? 'text-primary-700 font-medium' : 'text-slate-600'}`}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
