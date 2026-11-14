import React from 'react';
import type { ExecutiveOverview, Transaction, FraudAlert } from '../types';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Activity,
  DollarSign,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Globe,
  Radio,
  ExternalLink
} from '../components/icons';
import {
  AreaTrendChart,
  VolumeBarChart,
  RiskScoreHistogram,
  HorizontalCategoryBarChart
} from '../components/charts';

interface OverviewPageProps {
  data: ExecutiveOverview | null;
  onNavigateToTab: (tab: any) => void;
  onSelectAlert: (alert: FraudAlert) => void;
  alerts: FraudAlert[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  data,
  onNavigateToTab,
  onSelectAlert,
  alerts,
}) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-mono text-sm">
        <Activity size={24} className="animate-spin text-sky-400 mr-3" />
        Aggregating FinTech Executive Telemetry...
      </div>
    );
  }

  const kpis = data.kpis;

  const kpiList = [
    {
      title: 'TOTAL TRANSACTIONS',
      value: kpis.total_transactions.display,
      change: `${kpis.total_transactions.change_pct}%`,
      trend: kpis.total_transactions.trend,
      subtext: 'vs previous 24h cycle',
      icon: Layers,
      color: 'sky',
      targetTab: 'transactions',
    },
    {
      title: 'FRAUDULENT INTERCEPTIONS',
      value: kpis.fraudulent_transactions.display,
      change: `${kpis.fraudulent_transactions.change_pct}%`,
      trend: kpis.fraudulent_transactions.trend,
      subtext: 'blocked at edge',
      icon: ShieldAlert,
      color: 'rose',
      targetTab: 'command-center',
    },
    {
      title: 'FRAUD DETECTION RATE',
      value: kpis.fraud_detection_rate.display,
      change: `+${kpis.fraud_detection_rate.change_pct}%`,
      trend: 'up',
      subtext: 'benchmark AUC: 0.978',
      icon: ShieldCheck,
      color: 'emerald',
      targetTab: 'model-performance',
    },
    {
      title: 'PREVENTED FINANCIAL EXPOSURE',
      value: kpis.financial_exposure.display,
      change: `+${kpis.financial_exposure.change_pct}%`,
      trend: 'up',
      subtext: 'capital safeguarded',
      icon: DollarSign,
      color: 'cyan',
      targetTab: 'reports',
    },
    {
      title: 'AVERAGE RISK SCORE',
      value: kpis.average_risk_score.display,
      change: `${kpis.average_risk_score.change_pct}%`,
      trend: 'down',
      subtext: 'population baseline',
      icon: Activity,
      color: 'amber',
      targetTab: 'risk-intelligence',
    },
    {
      title: 'CRITICAL PENDING ALERTS',
      value: kpis.pending_alerts.display,
      change: `${kpis.pending_alerts.change_pct}%`,
      trend: 'down',
      subtext: 'awaiting CRO review',
      icon: AlertTriangle,
      color: 'purple',
      targetTab: 'command-center',
    },
  ];

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Executive Welcome & Live Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/90 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio size={14} className="animate-pulse" />
            Active FinTech Defense Matrix (2026 Edition)
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Executive Fraud Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-model telemetry across credit card, ACH, wire remittance, and crypto merchant corridors.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('predictions')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-600/25"
          >
            Launch AI Prediction Studio
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiList.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';

          return (
            <div
              key={idx}
              onClick={() => onNavigateToTab(kpi.targetTab)}
              className="p-4 rounded-2xl bg-[#0b101d]/90 border border-slate-800 hover:border-sky-500/40 hover:bg-[#0e1526] transition-all duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {kpi.title}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 group-hover:bg-sky-500/20 flex items-center justify-center transition-colors">
                    <Icon size={14} className="text-slate-400 group-hover:text-sky-400" />
                  </div>
                </div>

                <div className="text-xl xl:text-2xl font-extrabold text-white font-mono tracking-tight my-1">
                  {kpi.value}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[11px] font-mono">
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Analytics Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Fraud Trends Time-Series */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity size={16} className="text-sky-400" />
                Fraud Trends Over Time & Financial Exposure
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-tier time series: Legitimate Volume vs. Step-Up Audited vs. Instant Blocked
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-sky-400 rounded-full" /> Legitimate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-amber-400 rounded-full" /> Suspicious
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-rose-500 rounded-full" /> Blocked
              </span>
            </div>
          </div>

          <AreaTrendChart data={data.trends} height={280} />
        </div>

        {/* Right 1 Column: Risk Score Distribution */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800/80 pb-3 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-400" />
                Risk Score Distribution
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Active population stratified into 4 defense tiers
              </p>
            </div>

            <RiskScoreHistogram data={data.risk_distribution} />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-sky-400">
              Automated Defense Rule
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Transactions exceeding risk score <span className="text-rose-400 font-mono font-bold">75.0</span> trigger instantaneous terminal decline and hardware fingerprint blacklisting.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hourly Transaction Volume */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-sky-400" />
              Hourly Transaction Velocity
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Throughput load across gateway ingestion clusters
            </p>
          </div>
          <VolumeBarChart data={data.trends} height={180} />
        </div>

        {/* Merchant Risk Category Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign size={16} className="text-cyan-400" />
              Merchant Risk Volatility
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Top merchant categories ranked by fraud volume
            </p>
          </div>
          <HorizontalCategoryBarChart data={data.merchant_analysis} />
        </div>

        {/* Geographic Hotspots */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-emerald-400" />
                Geographic Risk Hotspots
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cross-border anomaly index by country
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('risk-intelligence')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
            >
              Inspect <ExternalLink size={12} />
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar">
            {data.geo_hotspots.map((geo, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-5 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center border border-slate-700">
                    {geo.code}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200 block leading-tight">
                      {geo.country}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Vol: ${(geo.volume / 1000000).toFixed(1)}M USD
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={`text-xs font-bold ${
                      geo.risk_index > 50
                        ? 'text-rose-400'
                        : geo.risk_index > 20
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {geo.risk_index} Index
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {geo.flagged_pct}% flagged
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
