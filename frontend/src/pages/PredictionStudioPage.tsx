import React, { useState } from 'react';
import type { PredictionResult, RiskTier } from '../types';
import {
  Cpu,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  CreditCard,
  User,
  Building2,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  Layers
} from '../components/icons';
import { CircularRiskGauge, FeatureContributionChart } from '../components/charts';

interface PredictionStudioPageProps {
  onPredict: (formData: any) => Promise<PredictionResult | null>;
  onSaveToWatchlist?: (customerName: string) => void;
}

export const PredictionStudioPage: React.FC<PredictionStudioPageProps> = ({ onPredict }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Form inputs
  const [amount, setAmount] = useState<number>(4850.0);
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [channel, setChannel] = useState('Online Web');
  const [customerName, setCustomerName] = useState('Dmitri Volkov');
  const [customerId, setCustomerId] = useState('CUST-84910');
  const [merchantName, setMerchantName] = useState('Binance US Remit');
  const [merchantCategory, setMerchantCategory] = useState('Crypto Exchange');
  const [originCountry, setOriginCountry] = useState('United States');
  const [destinationCountry, setDestinationCountry] = useState('United Arab Emirates');
  const [vpnDetected, setVpnDetected] = useState(true);
  const [isNewDevice, setIsNewDevice] = useState(true);
  const [velocityLastHour, setVelocityLastHour] = useState(6);

  // Presets
  const applyPreset = (type: string) => {
    if (type === 'ato') {
      setAmount(8450.0);
      setMerchantName('Moncler Alpine Luxury');
      setMerchantCategory('Luxury Retail');
      setCustomerName('Elena Rostova');
      setCustomerId('CUST-49102');
      setOriginCountry('United Kingdom');
      setDestinationCountry('Brazil');
      setVpnDetected(true);
      setIsNewDevice(true);
      setVelocityLastHour(5);
    } else if (type === 'card_test') {
      setAmount(3.85);
      setMerchantName('Steam Gaming Portal');
      setMerchantCategory('Digital Goods');
      setCustomerName('Anonymous Guest');
      setCustomerId('CUST-99014');
      setOriginCountry('Germany');
      setDestinationCountry('Singapore');
      setVpnDetected(true);
      setIsNewDevice(true);
      setVelocityLastHour(9);
    } else if (type === 'clean_grocery') {
      setAmount(42.50);
      setMerchantName('Whole Foods Market');
      setMerchantCategory('Groceries');
      setCustomerName('Marcus Chen');
      setCustomerId('CUST-10492');
      setOriginCountry('United States');
      setDestinationCountry('United States');
      setVpnDetected(false);
      setIsNewDevice(false);
      setVelocityLastHour(1);
    } else if (type === 'high_roller') {
      setAmount(6200.0);
      setMerchantName('Nordstrom Flagship');
      setMerchantCategory('Luxury Retail');
      setCustomerName('Alexander Wright');
      setCustomerId('CUST-10024');
      setOriginCountry('United States');
      setDestinationCountry('United States');
      setVpnDetected(false);
      setIsNewDevice(false);
      setVelocityLastHour(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      amount,
      currency,
      payment_method: paymentMethod,
      channel,
      customer_name: customerName,
      customer_id: customerId,
      merchant_name: merchantName,
      merchant_category: merchantCategory,
      origin_country: originCountry,
      destination_country: destinationCountry,
      vpn_detected: vpnDetected,
      is_new_device: isNewDevice,
      velocity_last_hour: velocityLastHour,
    };

    try {
      const pred = await onPredict(payload);
      if (pred) {
        setResult(pred);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu size={14} className="animate-pulse" />
            Neural Inference Studio • Model v2.6.0
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            AI Fraud Prediction Studio & Explainability
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Test transactional parameters against the live FraudGuard Neural Ensemble with real-time SHAP feature attribution
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Load Attack Scenario:</span>
          <button
            type="button"
            onClick={() => applyPreset('ato')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono transition-colors"
          >
            Account Takeover
          </button>
          <button
            type="button"
            onClick={() => applyPreset('card_test')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono transition-colors"
          >
            Card Testing Bot
          </button>
          <button
            type="button"
            onClick={() => applyPreset('clean_grocery')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono transition-colors"
          >
            Routine Purchase
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high_roller')}
            className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono transition-colors"
          >
            High-Roller VIP
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Form (7 cols) + Prediction Display (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Section 1: Financial Transaction Parameters */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                <CreditCard size={14} /> 1. Transaction Parameters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Amount ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="Credit Card">Credit Card (Visa/Mastercard)</option>
                    <option value="Wire Transfer">Wire Transfer / SWIFT</option>
                    <option value="ACH Direct">ACH Direct Debit</option>
                    <option value="Apple Pay">Apple Pay (Tokenized)</option>
                    <option value="Crypto On-Ramp">Crypto On-Ramp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Entity & Merchant */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                <Building2 size={14} /> 2. Entity & Merchant Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Customer Name / Account ID
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Merchant Category (MCC)
                  </label>
                  <select
                    value={merchantCategory}
                    onChange={(e) => setMerchantCategory(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                  >
                    <option value="Crypto Exchange">Crypto Exchange (High Risk)</option>
                    <option value="Gambling">Gambling & Wagering (High Risk)</option>
                    <option value="Luxury Retail">Luxury Retail & Apparel</option>
                    <option value="Digital Goods">Digital Goods & Subscriptions</option>
                    <option value="Electronics">Electronics Hardware</option>
                    <option value="Groceries">Supermarket & Groceries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Channel Origin
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                  >
                    <option value="Online Web">Online Web Checkout</option>
                    <option value="Mobile App">Mobile Native SDK</option>
                    <option value="API Gateway">API Gateway Machine-to-Machine</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Network & Geographic Telemetry */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                <Globe size={14} /> 3. Network & Telemetry Forensics
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Destination Corridor
                  </label>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={vpnDetected}
                    onChange={(e) => setVpnDetected(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-slate-200 font-semibold block">Anonymous Proxy / VPN</span>
                    <span className="text-[10px] text-slate-500 font-mono">Datacenter exit node detected</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={isNewDevice}
                    onChange={(e) => setIsNewDevice(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="text-slate-200 font-semibold block">Unrecognized Device</span>
                    <span className="text-[10px] text-slate-500 font-mono">New hardware canvas fingerprint</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 4: Behavioral Velocity */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                  <Activity size={14} /> 4. 60-Minute Velocity Surge
                </span>
                <span className="font-mono text-white font-bold">{velocityLastHour} txs / hour</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={velocityLastHour}
                onChange={(e) => setVelocityLastHour(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 tx (Normal)</span>
                <span>5 tx (Elevated)</span>
                <span>10 tx (Extreme Bot Attack)</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity size={16} className="animate-spin" />
                  Running Neural Ensemble Inference...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Execute Real-Time Fraud Assessment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Prediction Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="p-6 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck size={16} className="text-sky-400" />
                  Prediction Result Dossier
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {result.model_name}
                </span>
              </div>

              {/* Gauge */}
              <div className="flex justify-center py-2">
                <CircularRiskGauge score={result.risk_score} size={170} label="Fraud Probability" />
              </div>

              {/* Action Banner */}
              <div
                className={`p-3.5 rounded-xl border text-center font-mono ${
                  result.risk_score >= 75
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    : result.risk_score >= 50
                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                    : result.risk_score >= 30
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">
                  OPERATIONAL RECOMMENDATION
                </div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wide">
                  {result.recommended_action}
                </div>
              </div>

              {/* Natural Language Explanation */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Key Risk Drivers & Reasoning:
                </span>
                <div className="space-y-1.5">
                  {result.risk_factors.map((factor, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-[11px] flex items-start gap-2"
                    >
                      <AlertTriangle size={13} className="text-rose-400 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHAP Feature Contribution Waterfall */}
              {result.feature_contributions && result.feature_contributions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    SHAP Feature Contribution Attribution:
                  </span>
                  <FeatureContributionChart features={result.feature_contributions} />
                </div>
              )}

              {/* Model Breakdown */}
              {result.model_breakdown && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Individual Model Probabilities:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex justify-between">
                      <span className="text-slate-400">RandomForest:</span>
                      <span className="text-white font-bold">{result.model_breakdown.RandomForest}%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex justify-between">
                      <span className="text-slate-400">XGBoost:</span>
                      <span className="text-white font-bold">{result.model_breakdown.XGBoost}%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex justify-between">
                      <span className="text-slate-400">LogisticReg:</span>
                      <span className="text-white font-bold">{result.model_breakdown.LogisticRegression}%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex justify-between">
                      <span className="text-slate-400">DecisionTree:</span>
                      <span className="text-white font-bold">{result.model_breakdown.DecisionTree}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b101d]/60 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center min-h-[460px] text-xs font-mono text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center">
                <Sparkles size={24} className="text-sky-400" />
              </div>
              <p className="text-slate-400 font-medium">Ready for Transaction Ingestion</p>
              <p className="max-w-xs text-[11px] text-slate-500">
                Select an attack scenario preset or enter custom transaction parameters, then click Execute Real-Time Fraud Assessment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
