import datetime
import random
from typing import List
from sqlalchemy.orm import Session
from .models import Transaction, FraudAlert, MerchantRisk, CustomerRiskProfile
from .ml_engine import ml_engine

MERCHANTS = [
    ("Apex Digital Goods", "Digital Goods", 42.5, "Elevated Monitoring"),
    ("Binance US Remit", "Crypto Exchange", 78.4, "Restricted"),
    ("Nordstrom Flagship", "Luxury Retail", 18.2, "Verified"),
    ("FlyEmirates Global", "Travel & Airlines", 29.6, "Verified"),
    ("Golden Nugget Online", "Gambling", 82.0, "Restricted"),
    ("Apple Online Store", "Electronics", 16.5, "Verified"),
    ("Whole Foods Market", "Groceries", 3.2, "Verified"),
    ("Moncler Alpine Luxury", "Luxury Retail", 34.0, "Verified"),
    ("Steam Gaming Portal", "Digital Goods", 28.5, "Verified"),
    ("Coinbase Prime", "Crypto Exchange", 64.2, "Elevated Monitoring"),
    ("Starbucks Reserve", "Food & Beverage", 4.1, "Verified"),
    ("Uber Technologies", "Rideshare", 8.9, "Verified"),
    ("Amazon Marketplace", "E-Commerce", 12.3, "Verified"),
    ("Tiffany & Co.", "Luxury Jewelry", 58.7, "Elevated Monitoring"),
    ("Western Union Transfer", "Wire Remittance", 72.0, "Restricted"),
]

CUSTOMERS = [
    ("Alexander Wright", "alex.wright@executive-holdings.com", "High Net Worth"),
    ("Elena Rostova", "e.rostova@cyberdynesec.io", "Standard"),
    ("Marcus Chen", "m.chen@quantumfin.tech", "Trusted VIP"),
    ("Sophia Al-Mansoor", "sophia.m@gulfcapital.ae", "Standard"),
    ("Dmitri Volkov", "dmitri.v88@shadowmail.ch", "Watchlist"),
    ("Chloe Dupont", "c.dupont@parisianart.fr", "Standard"),
    ("Vikram Malhotra", "vikram.m@bluestarindia.in", "Trusted VIP"),
    ("Liam O'Connor", "loconnor@dublindev.ie", "Standard"),
    ("Isabella Santos", "isabella.s@saopaulotrade.br", "Standard"),
    ("Aiden Brooks", "abrooks@pacifichorizon.org", "Watchlist"),
    ("Hannah Becker", "hannah.becker@berlinbiotech.de", "Standard"),
    ("Kenji Sato", "k.sato@tokyoconsulting.jp", "Trusted VIP"),
]

COUNTRIES = [
    "United States", "United Kingdom", "Germany", "Singapore", "Japan",
    "Switzerland", "Canada", "France", "United Arab Emirates", "Brazil"
]

DEVICES = [
    "macOS Safari 18.2", "Windows 11 Chrome 133", "iOS 18.3 iPhone 16 Pro",
    "Android 15 Samsung S25", "Linux Ubuntu Firefox 135"
]

PAYMENT_METHODS = ["Credit Card", "Debit Card", "ACH Direct", "Wire Transfer", "Apple Pay", "Google Pay"]

def seed_database(db: Session, count: int = 120):
    # Check if already seeded
    if db.query(Transaction).count() >= 50:
        return

    print("Seeding FraudGuard AI Enterprise Database...")

    # Seed Merchants
    merchant_records = []
    for m_name, m_cat, r_rate, status in MERCHANTS:
        m_id = f"MCH-{random.randint(1000, 9999)}"
        vol = round(random.uniform(500000, 4800000), 2)
        tx_count = random.randint(1200, 24000)
        f_rate = round(r_rate * 0.08, 2)
        cb_rate = round(f_rate * 0.35, 2)
        risk_tier = "Critical Risk" if r_rate > 70 else "High Risk" if r_rate > 50 else "Medium Risk" if r_rate > 25 else "Low Risk"
        mr = MerchantRisk(
            merchant_id=m_id,
            name=m_name,
            category=m_cat,
            risk_rating=r_rate,
            risk_tier=risk_tier,
            total_volume_usd=vol,
            total_transactions=tx_count,
            fraud_count=int(tx_count * (f_rate / 100)),
            fraud_rate_pct=f_rate,
            chargeback_rate_pct=cb_rate,
            status=status
        )
        db.add(mr)
        merchant_records.append((m_id, m_name, m_cat))

    # Seed Customers
    customer_records = []
    for c_name, c_email, c_standing in CUSTOMERS:
        c_id = f"CUST-{random.randint(10000, 99999)}"
        r_score = random.uniform(5, 30) if c_standing != "Watchlist" else random.uniform(65, 92)
        tier = "High Risk" if r_score > 60 else "Medium Risk" if r_score > 30 else "Low Risk"
        cr = CustomerRiskProfile(
            customer_id=c_id,
            name=c_name,
            email=c_email,
            risk_score=round(r_score, 1),
            risk_tier=tier,
            lifetime_spend=round(random.uniform(2000, 185000), 2),
            transaction_count=random.randint(15, 320),
            chargeback_count=random.randint(0, 4) if c_standing == "Watchlist" else 0,
            flags_count=random.randint(1, 5) if c_standing == "Watchlist" else 0,
            account_status="Under Monitoring" if c_standing == "Watchlist" else "Good Standing",
            last_active=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 72))
        )
        db.add(cr)
        customer_records.append((c_id, c_name, c_email, tier))

    db.commit()

    # Seed Transactions and Alerts
    now = datetime.datetime.utcnow()
    for i in range(count):
        hours_ago = random.uniform(0.1, 72.0)
        tx_time = now - datetime.timedelta(hours=hours_ago)
        
        m_id, m_name, m_cat = random.choice(merchant_records)
        c_id, c_name, c_email, c_tier = random.choice(customer_records)

        # Decide if this should be simulated as high-risk
        is_fraud_scenario = (random.random() < 0.16) or (c_tier == "High Risk" and random.random() < 0.6)
        
        if is_fraud_scenario:
            amount = round(random.choice([
                random.uniform(2800, 14500),
                random.uniform(4900, 24000),
                random.uniform(2.5, 4.8) # card testing
            ]), 2)
            c_origin = random.choice(COUNTRIES)
            c_dest = random.choice([c for c in COUNTRIES if c != c_origin])
            vpn = random.random() < 0.75
            velocity = random.randint(4, 9)
            is_new_dev = True
        else:
            amount = round(random.uniform(18.50, 850.00), 2)
            c_origin = random.choice(COUNTRIES[:4])
            c_dest = c_origin
            vpn = False
            velocity = random.randint(1, 2)
            is_new_dev = False

        tx_data = {
            "amount": amount,
            "merchant_category": m_cat,
            "origin_country": c_origin,
            "destination_country": c_dest,
            "vpn_detected": vpn,
            "velocity_last_hour": velocity,
            "is_new_device": is_new_dev,
            "hour_of_day": tx_time.hour
        }
        pred = ml_engine.predict_transaction(tx_data)

        # Determine transaction status based on score
        if pred["risk_score"] >= 75:
            status = random.choice(["Declined", "Under Review"])
        elif pred["risk_score"] >= 45:
            status = random.choice(["Flagged", "Under Review", "Approved"])
        else:
            status = "Approved"

        tx_id = f"TXN-2026-{100000 + i}"
        tx = Transaction(
            transaction_id=tx_id,
            timestamp=tx_time,
            amount=amount,
            currency="USD",
            payment_method=random.choice(PAYMENT_METHODS),
            channel=random.choice(["Online Web", "Mobile App", "API Gateway"]),
            customer_id=c_id,
            customer_name=c_name,
            customer_email=c_email,
            customer_risk_tier=c_tier,
            merchant_id=m_id,
            merchant_name=m_name,
            merchant_category=m_cat,
            origin_country=c_origin,
            destination_country=c_dest,
            ip_address=f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}" if not vpn else f"104.28.{random.randint(1, 254)}.{random.randint(1, 254)}",
            device_id=f"DEV-{random.randint(10000, 99999)}",
            device_type=random.choice(DEVICES),
            vpn_detected=vpn,
            risk_score=pred["risk_score"],
            fraud_probability=pred["fraud_probability"],
            fraud_label=pred["fraud_label"],
            risk_tier=pred["risk_tier"],
            status=status,
            model_name=pred["model_name"],
            decision_threshold=pred["decision_threshold"],
            risk_factors=pred["risk_factors"],
            feature_contributions=pred["feature_contributions"]
        )
        db.add(tx)

        # Create alert for high risk transactions
        if pred["risk_score"] >= 45:
            severity = "Critical" if pred["risk_score"] >= 75 else "High" if pred["risk_score"] >= 60 else "Medium"
            alert_id = f"ALT-{random.randint(2000, 9999)}"
            rule = "Rule #402: Cross-Border Velocity Surge" if velocity >= 4 else "Rule #108: Anomaly Threshold Breach" if amount > 5000 else "Rule #214: Anonymous Proxy on Checkout"
            alert = FraudAlert(
                alert_id=alert_id,
                transaction_id=tx_id,
                severity=severity,
                title=f"{severity.upper()} SEVERITY: {pred['risk_factors'][0] if pred['risk_factors'] else 'Suspicious Pattern'}",
                description=f"Transaction of ${amount:,.2f} at {m_name} triggered {rule}. Fraud probability calculated at {round(pred['fraud_probability']*100, 1)}%.",
                fraud_probability=pred["fraud_probability"],
                rule_triggered=rule,
                status=random.choice(["Open", "Open", "In Progress", "Resolved"]),
                assigned_analyst=random.choice(["Sarah Vance (CRO)", "David Zhang (Lead FinTech)", "Elena Rostova (ML Sec)"]),
                created_at=tx_time,
                resolved_at=tx_time + datetime.timedelta(minutes=random.randint(10, 180)) if random.random() < 0.25 else None
            )
            db.add(alert)

    db.commit()
    print("Database seeding successfully completed [OK]")
