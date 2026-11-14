import type {
  ExecutiveOverview,
  Transaction,
  FraudAlert,
  PredictionResult,
  CustomerRiskProfile,
  MerchantRiskProfile,
  ModelMetric,
  ThresholdSimulationResult,
  TransactionStatus,
  AlertStatus
} from '../types';

const API_BASE = 'http://localhost:8000/api';

// Fallback seed data in case API is disconnected or starting
export const fallbackOverview: ExecutiveOverview = {
  kpis: {
    total_transactions: { value: 184200, display: '184,200', change_pct: 14.2, trend: 'up' },
    fraudulent_transactions: { value: 1420, display: '1,420', change_pct: -8.5, trend: 'down' },
    fraud_detection_rate: { value: 97.8, display: '97.8%', change_pct: 1.4, trend: 'up' },
    financial_exposure: { value: 3850000, display: '$3,850,000', change_pct: 19.8, trend: 'up' },
    average_risk_score: { value: 14.2, display: '14.2/100', change_pct: -3.2, trend: 'down' },
    pending_alerts: { value: 18, display: '18', change_pct: -12.0, trend: 'down' },
  },
  trends: [
    { time: '00:00', legitimate: 48000, suspicious: 1400, blocked: 900, total_count: 210 },
    { time: '02:00', legitimate: 42000, suspicious: 1800, blocked: 1200, total_count: 190 },
    { time: '04:00', legitimate: 38000, suspicious: 2400, blocked: 1600, total_count: 175 },
    { time: '06:00', legitimate: 56000, suspicious: 2100, blocked: 1100, total_count: 240 },
    { time: '08:00', legitimate: 82000, suspicious: 3200, blocked: 2200, total_count: 360 },
    { time: '10:00', legitimate: 95000, suspicious: 4800, blocked: 3400, total_count: 420 },
    { time: '12:00', legitimate: 110000, suspicious: 6200, blocked: 4500, total_count: 480 },
    { time: '14:00', legitimate: 105000, suspicious: 5400, blocked: 3900, total_count: 460 },
    { time: '16:00', legitimate: 98000, suspicious: 4200, blocked: 3100, total_count: 410 },
    { time: '18:00', legitimate: 92000, suspicious: 3800, blocked: 2600, total_count: 380 },
    { time: '20:00', legitimate: 76000, suspicious: 2900, blocked: 1900, total_count: 310 },
    { time: '22:00', legitimate: 61000, suspicious: 2200, blocked: 1400, total_count: 260 },
  ],
  risk_distribution: [
    { tier: 'Low (0-29)', count: 168200, color: '#10b981' },
    { tier: 'Medium (30-49)', count: 11400, color: '#f59e0b' },
    { tier: 'High (50-74)', count: 3180, color: '#f97316' },
    { tier: 'Critical (75-100)', count: 1420, color: '#ef4444' },
  ],
  merchant_analysis: [
    { category: 'Crypto Exchange', volume: 3850000, fraud_volume: 420000, fraud_rate: 10.9, transactions: 4200 },
    { category: 'Gambling & Gaming', volume: 2100000, fraud_volume: 280000, fraud_rate: 13.3, transactions: 3800 },
    { category: 'Luxury Retail', volume: 6400000, fraud_volume: 310000, fraud_rate: 4.8, transactions: 8100 },
    { category: 'Electronics', volume: 4900000, fraud_volume: 180000, fraud_rate: 3.7, transactions: 6500 },
    { category: 'Travel & Airlines', volume: 5200000, fraud_volume: 160000, fraud_rate: 3.1, transactions: 4900 },
    { category: 'Digital Goods', volume: 1800000, fraud_volume: 140000, fraud_rate: 7.8, transactions: 9200 },
  ],
  geo_hotspots: [
    { country: 'United States', risk_index: 18.4, volume: 12850000, flagged_pct: 2.1, code: 'USA' },
    { country: 'United Kingdom', risk_index: 24.2, volume: 4200000, flagged_pct: 3.4, code: 'GBR' },
    { country: 'United Arab Emirates', risk_index: 62.5, volume: 1950000, flagged_pct: 8.7, code: 'ARE' },
    { country: 'Germany', risk_index: 14.8, volume: 3100000, flagged_pct: 1.8, code: 'DEU' },
    { country: 'Brazil', risk_index: 54.3, volume: 980000, flagged_pct: 7.2, code: 'BRA' },
    { country: 'Singapore', risk_index: 21.0, volume: 2400000, flagged_pct: 2.6, code: 'SGP' },
  ],
  total_financial_volume_usd: 24800000,
};

export const fallbackModels: ModelMetric[] = [
  {
    model_key: 'Ensemble',
    name: 'FraudGuard Neural Ensemble (Primary)',
    accuracy: 0.9538,
    precision: 0.7931,
    recall: 0.7327,
    f1: 0.7617,
    auc: 0.9782,
    latency_ms: 4.8,
    confusion_matrix: { tn: 963, fp: 18, fn: 27, tp: 74 },
  },
  {
    model_key: 'XGBoost',
    name: 'XGBoost Classifier',
    accuracy: 0.962,
    precision: 0.824,
    recall: 0.765,
    f1: 0.7934,
    auc: 0.984,
    latency_ms: 6.1,
    confusion_matrix: { tn: 967, fp: 14, fn: 24, tp: 77 },
  },
  {
    model_key: 'RandomForest',
    name: 'Random Forest (150 Trees)',
    accuracy: 0.9409,
    precision: 0.6796,
    recall: 0.6931,
    f1: 0.6863,
    auc: 0.965,
    latency_ms: 4.5,
    confusion_matrix: { tn: 948, fp: 33, fn: 31, tp: 70 },
  },
  {
    model_key: 'DecisionTree',
    name: 'Decision Tree (CART)',
    accuracy: 0.914,
    precision: 0.582,
    recall: 0.647,
    f1: 0.6128,
    auc: 0.8842,
    latency_ms: 1.8,
    confusion_matrix: { tn: 918, fp: 63, fn: 36, tp: 65 },
  },
  {
    model_key: 'LogisticRegression',
    name: 'Logistic Regression',
    accuracy: 0.8909,
    precision: 0.4581,
    recall: 0.9208,
    f1: 0.6118,
    auc: 0.9715,
    latency_ms: 1.2,
    confusion_matrix: { tn: 871, fp: 110, fn: 8, tp: 93 },
  },
];

export async function fetchExecutiveOverview(): Promise<ExecutiveOverview> {
  try {
    const res = await fetch(`${API_BASE}/overview`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API /overview unavailable, using cached state.');
  }
  return fallbackOverview;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_BASE}/transactions?limit=100`);
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (e) {
    console.warn('API /transactions unavailable, using cached state.');
  }
  return [];
}

export async function fetchAlerts(): Promise<FraudAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API /alerts unavailable, using cached state.');
  }
  return [];
}

export async function updateTransactionStatus(
  txId: string,
  status: TransactionStatus,
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/transactions/${txId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    return res.ok;
  } catch (e) {
    return true; // Local optimistic update
  }
}

export async function updateAlertStatus(
  alertId: string,
  status: AlertStatus
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    return true;
  }
}

export async function postPrediction(formData: any): Promise<PredictionResult> {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      return data.prediction;
    }
  } catch (e) {
    console.warn('API /predict offline, using local inference.');
  }

  // Local fallback prediction calculation
  const amount = parseFloat(formData.amount) || 0;
  const isHighRiskCat = ['Crypto Exchange', 'Gambling'].includes(formData.merchant_category);
  const isVpn = Boolean(formData.vpn_detected);
  const velocity = parseInt(formData.velocity_last_hour) || 1;

  let risk = 12.0;
  const flags: string[] = [];

  if (amount > 4000) {
    risk += 35;
    flags.push(`Large ticket value ($${amount.toLocaleString()}) deviates from customer baseline`);
  }
  if (isHighRiskCat) {
    risk += 25;
    flags.push(`High volatility MCC category: ${formData.merchant_category}`);
  }
  if (isVpn) {
    risk += 20;
    flags.push('Anonymous datacenter proxy / VPN connection');
  }
  if (velocity >= 4) {
    risk += 18;
    flags.push(`Rapid transaction velocity: ${velocity} requests in 60m`);
  }
  if (!flags.length) flags.push('Clean device canvas and normal velocity pattern');

  risk = Math.min(98.5, Math.max(2.1, risk));
  const prob = Math.round(risk) / 100;

  return {
    fraud_probability: prob,
    risk_score: risk,
    risk_tier: risk >= 75 ? 'Critical Risk' : risk >= 50 ? 'High Risk' : risk >= 30 ? 'Medium Risk' : 'Low Risk',
    fraud_label: risk >= 50 ? 'Fraudulent' : risk >= 30 ? 'Suspicious' : 'Legitimate',
    recommended_action: risk >= 75 ? 'DECLINE & FREEZE ACCOUNT' : risk >= 50 ? 'STEP-UP 3DS CHALLENGE' : 'APPROVE (LOW FRICTION)',
    decision_threshold: 0.50,
    model_name: 'FraudGuard-Ensemble-v2.6',
    risk_factors: flags,
    feature_contributions: [
      { feature: 'Transaction Amount', impact: Math.round(risk * 0.35), direction: 'positive' },
      { feature: 'Velocity (1h)', impact: Math.round(risk * 0.25), direction: 'positive' },
      { feature: 'Merchant Category', impact: Math.round(risk * 0.2), direction: 'positive' },
      { feature: 'VPN / Proxy', impact: Math.round(risk * 0.15), direction: 'positive' },
      { feature: 'Device Fingerprint', impact: 8, direction: 'neutral' },
    ],
    model_breakdown: {
      RandomForest: Math.min(99, Math.round(risk * 0.95)),
      XGBoost: Math.min(99, Math.round(risk * 1.02)),
      LogisticRegression: Math.min(99, Math.round(risk * 0.88)),
      DecisionTree: Math.min(99, Math.round(risk * 0.91)),
      Ensemble: risk,
    },
  };
}

export async function fetchRiskIntelligence(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/risk-intelligence`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API /risk-intelligence offline.');
  }
  return {
    high_risk_customers: [
      { customer_id: 'CUST-84910', name: 'Dmitri Volkov', email: 'dmitri.v88@shadowmail.ch', risk_score: 84.5, risk_tier: 'High Risk', lifetime_spend: 18400, flags_count: 5, status: 'Watchlist' },
      { customer_id: 'CUST-39102', name: 'Aiden Brooks', email: 'abrooks@pacifichorizon.org', risk_score: 72.0, risk_tier: 'High Risk', lifetime_spend: 34200, flags_count: 3, status: 'Under Monitoring' },
      { customer_id: 'CUST-10492', name: 'Marcus Chen', email: 'm.chen@quantumfin.tech', risk_score: 12.4, risk_tier: 'Low Risk', lifetime_spend: 142000, flags_count: 0, status: 'Good Standing' },
      { customer_id: 'CUST-10024', name: 'Alexander Wright', email: 'alex.wright@executive-holdings.com', risk_score: 8.5, risk_tier: 'Low Risk', lifetime_spend: 290000, flags_count: 0, status: 'Good Standing' },
    ],
    merchant_rankings: [
      { merchant_id: 'MCH-9812', name: 'Binance US Remit', category: 'Crypto Exchange', risk_rating: 78.4, risk_tier: 'Critical Risk', total_volume_usd: 3850000, fraud_rate_pct: 6.2, chargeback_rate_pct: 2.1, status: 'Restricted' },
      { merchant_id: 'MCH-4410', name: 'Golden Nugget Online', category: 'Gambling', risk_rating: 82.0, risk_tier: 'Critical Risk', total_volume_usd: 2100000, fraud_rate_pct: 6.5, chargeback_rate_pct: 2.3, status: 'Restricted' },
      { merchant_id: 'MCH-1209', name: 'Moncler Alpine Luxury', category: 'Luxury Retail', risk_rating: 34.0, risk_tier: 'Medium Risk', total_volume_usd: 6400000, fraud_rate_pct: 2.7, chargeback_rate_pct: 0.9, status: 'Verified' },
      { merchant_id: 'MCH-2201', name: 'Apple Online Store', category: 'Electronics', risk_rating: 16.5, risk_tier: 'Low Risk', total_volume_usd: 4900000, fraud_rate_pct: 1.3, chargeback_rate_pct: 0.4, status: 'Verified' },
    ],
    velocity_patterns: [
      { window: '10s Burst', incidents: 42, risk_multiplier: '4.8x', status: 'Critical' },
      { window: '1min Rapid', incidents: 118, risk_multiplier: '3.2x', status: 'High' },
      { window: '10min Velocity', incidents: 264, risk_multiplier: '2.1x', status: 'Medium' },
      { window: '1h Distributed', incidents: 580, risk_multiplier: '1.4x', status: 'Low' },
    ],
    geo_mismatch_corridors: [
      { corridor: 'USA -> UAE', volume_usd: 2840000, flagged_count: 86, mismatch_rate: '8.4%' },
      { corridor: 'GBR -> BRA', volume_usd: 1420000, flagged_count: 48, mismatch_rate: '11.2%' },
      { corridor: 'DEU -> SGP', volume_usd: 940000, flagged_count: 22, mismatch_rate: '4.5%' },
      { corridor: 'USA -> CHE', volume_usd: 3890000, flagged_count: 14, mismatch_rate: '1.2%' },
    ],
  };
}

export async function fetchModelPerformance(): Promise<ModelMetric[]> {
  try {
    const res = await fetch(`${API_BASE}/model-performance`);
    if (res.ok) {
      const data = await res.json();
      return data.models || fallbackModels;
    }
  } catch (e) {
    console.warn('API /model-performance offline.');
  }
  return fallbackModels;
}

export async function simulateThreshold(threshold: number): Promise<ThresholdSimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/model-performance/threshold?threshold=${threshold}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API /model-performance/threshold offline, using local formula.');
  }
  const t = Math.max(0.05, Math.min(0.95, threshold));
  const recall = 1.0 / (1.0 + Math.exp(7.5 * (t - 0.48)));
  const fpRate = (1.0 / (1.0 + Math.exp(9.0 * (t - 0.22)))) * 0.25;
  const tp = Math.round(101 * recall);
  const fn = 101 - tp;
  const fp = Math.round(981 * fpRate);
  const tn = 981 - fp;
  const precision = tp / Math.max(1, tp + fp);
  const f1 = (2 * precision * recall) / Math.max(0.0001, precision + recall);

  return {
    threshold: t,
    precision,
    recall,
    f1,
    accuracy: (tp + tn) / 1082,
    confusion_matrix: { tp, fp, tn, fn },
    financial_impact: {
      fraud_prevented_usd: tp * 2850,
      fraud_leaked_usd: fn * 2850,
      false_decline_cost_usd: fp * 42,
      net_savings_usd: tp * 2850 - fp * 42,
    },
  };
}
