from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection, create_tables
import joblib
import os
import hashlib
import json

from web3 import Web3
from dotenv import load_dotenv

LAST_TX_HASH = None


# =======================
# APP SETUP
# =======================
app = Flask(__name__)
CORS(app)  # ✅ IMPORTANT: allow frontend access

# Ensure database and tables exist
create_tables()

# =======================
# LOAD ML MODEL & ENCODERS
# =======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, "..", "ml")

model = None
attack_encoder = None
severity_encoder = None

try:
    model_path = os.path.join(ML_DIR, "attack_severity_model.pkl")
    attack_enc_path = os.path.join(ML_DIR, "attack_encoder.pkl")
    sev_enc_path = os.path.join(ML_DIR, "severity_encoder.pkl")

    if os.path.exists(model_path):
        model = joblib.load(model_path)
    if os.path.exists(attack_enc_path):
        attack_encoder = joblib.load(attack_enc_path)
    if os.path.exists(sev_enc_path):
        severity_encoder = joblib.load(sev_enc_path)
    print("[SUCCESS] ML Model and encoders loaded successfully.")
except Exception as ml_err:
    print(f"[WARNING] ML model loading fallback: {ml_err}")


# =======================
# BLOCKCHAIN SETUP
# =======================
import sys
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load from backend or project root
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))
load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

w3 = None
account = None
contract = None
blockchain_enabled = False

if not INFURA_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    print("[WARNING] Missing INFURA_URL, PRIVATE_KEY, or CONTRACT_ADDRESS in .env. Running in offline mode.")
else:
    try:
        w3 = Web3(Web3.HTTPProvider(INFURA_URL, request_kwargs={"timeout": 10}))
        if w3.is_connected():
            account = w3.eth.account.from_key(PRIVATE_KEY)
            w3.eth.default_account = account.address

            ABI_PATH = os.path.join(BASE_DIR, "..", "blockchain", "FirewallLogsABI.json")
            with open(ABI_PATH, "r") as f:
                contract_abi = json.load(f)

            contract = w3.eth.contract(
                address=w3.to_checksum_address(CONTRACT_ADDRESS),
                abi=contract_abi
            )
            blockchain_enabled = True
            print("[SUCCESS] Blockchain connected successfully to Sepolia Testnet.")
        else:
            print("[WARNING] Web3 connection failed to respond. Blockchain logging disabled.")
    except Exception as ex:
        print(f"[WARNING] Blockchain initialization failed: {ex}. Blockchain logging disabled.")


# =======================
# BLOCKCHAIN LOGGER
# =======================
def log_to_blockchain(event_type, event_data):
    global LAST_TX_HASH

    if not blockchain_enabled or not contract or not account:
        return None

    try:
        event_hash = hashlib.sha256(event_data.encode()).hexdigest()
        nonce = w3.eth.get_transaction_count(account.address, "pending")


        base_tx = {
            "chainId": w3.eth.chain_id,
            "from": account.address,
            "nonce": nonce,
        }

        try:
            estimated_gas = contract.functions.addLog(
                event_type,
                event_hash
            ).estimate_gas({"from": account.address})
            base_tx["gas"] = int(estimated_gas * 1.2)
        except Exception:
            base_tx["gas"] = 300000

        latest_block = w3.eth.get_block("latest")
        base_fee = latest_block.get("baseFeePerGas") if isinstance(latest_block, dict) else None
        if base_fee is not None:
            max_priority_fee = w3.to_wei(2, "gwei")
            base_tx["maxPriorityFeePerGas"] = max_priority_fee
            base_tx["maxFeePerGas"] = int(base_fee * 2 + max_priority_fee)
        else:
            base_tx["gasPrice"] = w3.eth.gas_price

        txn = contract.functions.addLog(
            event_type,
            event_hash
        ).build_transaction(base_tx)

        signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        tx_hash_hex = tx_hash.hex()
        if not tx_hash_hex.startswith("0x"):
            tx_hash_hex = "0x" + tx_hash_hex

        LAST_TX_HASH = tx_hash_hex
        return tx_hash_hex


    except Exception as e:
        print("[WARNING] Blockchain log failed:", e)
        return None


# =======================
# ROUTES
# =======================
@app.route("/")
@app.route("/api")
@app.route("/api/")
def home():
    return jsonify({
        "status": "online",
        "service": "AI FireGuard Intelligent Firewall API",
        "blockchain_connected": blockchain_enabled,
        "ml_engine_ready": model is not None
    })

@app.route("/status")
@app.route("/api/status")
def firewall_status():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT strength FROM firewall WHERE id = 1")
    strength = cursor.fetchone()[0]
    conn.close()
    return jsonify({"firewall_strength": strength})

@app.route("/attack/<attack_type>")
@app.route("/api/attack/<attack_type>")
def simulate_attack(attack_type):

    # ===== ML PREDICTION (SAFE) =====
    predicted_severity = None
    try:
        if (
            model is not None 
            and attack_encoder is not None 
            and severity_encoder is not None 
            and attack_type in attack_encoder.classes_
        ):
            attack_encoded = attack_encoder.transform([attack_type])[0]
            predicted_severity_encoded = model.predict([[attack_encoded]])[0]
            predicted_severity = severity_encoder.inverse_transform(
                [predicted_severity_encoded]
            )[0]
    except Exception as e:
        print(f"[WARNING] ML inference fallback: {e}")

    if not predicted_severity:
        fallback_rules = {
            "sql_injection": "high",
            "sqlinjection": "high",
            "ransomware": "high",
            "ddos": "medium",
            "bruteforce": "medium",
            "xss": "low",
            "port_scan": "low",
            "normal": "low",
        }
        predicted_severity = fallback_rules.get(attack_type, "high")

    severity_damage_map = {
        "low": 5,
        "medium": 10,
        "high": 20
    }

    damage = severity_damage_map.get(predicted_severity, 10)

    # ===== FIREWALL UPDATE =====
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT strength FROM firewall WHERE id = 1")
    row = cursor.fetchone()
    strength = row[0] if row else 100
    new_strength = max(0, strength - damage)

    cursor.execute(
        "UPDATE firewall SET strength = ? WHERE id = 1",
        (new_strength,)
    )

    cursor.execute(
        "INSERT INTO attacks (attack_type, severity, damage) VALUES (?, ?, ?)",
        (attack_type, predicted_severity, damage)
    )

    conn.commit()
    conn.close()

    # ===== BLOCKCHAIN LOG =====
    tx_hash = log_to_blockchain(
        "ATTACK",
        f"{attack_type}-{predicted_severity}-{damage}"
    )

    return jsonify({
        "attack": attack_type,
        "predicted_severity": predicted_severity,
        "damage": damage,
        "new_firewall_strength": new_strength,
        "blockchain_tx": tx_hash
    })

@app.route("/add_firewall", methods=["POST"])
@app.route("/api/add_firewall", methods=["POST"])
def add_firewall():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE firewall SET strength = 100 WHERE id = 1")
    cursor.execute(
        "INSERT INTO firewall_actions (action) VALUES (?)",
        ("Manual firewall added by admin",)
    )

    conn.commit()
    conn.close()

    tx_hash = log_to_blockchain(
        "FIREWALL_REINFORCED",
        "Admin manually reinforced firewall"
    )

    return jsonify({
        "message": "Firewall successfully reinforced",
        "firewall_strength": 100,
        "blockchain_tx": tx_hash
    })

@app.route("/attacks")
@app.route("/api/attacks")
def get_attacks():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, attack_type, severity, damage, timestamp
        FROM attacks
        ORDER BY timestamp DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "attack_type": r[1],
            "severity": r[2],
            "damage": r[3],
            "timestamp": r[4]
        }
        for r in rows
    ])


# =======================
# RUN SERVER
# =======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
