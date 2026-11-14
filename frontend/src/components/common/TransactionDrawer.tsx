import React, { useState } from 'react';
import type { Transaction, TransactionStatus } from '../../types';
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Globe,
  User,
  Building2,
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Copy,
  ExternalLink
} from '../icons';
import { CircularRiskGauge } from '../charts';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: TransactionStatus, notes?: string) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  onClose,
  onUpdateStatus,
}) => {
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors: Record<TransactionStatus, string> = {
    'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Flagged': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Declined': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    'Under Review': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  const riskTierColors = {
    'Low Risk': 'text-emerald-400',
    'Medium Risk': 'text-amber-400',
    'High Risk': 'text-orange-400',
    'Critical Risk': 'text-rose-400',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-xl bg-[#080d1a] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <Shield className="text-sky-400" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-wide">
                  {transaction.transaction_id}
                </span>
                <button
                  onClick={() => handleCopy(transaction.transaction_id)}
                  className="text-slate-500 hover:text-sky-400 transition-colors"
                  title="Copy transaction ID"
                >
                  <Copy size={13} />
                </button>
                {copied && <span className="text-[10px] text-sky-400 font-mono">Copied!</span>}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {new Date(transaction.timestamp).toUTCString()}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
          {/* Top Status & Amount Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-1">
                Transaction Value
              </span>
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400 font-mono ml-2">USD</span>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${statusColors[transaction.status]}`}>
                {transaction.status.toUpperCase()}
              </span>
              <span className={`text-[11px] font-mono font-semibold ${riskTierColors[transaction.risk_tier]}`}>
                {transaction.risk_tier}
              </span>
            </div>
          </div>

          {/* AI Risk Dial & Explainability */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-bold text-white flex items-center gap-2">
                <Cpu size={16} className="text-sky-400" />
                AI Inference Assessment
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Model: {transaction.model_name || 'FraudGuard-Ensemble-v2.6'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              <div className="shrink-0">
                <CircularRiskGauge score={transaction.risk_score} size={150} label="Risk Score" />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Calculated fraud probability is{' '}
                  <span className="font-bold text-white font-mono">
                    {Math.round(transaction.fraud_probability * 100)}%
                  </span>{' '}
                  relative to threshold {Math.round((transaction.decision_threshold || 0.5) * 100)}%.
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    Key Risk Flags:
                  </span>
                  {transaction.risk_factors && transaction.risk_factors.length > 0 ? (
                    transaction.risk_factors.map((flag, i) => (
                      <div key={i} className="flex items-start gap-2 text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg text-[11px]">
                        <AlertTriangle size={13} className="shrink-0 text-rose-400 mt-0.5" />
                        <span>{flag}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 size={13} />
                      Zero anomaly flags. Clean baseline profile.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Entity Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <User size={13} className="text-sky-400" /> Customer Forensics
              </span>
              <div>
                <p className="text-slate-200 font-semibold text-sm">{transaction.customer_name}</p>
                <p className="text-slate-400 font-mono text-[11px]">{transaction.customer_email}</p>
                <p className="text-slate-500 font-mono text-[10px] mt-1">ID: {transaction.customer_id}</p>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Building2 size={13} className="text-sky-400" /> Merchant Entity
              </span>
              <div>
                <p className="text-slate-200 font-semibold text-sm">{transaction.merchant_name}</p>
                <p className="text-sky-400 font-mono text-[11px]">{transaction.merchant_category}</p>
                <p className="text-slate-500 font-mono text-[10px] mt-1">ID: {transaction.merchant_id}</p>
              </div>
            </div>

            {/* Network & Device */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Globe size={13} className="text-sky-400" /> Network & Origin
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">IP:</span>
                  <span className="text-slate-300">{transaction.ip_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="text-slate-300">{transaction.origin_country} → {transaction.destination_country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proxy/VPN:</span>
                  <span className={transaction.vpn_detected ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {transaction.vpn_detected ? 'DETECTED' : 'CLEAN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Channel */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <CreditCard size={13} className="text-sky-400" /> Payment Telemetry
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="text-slate-300">{transaction.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel:</span>
                  <span className="text-slate-300">{transaction.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Device:</span>
                  <span className="text-slate-300 truncate max-w-[130px]">{transaction.device_type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Notes Field */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-semibold text-slate-300 font-mono">
              FINTECH ANALYST AUDIT NOTES
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record forensic observations, customer verification logs, or regulatory compliance comments..."
              className="w-full h-20 bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors text-xs resize-none"
            />
          </div>
        </div>

        {/* Operational Action Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onUpdateStatus(transaction.transaction_id, 'Approved', notes);
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 size={15} />
              Approve
            </button>

            <button
              onClick={() => {
                onUpdateStatus(transaction.transaction_id, 'Flagged', notes);
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-600/20"
            >
              <AlertTriangle size={15} />
              Step-Up 3DS
            </button>

            <button
              onClick={() => {
                onUpdateStatus(transaction.transaction_id, 'Declined', notes);
                onClose();
              }}
              className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-600/20"
            >
              <XCircle size={15} />
              Decline & Freeze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
