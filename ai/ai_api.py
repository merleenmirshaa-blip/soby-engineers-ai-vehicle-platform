from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# ==========================================
# EXISTING MAINTENANCE MODEL
# ==========================================

MODEL_PATH = "model/maintenance_model.pkl"

model = joblib.load(MODEL_PATH)

print("========================================")
print("MAINTENANCE AI MODEL LOADED SUCCESSFULLY")
print("========================================")


# ==========================================
# IMAGE AI MODEL
# ==========================================

IMAGE_MODEL_PATH = "image_ai/model/vehicle_damage_model.pkl"

image_model = joblib.load(IMAGE_MODEL_PATH)

print("========================================")
print("IMAGE AI MODEL LOADED SUCCESSFULLY")
print("========================================")


IMAGE_SIZE = (64, 64)


# ==========================================
# HOME
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Vehicle AI API is running",
        "status": "success"
    })


# ==========================================
# EXISTING VEHICLE MAINTENANCE PREDICTION
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        vehicle = pd.DataFrame([{
            "vehicle_age": data["vehicle_age"],
            "mileage": data["mileage"],
            "fuel_type": data["fuel_type"],
            "engine_type": data["engine_type"],
            "previous_maintenance_count": data["previous_maintenance_count"],
            "days_since_last_maintenance": data["days_since_last_maintenance"],
            "mileage_since_last_maintenance": data["mileage_since_last_maintenance"],
            "average_monthly_mileage": data["average_monthly_mileage"],
            "vehicle_usage": data["vehicle_usage"]
        }])

        prediction = model.predict(vehicle)[0]

        probabilities = model.predict_proba(vehicle)[0]

        classes = model.classes_

        yes_index = list(classes).index("Yes")

        maintenance_probability = probabilities[yes_index]

        health_score = (1 - maintenance_probability) * 100

        health_score = round(health_score, 2)

        if health_score >= 80:
            health_status = "Excellent"

        elif health_score >= 60:
            health_status = "Good"

        elif health_score >= 40:
            health_status = "Needs Attention"

        else:
            health_status = "Critical"

        if health_score >= 80:

            recommendation = (
                "Vehicle condition is excellent. "
                "Continue regular maintenance and "
                "periodic vehicle monitoring."
            )

        elif health_score >= 60:

            recommendation = (
                "Vehicle condition is good. "
                "Continue scheduled servicing and "
                "monitor mileage and maintenance history."
            )

        elif health_score >= 40:

            recommendation = (
                "Vehicle needs attention. "
                "Consider scheduling maintenance soon "
                "and check important service components."
            )

        else:

            recommendation = (
                "Vehicle health is critical. "
                "Immediate maintenance inspection is "
                "recommended to avoid potential issues."
            )

        return jsonify({

            "success": True,

            "prediction": prediction,

            "maintenance_probability": round(
                maintenance_probability * 100,
                2
            ),

            "health_score": health_score,

            "health_status": health_status,

            "recommendation": recommendation

        })

    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)

        }), 400


# ==========================================
# NEW IMAGE AI PREDICTION
# ==========================================

@app.route("/image-predict", methods=["POST"])
def image_predict():

    try:

        # Check whether image was uploaded
        if "image" not in request.files:

            return jsonify({
                "success": False,
                "error": "No image uploaded"
            }), 400

        image_file = request.files["image"]

        # Check filename
        if image_file.filename == "":

            return jsonify({
                "success": False,
                "error": "No image selected"
            }), 400

        # Read image directly from uploaded file
        image_bytes = image_file.read()

        image_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image is None:

            return jsonify({
                "success": False,
                "error": "Invalid image file"
            }), 400

        # Resize
        image = cv2.resize(
            image,
            IMAGE_SIZE
        )

        # Convert to grayscale
        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # Normalize
        image = image / 255.0

        # Flatten
        features = image.flatten()

        # Convert to model input
        features = np.array([features])

        # Prediction
        prediction = image_model.predict(features)[0]

        # Probability
        probabilities = image_model.predict_proba(features)[0]

        confidence = float(max(probabilities) * 100)

        # Convert prediction
        if prediction == 0:

            condition = "Normal"

            recommendation = (
                "No obvious visible damage was detected. "
                "Continue regular vehicle maintenance "
                "and periodic inspection."
            )

        else:

            condition = "Damaged"

            recommendation = (
                "Visible vehicle damage may be present. "
                "Professional vehicle inspection is "
                "recommended."
            )

        return jsonify({

            "success": True,

            "prediction": condition,

            "confidence": round(
                confidence,
                2
            ),

            "recommendation": recommendation

        })

    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)

        }), 400


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    print("========================================")
    print("Vehicle AI API")
    print("Running on http://localhost:8000")
    print("========================================")

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )