import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from '../icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />,
    error: <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />,
    info: <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-300',
    warning: 'border-amber-500/30 bg-slate-900/95 text-amber-300',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-300',
    info: 'border-sky-500/30 bg-slate-900/95 text-sky-300',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full select-none pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-bold text-white leading-tight">{toast.title}</p>
            {toast.message && <p className="text-slate-300 text-[11px] mt-0.5">{toast.message}</p>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

