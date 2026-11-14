import React from 'react';
import type { ActiveNavTab } from '../../types';
import {
  Shield,
  Activity,
  Layers,
  Cpu,
  Globe,
  BarChart3,
  Sliders,
  FileText,
  Lock,
  ChevronLeft,
  ChevronRight,
  Radio,
  Zap
} from '../icons';

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  openAlertCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  openAlertCount,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems: {
    id: ActiveNavTab;
    label: string;
    icon: React.FC<{ size?: number; className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Executive Overview', icon: Activity },
    {
      id: 'command-center',
      label: 'Fraud Command Center',
      icon: Radio,
      badge: openAlertCount > 0 ? openAlertCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { id: 'transactions', label: 'Transactions Explorer', icon: Layers },
    { id: 'predictions', label: 'AI Prediction Studio', icon: Cpu, badge: 'v2.6', badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
    { id: 'risk-intelligence', label: 'Risk Intelligence', icon: Globe },
    { id: 'model-performance', label: 'Model Performance', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Compliance', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Sliders },
  ];

  const handleNavClick = (id: ActiveNavTab) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#070b14]/95 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => handleNavClick('overview')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/20 shrink-0">
              <div className="w-full h-full bg-[#070b14] rounded-xl flex items-center justify-center">
                <Shield className="text-sky-400" size={22} />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070b14] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070b14]" />
            </div>

            {!collapsed && (
              <div className="flex flex-col select-none">
                <span className="font-extrabold text-sm tracking-wider text-white font-mono flex items-center gap-1.5">
                  FRAUDGUARD<span className="text-sky-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  FinTech Defense 2026
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-transparent text-sky-400 border border-sky-500/30 shadow-lg shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full shadow-sm shadow-sky-400" />
                )}

                <Icon
                  size={20}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-sky-400 scale-110' : 'group-hover:scale-105 group-hover:text-slate-200'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left text-xs tracking-wide">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltip Bubble */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 font-medium">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 font-mono text-[10px] text-rose-400">
                        ({item.badge})
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapsed expand toggle button */}
        {collapsed && (
          <div className="p-3 border-t border-slate-800/80 flex justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* System Status Pill / Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-slate-200 truncate">
                  AI Defense Active
                </span>
                <span className="text-[10px] text-emerald-400 font-mono truncate">
                  4.8ms Latency • 97.8% AUC
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="AI Defense Active (4.8ms)">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
