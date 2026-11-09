import pandas as pd
import joblib


# ==========================================
# Load trained model
# ==========================================

print("========================================")
print("AI VEHICLE MAINTENANCE PREDICTION")
print("========================================")

model_path = "model/maintenance_model.pkl"

print("\nLoading trained model...")

model = joblib.load(model_path)

print("Model loaded successfully!")


# ==========================================
# Get Vehicle Information
# ==========================================

print("\n========================================")
print("ENTER VEHICLE INFORMATION")
print("========================================")


vehicle_age = int(input("Enter vehicle age (years): "))

mileage = int(input("Enter current mileage (km): "))

fuel_type = input(
    "Enter fuel type (Petrol/Diesel/Hybrid): "
).strip().title()

engine_type = input(
    "Enter engine type (Small/Medium/Large): "
).strip().title()

previous_maintenance_count = int(
    input("Enter previous maintenance count: ")
)

days_since_last_maintenance = int(
    input("Enter days since last maintenance: ")
)

mileage_since_last_maintenance = int(
    input("Enter mileage since last maintenance (km): ")
)

average_monthly_mileage = int(
    input("Enter average monthly mileage (km): ")
)

vehicle_usage = input(
    "Enter vehicle usage (Low/Medium/High): "
).strip().title()


# ==========================================
# Create DataFrame
# ==========================================

vehicle = pd.DataFrame([{
    "vehicle_age": vehicle_age,
    "mileage": mileage,
    "fuel_type": fuel_type,
    "engine_type": engine_type,
    "previous_maintenance_count":
        previous_maintenance_count,
    "days_since_last_maintenance":
        days_since_last_maintenance,
    "mileage_since_last_maintenance":
        mileage_since_last_maintenance,
    "average_monthly_mileage":
        average_monthly_mileage,
    "vehicle_usage": vehicle_usage
}])


# ==========================================
# AI Prediction
# ==========================================

prediction = model.predict(vehicle)[0]

probabilities = model.predict_proba(vehicle)[0]

classes = model.classes_

yes_index = list(classes).index("Yes")

maintenance_probability = probabilities[yes_index]


# ==========================================
# Vehicle Health Score
# ==========================================

health_score = (1 - maintenance_probability) * 100

health_score = round(health_score, 2)


# ==========================================
# Health Status
# ==========================================

if health_score >= 80:

    health_status = "Excellent"

elif health_score >= 60:

    health_status = "Good"

elif health_score >= 40:

    health_status = "Needs Attention"

else:

    health_status = "Critical"


# ==========================================
# Recommendation
# ==========================================

if prediction == "Yes":

    recommendation = (
        "Maintenance is recommended. "
        "Please schedule a vehicle inspection "
        "and maintenance service."
    )

else:

    recommendation = (
        "No immediate maintenance is predicted. "
        "Continue regular vehicle monitoring."
    )


# ==========================================
# Display Result
# ==========================================

print("\n========================================")
print("AI PREDICTION RESULT")
print("========================================")

print(
    f"\nMaintenance Required: {prediction}"
)

print(
    f"Maintenance Probability: "
    f"{maintenance_probability * 100:.2f}%"
)

print(
    f"Vehicle Health Score: "
    f"{health_score}/100"
)

print(
    f"Vehicle Health Status: "
    f"{health_status}"
)

print("\n========================================")
print("MAINTENANCE RECOMMENDATION")
print("========================================")

print(recommendation)

print("\n========================================")
print("Prediction completed successfully!")
print("========================================")