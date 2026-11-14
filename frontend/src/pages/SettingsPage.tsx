import React, { useState } from 'react';
import {
  Sliders,
  Lock,
  Radio,
  Cpu,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Check
} from '../components/icons';

interface SettingsPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const [autoDeclineThreshold, setAutoDeclineThreshold] = useState(75);
  const [stepUpThreshold, setStepUpThreshold] = useState(50);
  const [frictionlessFloor, setFrictionlessFloor] = useState(30);

  const [webhookUrl, setWebhookUrl] = useState('https://hooks.fraudguard.fintech/v1/incidents/critical');
  const [slackUrl, setSlackUrl] = useState('https://hooks.slack.com/services/T00/B00/X000');
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKey = 'fg_live_948f2a7bc9103e54b68019a3b';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onShowToast('API Key Copied', 'Production key copied to clipboard securely.', 'info');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('System Settings Saved', 'Threshold policies and webhook endpoints updated across production clusters.', 'success');
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300 max-w-4xl">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Sliders size={14} className="animate-pulse" />
            FinTech Security Configuration
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Enterprise System Settings & Defense Policies
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure automated transaction interception policies, webhook alerts, and cryptographic credentials
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-600/25"
        >
          <Check size={14} />
          Save Global Policies
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-mono">
        {/* Section 1: Risk Cutoff Policy */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield size={16} className="text-sky-400" />
              Automated Risk Scoring & Action Policy
            </h2>
            <span className="text-[10px] text-emerald-400">ACTIVE PRODUCTION RULESET</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-semibold">Immediate Auto-Decline & Freeze Floor:</span>
                <span className="text-rose-400 font-bold text-sm">{autoDeclineThreshold}.0 Risk Score</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={autoDeclineThreshold}
                onChange={(e) => setAutoDeclineThreshold(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Transactions scoring equal to or above this value are dropped immediately at the edge gateway.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-semibold">Mandatory Step-Up 3DS Friction Floor:</span>
                <span className="text-amber-400 font-bold text-sm">{stepUpThreshold}.0 Risk Score</span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                value={stepUpThreshold}
                onChange={(e) => setStepUpThreshold(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Transactions between this threshold and Auto-Decline trigger biometric or SMS one-time challenge.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-semibold">Frictionless Instant Approval Ceiling:</span>
                <span className="text-emerald-400 font-bold text-sm">{frictionlessFloor}.0 Risk Score</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={frictionlessFloor}
                onChange={(e) => setFrictionlessFloor(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Transactions below this value are approved in &lt;10ms with zero customer checkout friction.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Webhooks & Alerts */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio size={16} className="text-sky-400" />
              Real-Time Incident Webhooks & PagerDuty
            </h2>
            <span className="text-[10px] text-sky-400">TLS 1.3 ENCRYPTED</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">
                Critical Incident Webhook Target URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">
                Security Operations Center (Slack / Teams Webhook)
              </label>
              <input
                type="url"
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: API Credentials */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock size={16} className="text-sky-400" />
              Production API Authentication Token
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-400 text-[11px]">Live Machine-to-Machine API Key</label>
            <div className="flex items-center gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title={showApiKey ? 'Mask Key' : 'Reveal Key'}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="Copy Key"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: AI Model Deployment Info */}
        <div className="p-5 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-sky-400" />
            AI Model Engine Deployment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Active Architecture</span>
              <span className="text-white font-bold">Neural Ensemble v2.6.0</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Inference Acceleration</span>
              <span className="text-emerald-400 font-bold">ONNX Runtime / Vectorized</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">In-Memory Cache Hit Rate</span>
              <span className="text-sky-400 font-bold">98.4%</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

