import React, { useState, useEffect } from 'react';
import type { Transaction, FraudAlert } from '../../types';
import { Search, X, Layers, AlertTriangle, ShieldCheck, ChevronRight } from '../icons';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  alerts: FraudAlert[];
  onSelectTransaction: (tx: Transaction) => void;
  onSelectAlert: (alert: FraudAlert) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  transactions,
  alerts,
  onSelectTransaction,
  onSelectAlert,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTx = query.trim()
    ? transactions.filter(
        (t) =>
          t.transaction_id.toLowerCase().includes(query.toLowerCase()) ||
          t.customer_name.toLowerCase().includes(query.toLowerCase()) ||
          t.merchant_name.toLowerCase().includes(query.toLowerCase()) ||
          t.ip_address.includes(query)
      ).slice(0, 5)
    : transactions.slice(0, 3);

  const filteredAlerts = query.trim()
    ? alerts.filter(
        (a) =>
          a.alert_id.toLowerCase().includes(query.toLowerCase()) ||
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.rule_triggered.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : alerts.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#0b0f19] border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search size={18} className="text-sky-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Transaction ID, Customer, Merchant, IP, or Rule..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Transactions section */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 py-1 font-mono flex items-center justify-between">
              <span>Transactions</span>
              <span>{filteredTx.length} results</span>
            </div>
            <div className="space-y-1 mt-1">
              {filteredTx.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    onSelectTransaction(tx);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
                      <Layers size={15} className="text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-sky-400">
                          {tx.transaction_id}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          • {tx.customer_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {tx.merchant_name} • ${tx.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tx.risk_score >= 75
                          ? 'bg-rose-500/20 text-rose-400'
                          : tx.risk_score >= 50
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {tx.risk_score} Score
                    </span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts section */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 py-1 font-mono flex items-center justify-between">
              <span>Critical Alerts</span>
              <span>{filteredAlerts.length} results</span>
            </div>
            <div className="space-y-1 mt-1">
              {filteredAlerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    onSelectAlert(a);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <AlertTriangle size={15} className="text-rose-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-rose-400">
                          {a.alert_id}
                        </span>
                        <span className="text-xs text-slate-300 truncate">
                          {a.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {a.rule_triggered}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with arrows</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
