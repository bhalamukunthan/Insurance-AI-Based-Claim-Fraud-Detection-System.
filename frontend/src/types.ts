export type RiskTier = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
export type FraudLabel = 'Legitimate' | 'Suspicious' | 'Fraudulent';
export type TransactionStatus = 'Approved' | 'Flagged' | 'Declined' | 'Under Review';
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Open' | 'In Progress' | 'Resolved' | 'Dismissed';

export interface Transaction {
  id: number;
  transaction_id: string;
  timestamp: string;
  amount: number;
  currency: string;
  payment_method: string;
  channel: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  merchant_id: string;
  merchant_name: string;
  merchant_category: string;
  origin_country: string;
  destination_country: string;
  ip_address: string;
  device_type: string;
  vpn_detected: boolean;
  risk_score: number;
  fraud_probability: number;
  fraud_label: FraudLabel;
  risk_tier: RiskTier;
  status: TransactionStatus;
  risk_factors: string[];
  feature_contributions?: Record<string, any>;
  model_name?: string;
  decision_threshold?: number;
  reviewed_by?: string;
  review_notes?: string;
}

export interface FraudAlert {
  id: number;
  alert_id: string;
  transaction_id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  fraud_probability: number;
  rule_triggered: string;
  status: AlertStatus;
  assigned_analyst: string;
  created_at: string;
}

export interface KPICardData {
  value: number;
  display: string;
  change_pct: number;
  trend: 'up' | 'down';
}

export interface HourlyTrend {
  time: string;
  legitimate: number;
  suspicious: number;
  blocked: number;
  total_count: number;
}

export interface RiskDistributionItem {
  tier: string;
  count: number;
  color: string;
}

export interface MerchantAnalysisItem {
  category: string;
  volume: number;
  fraud_volume: number;
  fraud_rate: number;
  transactions: number;
}

export interface GeoHotspotItem {
  country: string;
  risk_index: number;
  volume: number;
  flagged_pct: number;
  code: string;
}

export interface ExecutiveOverview {
  kpis: {
    total_transactions: KPICardData;
    fraudulent_transactions: KPICardData;
    fraud_detection_rate: KPICardData;
    financial_exposure: KPICardData;
    average_risk_score: KPICardData;
    pending_alerts: KPICardData;
  };
  trends: HourlyTrend[];
  risk_distribution: RiskDistributionItem[];
  merchant_analysis: MerchantAnalysisItem[];
  geo_hotspots: GeoHotspotItem[];
  total_financial_volume_usd: number;
}

export interface FeatureContribution {
  feature: string;
  impact: number;
  direction: 'positive' | 'neutral' | 'negative';
}

export interface PredictionResult {
  fraud_probability: number;
  risk_score: number;
  risk_tier: RiskTier;
  fraud_label: FraudLabel;
  recommended_action: string;
  decision_threshold: number;
  model_name: string;
  risk_factors: string[];
  feature_contributions: FeatureContribution[];
  model_breakdown: {
    RandomForest: number;
    XGBoost: number;
    LogisticRegression: number;
    DecisionTree: number;
    Ensemble: number;
  };
}

export interface CustomerRiskProfile {
  customer_id: string;
  name: string;
  email: string;
  risk_score: number;
  risk_tier: RiskTier;
  lifetime_spend: number;
  flags_count: number;
  status: string;
}

export interface MerchantRiskProfile {
  merchant_id: string;
  name: string;
  category: string;
  risk_rating: number;
  risk_tier: RiskTier;
  total_volume_usd: number;
  fraud_rate_pct: number;
  chargeback_rate_pct: number;
  status: string;
}

export interface ModelMetric {
  model_key: string;
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  latency_ms: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

export interface ThresholdSimulationResult {
  threshold: number;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
  confusion_matrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  financial_impact: {
    fraud_prevented_usd: number;
    fraud_leaked_usd: number;
    false_decline_cost_usd: number;
    net_savings_usd: number;
  };
}

export type ActiveNavTab =
  | 'overview'
  | 'command-center'
  | 'transactions'
  | 'predictions'
  | 'risk-intelligence'
  | 'model-performance'
  | 'reports'
  | 'settings';

