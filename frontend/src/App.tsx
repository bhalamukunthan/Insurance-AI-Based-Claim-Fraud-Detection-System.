import React, { useState, useEffect, useCallback } from 'react';
import type {
  ActiveNavTab,
  ExecutiveOverview,
  Transaction,
  FraudAlert,
  ModelMetric,
  TransactionStatus,
  AlertStatus,
  PredictionResult,
} from './types';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewPage } from './pages/OverviewPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { PredictionStudioPage } from './pages/PredictionStudioPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionDrawer } from './components/common/TransactionDrawer';
import { AlertDrawer } from './components/common/AlertDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import type { ToastMessage } from './components/common/ToastContainer';
import { ToastContainer } from './components/common/ToastContainer';

import {
  fetchExecutiveOverview,
  fetchTransactions,
  fetchAlerts,
  updateTransactionStatus,
  updateAlertStatus,
  postPrediction,
  fetchRiskIntelligence,
  fetchModelPerformance,
  simulateThreshold,
  fallbackOverview,
  fallbackModels,
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('overview');
  const [dateRange, setDateRange] = useState<string>('Last 24 Hours');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // Data states
  const [overviewData, setOverviewData] = useState<ExecutiveOverview>(fallbackOverview);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [models, setModels] = useState<ModelMetric[]>(fallbackModels);
  const [riskIntel, setRiskIntel] = useState<any>({
    high_risk_customers: [],
    merchant_rankings: [],
    velocity_patterns: [],
    geo_mismatch_corridors: [],
  });

  // Active Modals & Drawers
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
      const id = Date.now().toString() + Math.random().toString();
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all initial data
  const loadData = useCallback(async () => {
    const [ov, txs, alts, mdls, rk] = await Promise.all([
      fetchExecutiveOverview(),
      fetchTransactions(),
      fetchAlerts(),
      fetchModelPerformance(),
      fetchRiskIntelligence(),
    ]);
    if (ov) setOverviewData(ov);
    if (txs && txs.length > 0) setTransactions(txs);
    if (alts && alts.length > 0) setAlerts(alts);
    if (mdls && mdls.length > 0) setModels(mdls);
    if (rk) setRiskIntel(rk);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // WebSocket / Streaming simulation
  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: any = null;

    try {
      ws = new WebSocket('ws://localhost:8000/ws/transactions');
      ws.onopen = () => {
        setWsConnected(true);
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NEW_TRANSACTION' && msg.data) {
            handleIncomingLiveTransaction(msg.data);
          }
        } catch (e) {}
      };
      ws.onclose = () => {
        setWsConnected(false);
      };
      ws.onerror = () => {
        setWsConnected(false);
      };
    } catch (e) {
      setWsConnected(false);
    }

    // Simulated ingestion if streaming is enabled and WS is idle
    if (isStreaming) {
      fallbackInterval = setInterval(() => {
        simulateRandomIngest();
      }, 7000);
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [isStreaming]);

  // Handle incoming live transaction from WS or generator
  const handleIncomingLiveTransaction = (tx: any) => {
    setTransactions((prev) => [tx, ...prev.slice(0, 150)]);
    if (tx.risk_score >= 75) {
      showToast(
        'Critical Anomaly Intercepted',
        `$${tx.amount?.toLocaleString()} at ${tx.merchant_name || 'Merchant'} flagged as CRITICAL fraud.`,
        'error'
      );
    }
  };

  const simulateRandomIngest = () => {
    const merchants = ['Apple Online', 'Steam Portal', 'Binance US', 'Nordstrom', 'Golden Nugget'];
    const customers = ['Kenji Sato', 'Elena Rostova', 'Marcus Chen', 'Chloe Dupont', 'Alexander Wright'];
    const isSuspicious = Math.random() < 0.18;
    const amount = isSuspicious
      ? Math.round(Math.random() * 8500 + 1500)
      : Math.round(Math.random() * 350 + 15);
    const risk = isSuspicious ? Math.round(Math.random() * 45 + 52) : Math.round(Math.random() * 25 + 4);
    const mName = merchants[Math.floor(Math.random() * merchants.length)];
    const cName = customers[Math.floor(Math.random() * customers.length)];
    const id = `TXN-2026-${Math.floor(Math.random() * 900000 + 100000)}`;

    const newTx: Transaction = {
      id: Math.floor(Math.random() * 100000),
      transaction_id: id,
      timestamp: new Date().toISOString(),
      amount,
      currency: 'USD',
      payment_method: 'Credit Card',
      channel: 'Online Web',
      customer_id: `CUST-${Math.floor(Math.random() * 80000 + 10000)}`,
      customer_name: cName,
      customer_email: `${cName.toLowerCase().replace(' ', '.')}@domain.fintech`,
      merchant_id: `MCH-${Math.floor(Math.random() * 9000 + 1000)}`,
      merchant_name: mName,
      merchant_category: 'General Retail',
      origin_country: 'United States',
      destination_country: isSuspicious ? 'United Arab Emirates' : 'United States',
      ip_address: `198.51.100.${Math.floor(Math.random() * 250 + 2)}`,
      device_type: 'macOS Safari 18.2',
      vpn_detected: isSuspicious,
      risk_score: risk,
      fraud_probability: risk / 100,
      fraud_label: risk >= 50 ? 'Fraudulent' : risk >= 30 ? 'Suspicious' : 'Legitimate',
      risk_tier: risk >= 75 ? 'Critical Risk' : risk >= 50 ? 'High Risk' : risk >= 30 ? 'Medium Risk' : 'Low Risk',
      status: risk >= 75 ? 'Declined' : risk >= 50 ? 'Flagged' : 'Approved',
      risk_factors: isSuspicious ? ['High ticket deviation vs baseline', 'Corridor mismatch'] : [],
    };

    handleIncomingLiveTransaction(newTx);
  };

  // Keyboard shortcut listener for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update handlers
  const handleUpdateTransactionStatus = async (
    id: string,
    status: TransactionStatus,
    notes?: string
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.transaction_id === id ? { ...t, status, review_notes: notes } : t))
    );
    if (selectedTransaction?.transaction_id === id) {
      setSelectedTransaction((prev) => (prev ? { ...prev, status, review_notes: notes } : null));
    }
    await updateTransactionStatus(id, status, notes);
    showToast('Transaction Updated', `${id} status set to ${status}.`, 'success');
  };

  const handleUpdateAlertStatus = async (alertId: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.alert_id === alertId ? { ...a, status } : a)));
    if (selectedAlert?.alert_id === alertId) {
      setSelectedAlert((prev) => (prev ? { ...prev, status } : null));
    }
    await updateAlertStatus(alertId, status);
    showToast('Alert Updated', `${alertId} marked as ${status}.`, 'success');
  };

  const handlePredictSubmit = async (formData: any): Promise<PredictionResult | null> => {
    const res = await postPrediction(formData);
    if (res) {
      showToast(
        'Inference Completed',
        `Assessed with ${res.risk_score}% fraud risk (${res.risk_tier}).`,
        res.risk_score >= 50 ? 'warning' : 'success'
      );
      loadData();
    }
    return res;
  };

  const handleThresholdSimulate = async (thresh: number) => {
    return await simulateThreshold(thresh);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        openAlertCount={alerts.filter((a) => a.status === 'Open').length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Navigation */}
        <TopNav
          activeTab={activeTab}
          dateRange={dateRange}
          setDateRange={setDateRange}
          openGlobalSearch={() => setIsSearchOpen(true)}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          setMobileOpen={setMobileOpen}
          alerts={alerts}
          onSelectAlert={(a) => setSelectedAlert(a)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              data={overviewData}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectAlert={(a) => setSelectedAlert(a)}
              alerts={alerts}
            />
          )}

          {activeTab === 'command-center' && (
            <CommandCenterPage
              transactions={transactions}
              alerts={alerts}
              isStreaming={isStreaming}
              setIsStreaming={setIsStreaming}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onSelectAlert={(a) => setSelectedAlert(a)}
              onRefresh={loadData}
              wsConnected={wsConnected}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionStudioPage onPredict={handlePredictSubmit} />
          )}

          {activeTab === 'risk-intelligence' && (
            <RiskIntelligencePage
              customers={riskIntel.high_risk_customers || []}
              merchants={riskIntel.merchant_rankings || []}
              velocityPatterns={riskIntel.velocity_patterns || []}
              corridors={riskIntel.geo_mismatch_corridors || []}
            />
          )}

          {activeTab === 'model-performance' && (
            <ModelPerformancePage
              models={models}
              onSimulateThreshold={handleThresholdSimulate}
            />
          )}

          {activeTab === 'reports' && <ReportsPage />}

          {activeTab === 'settings' && <SettingsPage onShowToast={showToast} />}
        </main>
      </div>

      {/* Slide-over Forensics Drawers */}
      <TransactionDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onUpdateStatus={handleUpdateTransactionStatus}
      />

      <AlertDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdateStatus={handleUpdateAlertStatus}
        onViewTransaction={(txId) => {
          const match = transactions.find((t) => t.transaction_id === txId);
          if (match) setSelectedTransaction(match);
        }}
      />

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        transactions={transactions}
        alerts={alerts}
        onSelectTransaction={(tx) => setSelectedTransaction(tx)}
        onSelectAlert={(a) => setSelectedAlert(a)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
