import pandas as pd
import numpy as np
import os

# -----------------------------
# Settings
# -----------------------------
NUM_RECORDS = 1000

np.random.seed(42)

# -----------------------------
# Generate vehicle data
# -----------------------------
vehicle_age = np.random.randint(1, 16, NUM_RECORDS)

mileage = np.random.randint(
    5000,
    200000,
    NUM_RECORDS
)

fuel_type = np.random.choice(
    ["Petrol", "Diesel", "Hybrid"],
    NUM_RECORDS,
    p=[0.50, 0.35, 0.15]
)

engine_type = np.random.choice(
    ["Small", "Medium", "Large"],
    NUM_RECORDS,
    p=[0.35, 0.45, 0.20]
)

previous_maintenance_count = np.random.randint(
    0,
    12,
    NUM_RECORDS
)

days_since_last_maintenance = np.random.randint(
    10,
    500,
    NUM_RECORDS
)

mileage_since_last_maintenance = np.random.randint(
    500,
    25000,
    NUM_RECORDS
)

average_monthly_mileage = np.random.randint(
    500,
    5000,
    NUM_RECORDS
)

vehicle_usage = np.random.choice(
    ["Low", "Medium", "High"],
    NUM_RECORDS,
    p=[0.30, 0.45, 0.25]
)

# -----------------------------
# Calculate maintenance risk
# -----------------------------
risk_score = (
    vehicle_age * 1.8
    + (mileage / 10000) * 1.5
    + (days_since_last_maintenance / 30) * 1.5
    + (mileage_since_last_maintenance / 5000) * 1.8
    + (average_monthly_mileage / 1000) * 1.0
)

# Usage impact
risk_score += np.where(vehicle_usage == "High", 4, 0)
risk_score += np.where(vehicle_usage == "Medium", 2, 0)

# Maintenance history impact
risk_score -= previous_maintenance_count * 0.4

# Add natural variation
risk_score += np.random.normal(0, 4, NUM_RECORDS)

# -----------------------------
# Create balanced target
# -----------------------------
threshold = np.percentile(risk_score, 55)

maintenance_required = np.where(
    risk_score >= threshold,
    "Yes",
    "No"
)

# -----------------------------
# Create DataFrame
# -----------------------------
data = pd.DataFrame({
    "vehicle_age": vehicle_age,
    "mileage": mileage,
    "fuel_type": fuel_type,
    "engine_type": engine_type,
    "previous_maintenance_count": previous_maintenance_count,
    "days_since_last_maintenance": days_since_last_maintenance,
    "mileage_since_last_maintenance": mileage_since_last_maintenance,
    "average_monthly_mileage": average_monthly_mileage,
    "vehicle_usage": vehicle_usage,
    "maintenance_required": maintenance_required
})

# -----------------------------
# Save dataset
# -----------------------------
os.makedirs("dataset", exist_ok=True)

file_path = "dataset/vehicle_maintenance.csv"

data.to_csv(
    file_path,
    index=False
)

# -----------------------------
# Display results
# -----------------------------
print("Records created:", len(data))
print("Saved to:", file_path)

print("\nMaintenance distribution:")
print(data["maintenance_required"].value_counts())

print("\nFirst 5 records:")
print(data.head())