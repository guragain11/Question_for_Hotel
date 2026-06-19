

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hasError?: boolean;
}

export default function TextInput({ value, onChange, placeholder, type = 'text', hasError = false }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 text-sm
        placeholder:text-slate-400 transition-all duration-200
        ${hasError
          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
          : 'border-slate-200 hover:border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
        }`}
    />
  );
}
