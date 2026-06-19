import { CheckCircle, RotateCcw } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
}

export default function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="animate-fade-in-up max-w-lg w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Thank You! 🎉
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-2">
          Your survey response has been recorded successfully.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Your insights will help us build a better hotel booking system tailored for hotels in Kathmandu.
        </p>
        <div className="p-4 bg-primary-50 rounded-2xl mb-8">
          <p className="text-sm font-medium text-primary-700">
            📋 Response saved locally. In a production setup, this data would be sent to a secure server.
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm
            hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-200"
        >
          <RotateCcw className="w-4 h-4" />
          Submit Another Response
        </button>
      </div>
    </div>
  );
}
