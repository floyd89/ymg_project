
import React from 'react';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg animate-view-enter">
        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
