import React, { useState } from 'react';
import type { CustomerRiskProfile, MerchantRiskProfile } from '../types';
import {
  Globe,
  User,
  Building2,
  Activity,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Zap
} from '../components/icons';

interface RiskIntelligencePageProps {
  customers: CustomerRiskProfile[];
  merchants: MerchantRiskProfile[];
  velocityPatterns: any[];
  corridors: any[];
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({
  customers,
  merchants,
  velocityPatterns,
  corridors,
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'merchants' | 'geography' | 'velocity'>('customers');
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMerchants = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Globe size={14} className="animate-pulse" />
            FinTech Entity Profiling & Forensic Graph
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Risk Intelligence & Entity Behavior Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Continuous identity clustering, merchant chargeback volatility, and cross-border geographic mismatch corridors
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'customers'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Profiles
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'merchants'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Merchant Rankings
          </button>
          <button
            onClick={() => setActiveTab('geography')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'geography'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Geo Corridors
          </button>
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'velocity'
                ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Velocity Multipliers
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter entities by name, ID, or category..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      {/* Tab 1: Customer Risk Profiles */}
      {activeTab === 'customers' && (
        <div className="rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <User size={15} className="text-sky-400" />
              High-Risk Customer Risk Registry ({filteredCustomers.length})
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-3.5">Customer ID</th>
                  <th className="p-3.5">Entity Name</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Risk Tier</th>
                  <th className="p-3.5 text-right">Lifetime Spend</th>
                  <th className="p-3.5 text-center">Flags</th>
                  <th className="p-3.5 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredCustomers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-sky-400 font-bold">{c.customer_id}</td>
                    <td className="p-3.5 text-white font-sans font-medium">
                      {c.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{c.email}</span>
                    </td>
                    <td className="p-3.5 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          c.risk_score >= 60
                            ? 'text-rose-400 bg-rose-500/10'
                            : c.risk_score >= 30
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-emerald-400 bg-emerald-500/10'
                        }`}
                      >
                        {c.risk_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.risk_tier === 'High Risk'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {c.risk_tier}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-white">
                      ${c.lifetime_spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center text-slate-300 font-bold">
                      {c.flags_count > 0 ? (
                        <span className="text-rose-400">{c.flags_count} flags</span>
                      ) : (
                        <span className="text-emerald-400">0</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                          c.status === 'Watchlist' || c.status === 'Under Monitoring'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Merchant Risk Rankings */}
      {activeTab === 'merchants' && (
        <div className="rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <Building2 size={15} className="text-sky-400" />
              Merchant Risk Volatility Ranking ({filteredMerchants.length})
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-3.5">Merchant ID</th>
                  <th className="p-3.5">Merchant Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Risk Rating</th>
                  <th className="p-3.5 text-right">Volume (USD)</th>
                  <th className="p-3.5 text-center">Fraud Rate</th>
                  <th className="p-3.5 text-center">Chargeback Rate</th>
                  <th className="p-3.5 text-center">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredMerchants.map((m) => (
                  <tr key={m.merchant_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-sky-400 font-bold">{m.merchant_id}</td>
                    <td className="p-3.5 text-white font-sans font-medium">{m.name}</td>
                    <td className="p-3.5 text-slate-300 font-sans">{m.category}</td>
                    <td className="p-3.5 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          m.risk_rating >= 60
                            ? 'text-rose-400 bg-rose-500/10'
                            : m.risk_rating >= 30
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-emerald-400 bg-emerald-500/10'
                        }`}
                      >
                        {m.risk_rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-white">
                      ${m.total_volume_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center font-bold text-rose-400">
                      {m.fraud_rate_pct}%
                    </td>
                    <td className="p-3.5 text-center font-bold text-amber-400">
                      {m.chargeback_rate_pct}%
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                          m.status === 'Restricted'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : m.status === 'Elevated Monitoring'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Geographic Corridors */}
      {activeTab === 'geography' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corridors.map((c, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <Globe size={18} className="text-sky-400" />
                  {c.corridor}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-xs">
                  {c.mismatch_rate} Mismatch
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Total Volume:</span>
                  <span className="text-white font-bold">${c.volume_usd.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Flagged Claims:</span>
                  <span className="text-rose-400 font-bold">{c.flagged_count} incidents</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Velocity Patterns */}
      {activeTab === 'velocity' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {velocityPatterns.map((vp, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-white">{vp.window}</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {vp.status}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {vp.risk_multiplier}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {vp.incidents} anomalous velocity bursts detected in current inspection cycle
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
