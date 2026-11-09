import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# ==========================================
# 1. Load Dataset
# ==========================================

dataset_path = "dataset/vehicle_maintenance.csv"

data = pd.read_csv(dataset_path)

print("========================================")
print("Vehicle Maintenance AI Training")
print("========================================")

print("\nDataset shape:")
print(data.shape)

print("\nDataset columns:")
print(data.columns.tolist())


# ==========================================
# 2. Separate Features and Target
# ==========================================

X = data.drop("maintenance_required", axis=1)

y = data["maintenance_required"]


# ==========================================
# 3. Identify Columns
# ==========================================

categorical_features = [
    "fuel_type",
    "engine_type",
    "vehicle_usage"
]

numerical_features = [
    "vehicle_age",
    "mileage",
    "previous_maintenance_count",
    "days_since_last_maintenance",
    "mileage_since_last_maintenance",
    "average_monthly_mileage"
]


# ==========================================
# 4. Preprocessing
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ==========================================
# 5. Random Forest Model
# ==========================================

random_forest = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    random_state=42,
    class_weight="balanced"
)


# ==========================================
# 6. Create Pipeline
# ==========================================

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", random_forest)
    ]
)


# ==========================================
# 7. Split Dataset
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))


# ==========================================
# 8. Train Model
# ==========================================

print("\nTraining Random Forest model...")

model.fit(X_train, y_train)

print("Training completed successfully!")


# ==========================================
# 9. Make Predictions
# ==========================================

y_pred = model.predict(X_test)


# ==========================================
# 10. Evaluate Model
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\n========================================")
print("MODEL PERFORMANCE")
print("========================================")

print(f"\nAccuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ==========================================
# 11. Save Model
# ==========================================

os.makedirs("model", exist_ok=True)

model_path = "model/maintenance_model.pkl"

joblib.dump(model, model_path)

print("\n========================================")
print("MODEL SAVED")
print("========================================")

print(f"Model saved to: {model_path}")