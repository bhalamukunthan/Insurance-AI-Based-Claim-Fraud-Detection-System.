import React, { useState } from 'react';
import type { Transaction, FraudAlert, AlertSeverity, AlertStatus } from '../types';
import {
  Radio,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  User,
  Zap,
  Activity
} from '../components/icons';

interface CommandCenterPageProps {
  transactions: Transaction[];
  alerts: FraudAlert[];
  isStreaming: boolean;
  setIsStreaming: (s: boolean) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onSelectAlert: (alert: FraudAlert) => void;
  onRefresh: () => void;
  wsConnected: boolean;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  transactions,
  alerts,
  isStreaming,
  setIsStreaming,
  onSelectTransaction,
  onSelectAlert,
  onRefresh,
  wsConnected,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter alerts
  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'All' || a.severity === severityFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      a.alert_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.rule_triggered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  // Recent high-risk transactions
  const highRiskQueue = transactions.filter((t) => t.risk_score >= 45).slice(0, 25);

  const severityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const statusBadge = (st: string) => {
    switch (st) {
      case 'Declined':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Approved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Flagged':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Real-time Telemetry Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <Radio size={20} className="text-sky-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Fraud Command Center
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  wsConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {wsConnected ? 'WEBSOCKET: LIVE' : 'LIVE POLLING'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live ingest: 24.8 tx/sec • Latency: 4.8ms • Autonomous 3DS Step-Up Active
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${
              isStreaming
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause size={13} /> Pause Radar Feed
              </>
            ) : (
              <>
                <Play size={13} /> Resume Radar Feed
              </>
            )}
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Refresh Ingestion Queue"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): High-Risk Live Transaction Activity Feed */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl flex flex-col h-[740px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-sky-400" />
              <h2 className="text-sm font-bold text-white">Live High-Risk Queue</h2>
            </div>
            <span className="font-mono text-[11px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              {highRiskQueue.length} Flagged
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
            {highRiskQueue.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-slate-200 group-hover:text-sky-400">
                    {tx.transaction_id}
                  </span>
                  <span className="font-mono font-extrabold text-white">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="truncate max-w-[170px]">{tx.customer_name}</span>
                  <span className="font-mono text-slate-500 text-[10px]">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-800/60">
                  <span className="text-slate-400 truncate max-w-[160px]">{tx.merchant_name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        tx.risk_score >= 75
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {tx.risk_score} Score
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 cols): Critical Fraud Alerts & Incidents */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl flex flex-col h-[740px]">
          {/* Header & Filter Controls */}
          <div className="space-y-3 border-b border-slate-800 pb-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400" />
                <h2 className="text-sm font-bold text-white">Critical Fraud Incidents & Rules</h2>
              </div>
              <span className="font-mono text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                {filteredAlerts.length} Active
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter alerts by rule, ID, or description..."
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Severity Pills */}
              <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Critical', 'High', 'Medium'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      severityFilter === sev
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAlert(a)}
                  className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-800/40 cursor-pointer transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400">{a.alert_id}</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${severityBadge(a.severity)}`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Clock size={12} />
                      {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-300 transition-colors mb-1 line-clamp-1">
                    {a.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {a.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1 truncate max-w-[240px]">
                      <User size={12} className="text-sky-400 shrink-0" />
                      {a.assigned_analyst}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-rose-400 font-bold">{a.fraud_probability}% Prob</span>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                <CheckCircle2 size={32} className="text-emerald-500/40 mb-2" />
                No alerts match the active filter criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
