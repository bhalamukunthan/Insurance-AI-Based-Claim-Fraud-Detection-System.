import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON
from .database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    # Financial details
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_method = Column(String(50), default="Credit Card")  # Credit Card, ACH Transfer, Wire, Crypto, Digital Wallet
    channel = Column(String(50), default="Online Web")  # Online Web, Mobile App, POS Terminal, API Gateway
    
    # Customer details
    customer_id = Column(String(50), index=True)
    customer_name = Column(String(100))
    customer_email = Column(String(120))
    customer_risk_tier = Column(String(20), default="Low")
    
    # Merchant details
    merchant_id = Column(String(50), index=True)
    merchant_name = Column(String(100))
    merchant_category = Column(String(50))  # Luxury Retail, Crypto Exchange, Electronics, Travel, Gambling, Digital Goods
    
    # Geolocation and Network
    origin_country = Column(String(50), default="United States")
    destination_country = Column(String(50), default="United States")
    ip_address = Column(String(50))
    device_id = Column(String(100))
    device_type = Column(String(50))  # macOS Safari, iOS App, Android App, Windows Chrome, Linux Firefox
    vpn_detected = Column(Boolean, default=False)
    
    # AI/ML Evaluation
    risk_score = Column(Float, default=0.0)  # 0.0 to 100.0
    fraud_probability = Column(Float, default=0.0)  # 0.0 to 1.0
    fraud_label = Column(String(20), default="Legitimate")  # Legitimate, Suspicious, Fraudulent
    risk_tier = Column(String(20), default="Low Risk")  # Low Risk, Medium Risk, High Risk, Critical Risk
    status = Column(String(20), default="Approved")  # Approved, Flagged, Declined, Under Review
    
    # Explainability & Metrics
    model_name = Column(String(50), default="FraudGuard-Ensemble-v2")
    decision_threshold = Column(Float, default=0.50)
    risk_factors = Column(JSON, default=list)  # list of strings
    feature_contributions = Column(JSON, default=dict)  # feature -> weight
    
    # Operational Audit
    reviewed_by = Column(String(100), nullable=True)
    review_notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)
    transaction_id = Column(String(50), index=True, nullable=False)
    severity = Column(String(20), default="High")  # Critical, High, Medium, Low
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    fraud_probability = Column(Float, default=0.85)
    rule_triggered = Column(String(100))
    status = Column(String(30), default="Open")  # Open, In Progress, Resolved, Dismissed
    assigned_analyst = Column(String(100), default="Senior FinTech Analyst")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)


class MerchantRisk(Base):
    __tablename__ = "merchant_risks"

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    category = Column(String(50))
    risk_rating = Column(Float, default=15.0)  # 0 to 100
    risk_tier = Column(String(20), default="Low Risk")
    total_volume_usd = Column(Float, default=0.0)
    total_transactions = Column(Integer, default=0)
    fraud_count = Column(Integer, default=0)
    fraud_rate_pct = Column(Float, default=0.0)
    chargeback_rate_pct = Column(Float, default=0.0)
    status = Column(String(20), default="Verified")  # Verified, Elevated Monitoring, Restricted


class CustomerRiskProfile(Base):
    __tablename__ = "customer_risk_profiles"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    email = Column(String(120))
    risk_score = Column(Float, default=10.0)
    risk_tier = Column(String(20), default="Low Risk")
    lifetime_spend = Column(Float, default=0.0)
    transaction_count = Column(Integer, default=0)
    chargeback_count = Column(Integer, default=0)
    flags_count = Column(Integer, default=0)
    account_status = Column(String(20), default="Good Standing")
    last_active = Column(DateTime, default=datetime.datetime.utcnow)

