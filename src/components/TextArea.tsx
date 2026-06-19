interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hasError?: boolean;
}

export default function TextArea({ value, onChange, placeholder, rows = 4, hasError = false }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm
        placeholder:text-slate-400 transition-all duration-200 leading-relaxed
        ${hasError
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
          : 'border-slate-200 hover:border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
        }`}
    />
  );
}
