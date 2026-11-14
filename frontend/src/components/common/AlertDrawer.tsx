import React from 'react';
import type { FraudAlert, AlertStatus } from '../../types';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldAlert,
  ArrowRight
} from '../icons';

interface AlertDrawerProps {
  alert: FraudAlert | null;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: AlertStatus) => void;
  onViewTransaction: (txId: string) => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({
  alert,
  onClose,
  onUpdateStatus,
  onViewTransaction,
}) => {
  if (!alert) return null;

  const severityColors = {
    'Critical': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Medium': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Low': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-lg bg-[#080d1a] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 select-none text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="text-rose-400" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-wide">
                  {alert.alert_id}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] border ${severityColors[alert.severity]}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {new Date(alert.created_at).toUTCString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Alert Title & Probability */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white leading-snug">
              {alert.title}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {alert.description}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[11px]">
              <span className="text-slate-400">Assessed Fraud Probability:</span>
              <span className="text-rose-400 font-bold text-sm">{alert.fraud_probability}%</span>
            </div>
          </div>

          {/* Heuristic / Rule Details */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
              Automated Detection Rule
            </span>
            <p className="text-slate-200 font-mono text-xs">{alert.rule_triggered}</p>
          </div>

          {/* Assigned Analyst & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold flex items-center gap-1.5">
                <User size={13} className="text-sky-400" /> Lead Analyst
              </span>
              <p className="text-slate-200 font-semibold">{alert.assigned_analyst}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold flex items-center gap-1.5">
                <Clock size={13} className="text-sky-400" /> Queue Status
              </span>
              <p className="text-slate-200 font-semibold">{alert.status}</p>
            </div>
          </div>

          {/* Linked Transaction Card */}
          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-sky-400 uppercase font-mono tracking-wider font-bold block mb-1">
                Linked Transaction
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {alert.transaction_id}
              </span>
            </div>
            <button
              onClick={() => {
                onViewTransaction(alert.transaction_id);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-sky-500/30"
            >
              Inspect Forensics
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
          <button
            onClick={() => {
              onUpdateStatus(alert.alert_id, 'Resolved');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 size={15} />
            Mark Resolved
          </button>
          <button
            onClick={() => {
              onUpdateStatus(alert.alert_id, 'Dismissed');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <XCircle size={15} />
            Dismiss (False Alarm)
          </button>
        </div>
      </div>
    </div>
  );
};
