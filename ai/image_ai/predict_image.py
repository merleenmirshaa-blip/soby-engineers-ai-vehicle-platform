import os
import cv2
import joblib
import numpy as np


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "vehicle_damage_model.pkl"
)

IMAGE_PATH = os.path.join(
    BASE_DIR,
    "test_vehicle.jpg"
)


# ==========================================
# IMAGE SETTINGS
# ==========================================

IMAGE_SIZE = (64, 64)


# ==========================================
# LOAD MODEL
# ==========================================

if not os.path.exists(MODEL_PATH):

    print("Model file not found!")
    print(MODEL_PATH)
    exit()


model = joblib.load(MODEL_PATH)


# ==========================================
# LOAD IMAGE
# ==========================================

image = cv2.imread(IMAGE_PATH)

if image is None:

    print("Test image not found!")
    print(IMAGE_PATH)
    exit()


# ==========================================
# PREPARE IMAGE
# ==========================================

image = cv2.resize(image, IMAGE_SIZE)

image = cv2.cvtColor(
    image,
    cv2.COLOR_BGR2GRAY
)

image = image / 255.0

features = image.flatten()

features = np.array([features])


# ==========================================
# PREDICTION
# ==========================================

prediction = model.predict(features)[0]

probabilities = model.predict_proba(features)[0]

confidence = max(probabilities) * 100


# ==========================================
# RESULT
# ==========================================

if prediction == 0:

    condition = "Normal"

    recommendation = (
        "No obvious visible damage detected. "
        "Continue regular vehicle maintenance."
    )

else:

    condition = "Damaged"

    recommendation = (
        "Visible damage may be present. "
        "Professional vehicle inspection is recommended."
    )


print("\n===================================")
print("AI VEHICLE IMAGE ANALYSIS")
print("===================================")

print(f"Prediction      : {condition}")
print(f"Confidence      : {confidence:.2f}%")
print(f"Recommendation  : {recommendation}")

print("===================================")