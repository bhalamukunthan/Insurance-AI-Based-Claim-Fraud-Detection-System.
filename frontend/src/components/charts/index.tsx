import React, { useState } from 'react';
import type { HourlyTrend, RiskDistributionItem, MerchantAnalysisItem, FeatureContribution } from '../../types';

// ── 1. AREA TREND CHART (Financial Time-Series) ────────────────────────
interface AreaTrendChartProps {
  data: HourlyTrend[];
  height?: number;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({ data, height = 280 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return <div className="text-slate-500 text-sm py-12 text-center">No trend data available</div>;

  const padding = { top: 20, right: 20, bottom: 35, left: 55 };
  const width = 760;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => Math.max(d.legitimate, d.suspicious, d.blocked)), 100000);

  const getX = (idx: number) => padding.left + (idx / (data.length - 1)) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxVal) * innerHeight;

  // Build SVG path
  const buildAreaPath = (key: 'legitimate' | 'suspicious' | 'blocked') => {
    const points = data.map((d, i) => `${getX(i)},${getY(d[key])}`);
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = padding.top + innerHeight;
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  };

  const buildLinePath = (key: 'legitimate' | 'suspicious' | 'blocked') => {
    return `M ` + data.map((d, i) => `${getX(i)},${getY(d[key])}`).join(' L ');
  };

  const hoveredItem = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padding.top + innerHeight * (1 - pct);
          const val = Math.round(maxVal * pct);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerWidth}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % 2 !== 0 && i !== data.length - 1) return null;
          const x = getX(i);
          return (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-[11px] fill-slate-400 font-mono"
            >
              {d.time}
            </text>
          );
        })}

        {/* Area Fills */}
        <path d={buildAreaPath('legitimate')} fill="url(#legitGrad)" />
        <path d={buildAreaPath('suspicious')} fill="url(#suspiciousGrad)" />
        <path d={buildAreaPath('blocked')} fill="url(#blockedGrad)" />

        {/* Line strokes */}
        <path d={buildLinePath('legitimate')} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d={buildLinePath('suspicious')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <path d={buildLinePath('blocked')} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Interactive Hover Columns */}
        {data.map((_, i) => {
          const x = getX(i);
          const colWidth = innerWidth / data.length;
          return (
            <rect
              key={i}
              x={x - colWidth / 2}
              y={padding.top}
              width={colWidth}
              height={innerHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}

        {/* Hover Crosshair & Dots */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={padding.top}
              x2={getX(hoverIndex)}
              y2={padding.top + innerHeight}
              stroke="#64748b"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
            <circle cx={getX(hoverIndex)} cy={getY(data[hoverIndex].legitimate)} r="5" fill="#38bdf8" stroke="#0b0f19" strokeWidth="2" />
            <circle cx={getX(hoverIndex)} cy={getY(data[hoverIndex].suspicious)} r="5" fill="#f59e0b" stroke="#0b0f19" strokeWidth="2" />
            <circle cx={getX(hoverIndex)} cy={getY(data[hoverIndex].blocked)} r="5" fill="#ef4444" stroke="#0b0f19" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Floating Tooltip */}
      {hoveredItem && hoverIndex !== null && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/95 border border-slate-700/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg shadow-2xl text-xs space-y-1.5 min-w-[190px]"
          style={{
            left: `${Math.min(75, Math.max(15, (getX(hoverIndex) / width) * 100))}%`,
            top: '10px',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex justify-between items-center">
            <span>Time Window</span>
            <span className="font-mono text-cyan-400">{hoveredItem.time} UTC</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span> Legitimate Volume
            </span>
            <span className="font-mono font-medium">${hoveredItem.legitimate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-amber-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Suspicious / Step-Up
            </span>
            <span className="font-mono font-medium">${hoveredItem.suspicious.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-rose-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Blocked Fraud
            </span>
            <span className="font-mono font-medium">${hoveredItem.blocked.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800 flex justify-between">
            <span>Velocity</span>
            <span className="font-mono">{hoveredItem.total_count} txs processed</span>
          </div>
        </div>
      )}
    </div>
  );
};


// ── 2. VOLUME BAR CHART ────────────────────────────────────────────────
export const VolumeBarChart: React.FC<{ data: HourlyTrend[]; height?: number }> = ({ data, height = 200 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxCount = Math.max(...data.map(d => d.total_count), 500);

  return (
    <div className="relative w-full select-none">
      <div className="flex items-end gap-2 w-full pt-4 px-2" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.total_count / maxCount) * 100;
          const isHovered = hoverIndex === i;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div
                className={`w-full rounded-t-md transition-all duration-200 ${
                  isHovered ? 'bg-cyan-400 shadow-lg shadow-cyan-500/30' : 'bg-gradient-to-t from-sky-900/60 to-sky-600/80 hover:from-sky-800 hover:to-sky-400'
                }`}
                style={{ height: `${Math.max(8, pct)}%` }}
              />
              <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                {d.time}
              </span>
            </div>
          );
        })}
      </div>

      {hoverIndex !== null && (
        <div className="absolute top-0 right-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
          {data[hoverIndex].time}: <span className="text-white font-bold">{data[hoverIndex].total_count}</span> txs/hr
        </div>
      )}
    </div>
  );
};


// ── 3. RISK DISTRIBUTION HISTOGRAM ─────────────────────────────────────
export const RiskScoreHistogram: React.FC<{ data: RiskDistributionItem[] }> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-3.5">
      {data.map((item, idx) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.tier}
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">{item.count.toLocaleString()} txs</span>
                <span className="text-slate-200 font-semibold w-10 text-right">{pct}%</span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}40`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


// ── 4. MERCHANT CATEGORY FRAUD BAR CHART ──────────────────────────────
export const HorizontalCategoryBarChart: React.FC<{ data: MerchantAnalysisItem[] }> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        return (
          <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800/70 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-slate-200">{item.category}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full font-semibold ${
                item.fraud_rate > 15 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                item.fraud_rate > 5 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {item.fraud_rate}% Fraud Rate
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>Vol: ${item.volume.toLocaleString()}</span>
              <span className="text-rose-400">At Risk: ${item.fraud_volume.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-rose-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(8, item.fraud_rate * 4))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


// ── 5. CIRCULAR RISK GAUGE (FinTech Bloomberg Radar Dial) ──────────────
interface CircularRiskGaugeProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
  animate?: boolean;
}

export const CircularRiskGauge: React.FC<CircularRiskGaugeProps> = ({
  score,
  size = 200,
  label = "FRAUD RISK SCORE"
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 240 degree arc for gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return { stroke: '#ef4444', text: 'text-rose-400', glow: 'shadow-rose-500/30', bg: 'bg-rose-500/10' };
    if (s >= 50) return { stroke: '#f97316', text: 'text-orange-400', glow: 'shadow-orange-500/30', bg: 'bg-orange-500/10' };
    if (s >= 30) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'shadow-amber-500/30', bg: 'bg-amber-500/10' };
    return { stroke: '#10b981', text: 'text-emerald-400', glow: 'shadow-emerald-500/30', bg: 'bg-emerald-500/10' };
  };

  const theme = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${theme.stroke}60)` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold font-mono tracking-tight ${theme.text}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block mb-1">
          {label}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.bg} ${theme.text} border border-current/20`}>
          {score >= 75 ? 'CRITICAL RISK' : score >= 50 ? 'HIGH RISK' : score >= 30 ? 'MEDIUM RISK' : 'LOW RISK'}
        </span>
      </div>
    </div>
  );
};


// ── 6. ROC CURVE CHART ─────────────────────────────────────────────────
export const ROCCurveChart: React.FC<{ height?: number }> = ({ height = 260 }) => {
  const width = 480;
  const pad = { top: 20, right: 20, bottom: 35, left: 45 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  // ROC points for ensemble, xgb, rf, baseline
  const data = [
    { fpr: 0.0, ensemble: 0.0, xgb: 0.0, rf: 0.0 },
    { fpr: 0.02, ensemble: 0.74, xgb: 0.71, rf: 0.65 },
    { fpr: 0.05, ensemble: 0.88, xgb: 0.85, rf: 0.79 },
    { fpr: 0.1, ensemble: 0.94, xgb: 0.92, rf: 0.87 },
    { fpr: 0.2, ensemble: 0.97, xgb: 0.96, rf: 0.93 },
    { fpr: 0.4, ensemble: 0.99, xgb: 0.98, rf: 0.96 },
    { fpr: 1.0, ensemble: 1.0, xgb: 1.0, rf: 1.0 },
  ];

  const getX = (fpr: number) => pad.left + fpr * innerW;
  const getY = (tpr: number) => pad.top + innerH - tpr * innerH;

  const makePath = (key: 'ensemble' | 'xgb' | 'rf') =>
    `M ` + data.map(d => `${getX(d.fpr)},${getY(d[key])}`).join(' L ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v, i) => (
          <g key={i}>
            <line x1={pad.left} y1={getY(v)} x2={pad.left + innerW} y2={getY(v)} stroke="#1e293b" strokeDasharray="3 3" />
            <text x={pad.left - 8} y={getY(v) + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
              {v.toFixed(2)}
            </text>
            <line x1={getX(v)} y1={pad.top} x2={getX(v)} y2={pad.top + innerH} stroke="#1e293b" strokeDasharray="3 3" />
            <text x={getX(v)} y={height - 12} textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Diagonal Baseline (Random Guess) */}
        <line x1={getX(0)} y1={getY(0)} x2={getX(1)} y2={getY(1)} stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />

        {/* Model curves */}
        <path d={makePath('rf')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
        <path d={makePath('xgb')} fill="none" stroke="#a855f7" strokeWidth="2" />
        <path d={makePath('ensemble')} fill="none" stroke="#38bdf8" strokeWidth="3" />
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-300 font-mono mt-1">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-sky-400"></span> Ensemble (AUC 0.978)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-purple-400"></span> XGBoost (AUC 0.984)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-400"></span> Random Forest (AUC 0.965)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-slate-500"></span> Baseline (0.50)</span>
      </div>
    </div>
  );
};


// ── 7. CONFUSION MATRIX VISUALIZER ─────────────────────────────────────
interface ConfusionMatrixProps {
  matrix: { tn: number; fp: number; fn: number; tp: number };
}

export const ConfusionMatrixVisualizer: React.FC<ConfusionMatrixProps> = ({ matrix }) => {
  const total = matrix.tn + matrix.fp + matrix.fn + matrix.tp;
  const tn_pct = ((matrix.tn / total) * 100).toFixed(1);
  const fp_pct = ((matrix.fp / total) * 100).toFixed(1);
  const fn_pct = ((matrix.fn / total) * 100).toFixed(1);
  const tp_pct = ((matrix.tp / total) * 100).toFixed(1);

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-2 gap-3 text-center">
        {/* True Negative */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 transition-colors">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            True Negative (TN)
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-0.5">{matrix.tn.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-300 font-mono">{tn_pct}% • Legitimate Approved</div>
        </div>

        {/* False Positive */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400 transition-colors">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
            False Positive (FP)
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-0.5">{matrix.fp.toLocaleString()}</div>
          <div className="text-[11px] text-amber-300 font-mono">{fp_pct}% • False Alarm (Friction)</div>
        </div>

        {/* False Negative */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 transition-colors">
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
            False Negative (FN)
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-0.5">{matrix.fn.toLocaleString()}</div>
          <div className="text-[11px] text-rose-300 font-mono">{fn_pct}% • Fraud Missed (Loss)</div>
        </div>

        {/* True Positive */}
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40 hover:border-sky-400 transition-colors">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1">
            True Positive (TP)
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-0.5">{matrix.tp.toLocaleString()}</div>
          <div className="text-[11px] text-sky-300 font-mono">{tp_pct}% • Fraud Intercepted</div>
        </div>
      </div>
    </div>
  );
};


// ── 8. FEATURE CONTRIBUTION WATERFALL (SHAP Style) ─────────────────────
export const FeatureContributionChart: React.FC<{ features: FeatureContribution[] }> = ({ features }) => {
  return (
    <div className="space-y-3 select-none">
      {features.map((f, i) => {
        const isRisk = f.direction === 'positive';
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">{f.feature}</span>
              <span className={`font-mono font-semibold ${isRisk ? 'text-rose-400' : 'text-sky-400'}`}>
                {isRisk ? `+${f.impact}% risk impact` : 'neutral baseline'}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isRisk ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-gradient-to-r from-slate-600 to-sky-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, f.impact * 2.5))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
