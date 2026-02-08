import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-24 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 rounded-xl shadow-2xl animate-pulse">
      <div className="flex items-center gap-2">
        <Check className="w-5 h-5" />
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;

