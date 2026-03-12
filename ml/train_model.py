import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

# =========================
# LOAD DATASET
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(BASE_DIR, "attack_data.csv")

if not os.path.exists(data_path):
    raise FileNotFoundError("attack_data.csv not found in ml folder")

data = pd.read_csv(data_path)

# =========================
# VALIDATE REQUIRED COLUMNS
# =========================
required_columns = {"attack_type", "severity"}
if not required_columns.issubset(data.columns):
    raise ValueError(
        f"CSV must contain columns: {required_columns}"
    )

# =========================
# ENCODE TEXT LABELS
# =========================
attack_encoder = LabelEncoder()
severity_encoder = LabelEncoder()

data["attack_type_encoded"] = attack_encoder.fit_transform(data["attack_type"])
data["severity_encoded"] = severity_encoder.fit_transform(data["severity"])

# =========================
# FEATURES & TARGET
# =========================
X = data[["attack_type_encoded"]]
y = data["severity_encoded"]

# =========================
# TRAIN MODEL
# =========================
model = DecisionTreeClassifier(
    random_state=42
)
model.fit(X, y)

# =========================
# SAVE MODEL & ENCODERS
# =========================
joblib.dump(model, os.path.join(BASE_DIR, "attack_severity_model.pkl"))
joblib.dump(attack_encoder, os.path.join(BASE_DIR, "attack_encoder.pkl"))
joblib.dump(severity_encoder, os.path.join(BASE_DIR, "severity_encoder.pkl"))

print("✅ ML model and encoders trained & saved successfully")
print("Known attack types:", list(attack_encoder.classes_))
print("Known severity levels:", list(severity_encoder.classes_))
