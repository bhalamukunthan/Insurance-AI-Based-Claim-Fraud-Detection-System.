import React, { useState, useEffect } from 'react';
import type { ModelMetric, ThresholdSimulationResult } from '../types';
import {
  Cpu,
  BarChart3,
  Sliders,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
  Zap
} from '../components/icons';
import { ROCCurveChart, ConfusionMatrixVisualizer } from '../components/charts';

interface ModelPerformancePageProps {
  models: ModelMetric[];
  onSimulateThreshold: (threshold: number) => Promise<ThresholdSimulationResult | null>;
}

export const ModelPerformancePage: React.FC<ModelPerformancePageProps> = ({
  models,
  onSimulateThreshold,
}) => {
  const [threshold, setThreshold] = useState<number>(0.50);
  const [simulation, setSimulation] = useState<ThresholdSimulationResult>({
    threshold: 0.50,
    precision: 0.7931,
    recall: 0.7327,
    f1: 0.7617,
    accuracy: 0.9538,
    confusion_matrix: { tp: 74, fp: 18, tn: 963, fn: 27 },
    financial_impact: {
      fraud_prevented_usd: 210900.0,
      fraud_leaked_usd: 76950.0,
      false_decline_cost_usd: 756.0,
      net_savings_usd: 210144.0,
    },
  });

  const handleSliderChange = async (val: number) => {
    setThreshold(val);
    const res = await onSimulateThreshold(val);
    if (res) {
      setSimulation(res);
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu size={14} className="animate-pulse" />
            Machine Learning Evaluation Laboratory (2026 Kaggle & FinTech Benchmarks)
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Model Performance & Classification Threshold Studio
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Evaluate precision-recall curves, confusion matrices, and dynamic cost optimization tradeoffs across models
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold">
            Primary Model: FraudGuard Ensemble
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            AUC: 0.9782
          </span>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={15} className="text-sky-400" />
            Multi-Model Evaluation Matrix Benchmark
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Test Partition: 1,082 verified transactions</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Model Architecture</th>
                <th className="p-3.5 text-center">Accuracy</th>
                <th className="p-3.5 text-center">Precision</th>
                <th className="p-3.5 text-center">Recall</th>
                <th className="p-3.5 text-center">F1-Score</th>
                <th className="p-3.5 text-center">ROC-AUC</th>
                <th className="p-3.5 text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {models.map((m) => {
                const isPrimary = m.model_key === 'Ensemble';
                return (
                  <tr
                    key={m.model_key}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isPrimary ? 'bg-sky-500/10 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3.5 text-white font-sans flex items-center gap-2">
                      {isPrimary && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
                      {m.name}
                      {isPrimary && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                          PRODUCTION
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center text-slate-200">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-3.5 text-center text-slate-200">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="p-3.5 text-center text-slate-200">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="p-3.5 text-center text-slate-200">{m.f1.toFixed(4)}</td>
                    <td className="p-3.5 text-center font-bold text-sky-400">{m.auc.toFixed(4)}</td>
                    <td className="p-3.5 text-right text-emerald-400">{m.latency_ms} ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Classification Threshold Studio */}
      <div className="p-6 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sliders size={18} className="text-sky-400" />
              Dynamic Classification Threshold Adjustment Control
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Adjust cutoff to balance between false alarms (customer friction) and false negatives (fraud loss)
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Decision Threshold:</span>
            <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-400 font-extrabold text-sm border border-sky-500/30">
              {threshold.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={threshold}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>0.05 (High Recall / Aggressive Decline)</span>
            <span>0.50 (Calibrated Optimal FinTech Cutoff)</span>
            <span>0.95 (High Precision / Low Friction)</span>
          </div>
        </div>

        {/* Live Metrics Under Selected Threshold */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Precision
            </span>
            <span className="text-xl font-extrabold text-sky-400">
              {(simulation.precision * 100).toFixed(1)}%
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5">True Fraud / Total Flagged</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Recall
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              {(simulation.recall * 100).toFixed(1)}%
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Fraud Intercepted Ratio</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              False Positives
            </span>
            <span className="text-xl font-extrabold text-amber-400">
              {simulation.confusion_matrix.fp} txs
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Legitimate Flagged</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              False Negatives
            </span>
            <span className="text-xl font-extrabold text-rose-400">
              {simulation.confusion_matrix.fn} txs
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Undetected Fraud</span>
          </div>
        </div>

        {/* Financial Impact Readout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 to-slate-900/60 border border-sky-500/20 grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Fraud Intercepted:</span>
            <span className="text-white font-extrabold text-sm sm:text-base">
              ${simulation.financial_impact.fraud_prevented_usd.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Fraud Leaked (Loss):</span>
            <span className="text-rose-400 font-extrabold text-sm sm:text-base">
              ${simulation.financial_impact.fraud_leaked_usd.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Friction Cost (3DS):</span>
            <span className="text-amber-400 font-extrabold text-sm sm:text-base">
              ${simulation.financial_impact.false_decline_cost_usd.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-sky-400 text-[10px] uppercase block">Net Safeguarded Capital:</span>
            <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
              ${simulation.financial_impact.net_savings_usd.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Confusion Matrix Visualizer */}
        <div className="pt-2">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider block mb-3">
            Interactive Confusion Matrix (Threshold {threshold.toFixed(2)})
          </span>
          <ConfusionMatrixVisualizer matrix={simulation.confusion_matrix} />
        </div>
      </div>

      {/* ROC Curves Visualization */}
      <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-sky-400" />
              Receiver Operating Characteristic (ROC-AUC) Curves
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity)
            </p>
          </div>
        </div>
        <ROCCurveChart height={280} />
      </div>
    </div>
  );
};
