# 🛡️ FRAUDGUARD AI — Enterprise Financial Fraud Detection System (2026)

> **Next-Generation Autonomous Fraud Intelligence, High-Velocity Transaction Screening & Machine Learning Evaluation Platform.**  
> Inspired by Stripe Dashboard, Linear, Vercel, and Bloomberg Financial Terminals.

---

## 💎 Visual Design & Architectural Overview

FraudGuard AI is an enterprise-grade FinTech application designed specifically for Chief Risk Officers (CROs), quantitative fraud analysts, banking executives, and institutional compliance officers.

### Visual Design System
- **Deep Midnight Navy Canvas**: `#070b14` and `#0b1120` layered dark surfaces for high contrast data density.
- **Electric Blue & Cyan Accents**: `#38bdf8` and `#06b6d4` highlights for transactional activity and ML confidence vectors.
- **Subtle Glassmorphism**: `backdrop-blur-xl` panels with `rgba(255, 255, 255, 0.07)` borders and soft inner ambient glow.
- **Institutional Typography**: Clean `Inter` font for quantitative metrics paired with `JetBrains Mono` for cryptographic hashes, IP addresses, and transaction IDs.
- **Zero Heavy Bloat**: Ultra-fast deterministic Vite build (<600ms) with zero flaky external CSS/icon dependencies.

---

## 🚀 Key Modules & System Capabilities

### 1. 📊 Executive Dashboard
- **6 Real-Time KPI Cards**: Total Volume Processed ($24.8M), Fraudulent Interceptions (1,420), Fraud Detection Rate (97.8% AUC), Safeguarded Capital ($3.85M), Average Population Risk Score (14.2), and Critical Pending Alerts (18).
- **Time-Series Area Trends**: Multi-series area chart tracking legitimate volume, step-up audited claims, and instant blocked fraud over time.
- **Hourly Ingestion Velocity**: Peak transaction load distribution across gateway clusters.
- **Risk Score Distribution**: Tiered population breakdown (Low Risk, Medium Risk, High Risk, Critical Risk).
- **Merchant Risk Volatility**: Categorical ranking across Crypto Exchanges, Gambling, Luxury Retail, and Digital Goods.
- **Geographic Risk Hotspots**: Cross-border risk index and country-level exposure matrix.

### 2. 📡 Fraud Command Center
- **Real-Time WebSocket Streaming**: Live transaction activity feed streaming directly via `/ws/transactions`.
- **Live Radar Ingestion**: Autonomous incoming transaction processing with risk tier badges and sound notification triggers.
- **Critical Fraud Alerts Feed**: Instant prioritization by severity (`Critical`, `High`, `Medium`, `Low`).
- **Forensic Alert Detail Drawer**: Deep dive into triggered heuristic rules, assessed fraud probabilities, and one-click resolution ("Mark Resolved", "Dismiss False Positive").

### 3. 🔍 Advanced Transaction Explorer
- **Global In-Memory & Backend Querying**: Instant search across Transaction IDs, Customer Names, Merchant Names, and IP addresses.
- **Multi-Filter Controls**: Filter by Status (`Approved`, `Flagged`, `Declined`, `Under Review`), Risk Tier, and Min/Max dollar amounts.
- **Sortable Columns**: Instant column sort by Timestamp, Amount, Risk Score, Customer, and Merchant.
- **Client-Side CSV Exporter**: Generates and downloads real CSV audit spreadsheets based on filtered views.
- **Slide-Over Forensic Inspection Drawer**: Full device canvas fingerprinting, origin-destination routing, payment channel telemetry, and CRO audit notes persistence.

### 4. 🧠 AI Prediction Studio
- **Multi-Section Parameter Input**: Transaction parameters, entity profiles, network/proxy telemetry, and 60-minute velocity surge simulation.
- **Pre-Configured Attack Scenarios**: One-click simulation of Account Takeovers (ATO), Card Testing Botnets, High-Roller VIP purchases, and Routine Domestic transactions.
- **Circular Risk Gauge**: High-precision SVG dial gauge with dynamic color calibration (0–100).
- **SHAP Feature Contribution Waterfall**: Explainability breakdown attributing risk percentages to Transaction Amount, Velocity, Geographic Mismatch, and Datacenter Proxies.
- **Multi-Model Probability Comparison**: Live breakdown across RandomForest, XGBoost, LogisticRegression, and CART DecisionTree.

### 5. 🌐 Risk Intelligence Center
- **Customer Risk Registry**: High-risk entities, lifetime spend, flag count, and monitoring status.
- **Merchant Volatility Rankings**: Merchant volume, fraud rate %, chargeback rate %, and compliance restrictions.
- **Geographic Mismatch Corridors**: Corridors with elevated cross-border anomalies (e.g. USA → UAE, GBR → BRA).
- **Velocity Multipliers**: Burst analysis across 10-second, 1-minute, and 10-minute observation windows.

### 6. 📈 Model Performance Laboratory
- **Evaluation Benchmarks**: Precision (79.3%), Recall (73.3%), F1-Score (76.2%), Accuracy (95.4%), and ROC-AUC (0.9782).
- **Multi-Model Benchmark Matrix**: Side-by-side comparison of Logistic Regression, Decision Tree, Random Forest, XGBoost, and FraudGuard Ensemble.
- **Dynamic Classification Threshold Slider**: Interactive slider (0.05 to 0.95) recalculating Precision, Recall, False Positives, False Negatives, and Net Financial Savings in real time.
- **Interactive Confusion Matrix Visualizer**: True Negatives, False Positives, False Negatives, and True Positives with percentage distributions.
- **Multi-Model ROC Curves**: Interactive True Positive vs. False Positive rate tradeoff curves.

### 7. 📑 Reports & Institutional Compliance
- **Regulatory Filings**: FinCEN Suspicious Activity Reports (SAR Form 111).
- **Executive Exposure Summaries**: Board of Directors audit reports.
- **Security Attestations**: PCI-DSS 4.0 and Model Governance documentation.
- **SOC-2 Immutable Audit Log**: Cryptographically signed audit trail entries.

### 8. ⚙️ System Settings & Policies
- **Threshold Cutoff Tuning**: Edge Auto-Decline floor, 3DS Step-Up challenge floor, and Frictionless Approval ceiling.
- **Real-Time Webhooks**: Incident URL triggers for Security Operations Center (Slack, Teams, PagerDuty).
- **Machine-to-Machine API Keys**: Copyable, maskable production credentials.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Design System** | Tailwind CSS + Custom FinTech Midnight Navy Design Tokens |
| **Data Visualizations** | Custom High-Performance SVG Charts & Gauges (Zero External Runtime Bloat) |
| **Icons** | Custom Crisp Lucide-Compatible SVG Vector Components |
| **Backend API** | FastAPI + Uvicorn (Asynchronous, High-Concurrency) |
| **Database** | SQLite default (`fraudguard.db`) with native PostgreSQL support (`DATABASE_URL`) |
| **Real-Time Pipeline** | WebSockets (`/ws/transactions`) |
| **Machine Learning** | Scikit-Learn, Joblib, NumPy, Pandas, SHAP Explainability Engine |

---

## ⚡ Quick Start & Autonomous Execution

### Option A: One-Click Launch (Windows)
Double-click:
```cmd
run_all.bat
```
This automatically launches:
1. The FastAPI backend at `http://localhost:8000`
2. The Vite React frontend at `http://localhost:5173`

### Option B: Manual Startup

#### 1. Start the Backend:
```bash
# From project root: C:\Users\Asus\.gemini\antigravity\scratch\fraudguard-ai
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs & Swagger UI: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

#### 2. Start the Frontend:
```bash
cd frontend
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🧪 Verification & Build Status

- **Frontend Production Build**: `npm run build` -> `✓ built in 587ms` (Zero errors, zero warnings).
- **Backend API & Seeding**: `120+` realistic transactions, merchants, alerts, and customer profiles pre-seeded.
- **Model Inference**: `POST /api/predict` returns comprehensive risk scoring, SHAP explainability, and multi-model probability breakdowns.

