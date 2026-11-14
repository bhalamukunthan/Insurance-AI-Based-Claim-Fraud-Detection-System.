import React, { useState } from 'react';
import type { ActiveNavTab, FraudAlert } from '../../types';
import {
  Search,
  Calendar,
  Bell,
  Menu,
  ChevronDown,
  User,
  Radio,
  Play,
  Pause,
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from '../icons';

interface TopNavProps {
  activeTab: ActiveNavTab;
  dateRange: string;
  setDateRange: (range: string) => void;
  openGlobalSearch: () => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  alerts: FraudAlert[];
  onSelectAlert: (alert: FraudAlert) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  dateRange,
  setDateRange,
  openGlobalSearch,
  isStreaming,
  setIsStreaming,
  setMobileOpen,
  alerts,
  onSelectAlert,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const breadcrumbs: Record<ActiveNavTab, string> = {
    'overview': 'Executive Overview',
    'command-center': 'Fraud Command Center',
    'transactions': 'Transactions Explorer',
    'predictions': 'AI Prediction Studio',
    'risk-intelligence': 'Risk Intelligence',
    'model-performance': 'Model Performance',
    'reports': 'Reports & Compliance',
    'settings': 'System Settings',
  };

  const dateOptions = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Q4 2026', 'Year-to-Date'];

  const unreadAlerts = alerts.filter(a => a.status === 'Open').slice(0, 5);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070b14]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-1 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800/60"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono hidden sm:inline">FRAUDGUARD AI</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-white font-semibold font-mono tracking-wide">
            {breadcrumbs[activeTab]}
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <button
          onClick={openGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300 transition-all text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search size={15} className="text-slate-500 group-hover:text-sky-400 transition-colors" />
            <span>Search transactions, accounts, merchants, or rules...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Stream Toggle */}
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
            isStreaming
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title={isStreaming ? 'Pause live transaction feed' : 'Resume live transaction feed'}
        >
          {isStreaming ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold hidden sm:inline">LIVE FEED</span>
              <Pause size={12} className="opacity-70" />
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="hidden sm:inline">PAUSED</span>
              <Play size={12} className="opacity-70" />
            </>
          )}
        </button>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-all"
          >
            <Calendar size={14} className="text-sky-400" />
            <span className="hidden sm:inline">{dateRange}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-xs font-mono">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setDateRange(opt);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center justify-between ${
                    dateRange === opt ? 'text-sky-400 font-bold bg-sky-500/10' : 'text-slate-300'
                  }`}
                >
                  {opt}
                  {dateRange === opt && <CheckCircle2 size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Fraud Alert Notifications"
          >
            <Bell size={17} />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-[#070b14]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50 text-xs">
              <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={15} className="text-rose-400" />
                  Critical Fraud Alerts
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px]">
                  {unreadAlerts.length} Unresolved
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto custom-scrollbar">
                {unreadAlerts.length > 0 ? (
                  unreadAlerts.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onSelectAlert(a);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-800/60 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-sky-400">{a.alert_id}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-1">{a.title}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400 font-mono truncate">{a.rule_triggered}</span>
                        <span className="text-rose-400 font-mono font-bold">{a.fraud_probability}% Prob</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No active critical alerts. All parameters normal.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[11px] shadow-sm">
              SV
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-slate-200 font-semibold leading-tight">Sarah Vance</span>
              <span className="text-[10px] text-sky-400 font-mono">Chief Risk Officer</span>
            </div>
            <ChevronDown size={14} className="text-slate-500 hidden sm:inline" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <p className="text-slate-200 font-bold">Sarah Vance</p>
                <p className="text-[11px] text-slate-400 font-mono">s.vance@fraudguard.fintech</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  Tier-1 SuperAdmin
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Security Key & MFA Status
                </button>
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Audit Trail Sign-Off
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
