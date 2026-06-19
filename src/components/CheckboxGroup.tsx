interface CheckboxGroupProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: { value: string; label: string }[];
  hasError?: boolean;
}

export default function CheckboxGroup({ values, onChange, options, hasError = false }: CheckboxGroupProps) {
  const handleToggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = values.includes(opt.value);
        return (
          <label
            key={opt.value}
            onClick={() => handleToggle(opt.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${checked
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : hasError
                  ? 'border-red-200 bg-white hover:border-red-300'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
          >
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${checked
                ? 'border-primary-500 bg-primary-500'
                : 'border-slate-300'
              }`}
            >
              {checked && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${checked ? 'text-primary-700 font-medium' : 'text-slate-600'}`}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
