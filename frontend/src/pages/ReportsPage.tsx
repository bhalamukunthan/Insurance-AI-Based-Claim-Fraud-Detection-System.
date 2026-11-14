import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Clock,
  Sparkles
} from '../components/icons';

export const ReportsPage: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportsList = [
    {
      id: 'SAR-2026-Q4',
      title: 'Suspicious Activity Report (FinCEN SAR Form 111)',
      period: 'October 1 - Present (Q4 2026)',
      type: 'Regulatory Compliance',
      fileSize: '4.2 MB PDF',
      status: 'VERIFIED COMPLIANT',
    },
    {
      id: 'EXEC-FRAUD-OCT',
      title: 'Executive Financial Exposure & Prevention Dossier',
      period: 'Monthly Summary (October 2026)',
      type: 'Board of Directors Audit',
      fileSize: '2.8 MB PDF',
      status: 'AUDITED & SIGNED',
    },
    {
      id: 'PCI-DSS-4.0',
      title: 'Payment Card Industry Data Security Attestation',
      period: 'Annual Certification 2026',
      type: 'Security Standards',
      fileSize: '6.1 MB PDF',
      status: 'CERTIFIED PASS',
    },
    {
      id: 'MODEL-GOV-2.6',
      title: 'AI Model Risk Governance & Algorithmic Bias Audit',
      period: 'FraudGuard Ensemble v2.6.0',
      type: 'Model Validation',
      fileSize: '3.5 MB PDF',
      status: 'BIAS AUDIT PASSED',
    },
  ];

  const handleDownloadReport = (title: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDownloadSuccess(title);
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText size={14} className="animate-pulse" />
            FinTech Regulatory & Institutional Compliance
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Audit Trails, SAR Filings & Executive Reports
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automated compliance reporting conforming to FinCEN, Bank Secrecy Act (BSA), and PCI-DSS 4.0 guidelines
          </p>
        </div>

        <button
          onClick={() => handleDownloadReport('Instant Consolidated SAR Filing Package')}
          disabled={generating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-600/25 disabled:opacity-50"
        >
          {generating ? 'Compiling Dossier...' : 'Generate Instant SAR Package'}
          <Download size={14} />
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          Successfully compiled and generated: {downloadSuccess}. Download complete.
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-400">{rep.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {rep.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-400 font-mono">{rep.period}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">{rep.fileSize}</span>
              <button
                onClick={() => handleDownloadReport(rep.title)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Download size={13} className="text-sky-400" />
                Download Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Immutable Audit Log */}
      <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <Lock size={15} className="text-sky-400" />
            Cryptographic SOC-2 Immutable Audit Log (SHA-256 Hashed)
          </h3>
          <span className="text-[10px] text-emerald-400 font-mono">ZERO INTEGRITY BREACHES</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
            <span>[2026-11-13 03:24:18 UTC] Model weights signature verified: FraudGuard Ensemble v2.6.0</span>
            <span className="text-[10px] text-slate-500">Hash: 8f9b...a10c</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
            <span>[2026-11-13 02:40:05 UTC] Automated threshold auto-tune simulated: 0.50 optimal cutoff</span>
            <span className="text-[10px] text-slate-500">Hash: 4c21...d9e2</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
            <span>[2026-11-13 01:15:33 UTC] Sarah Vance (CRO) authenticated via FIDO2 WebAuthn Token</span>
            <span className="text-[10px] text-slate-500">Hash: 7e44...32b1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

