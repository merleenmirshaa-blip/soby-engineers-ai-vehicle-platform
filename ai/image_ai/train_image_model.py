import os
import cv2
import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_DIR = os.path.join(BASE_DIR, "model")

MODEL_PATH = os.path.join(MODEL_DIR, "vehicle_damage_model.pkl")


# ==========================================
# IMAGE SETTINGS
# ==========================================

IMAGE_SIZE = (64, 64)


# ==========================================
# LOAD IMAGES
# ==========================================

X = []
y = []

classes = {
    "normal": 0,
    "damaged": 1
}


for class_name, label in classes.items():

    folder_path = os.path.join(DATASET_DIR, class_name)

    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        continue

    for filename in os.listdir(folder_path):

        file_path = os.path.join(folder_path, filename)

        image = cv2.imread(file_path)

        if image is None:
            print(f"Could not read: {filename}")
            continue

        # Resize image
        image = cv2.resize(image, IMAGE_SIZE)

        # Convert to grayscale
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Normalize pixel values
        image = image / 255.0

        # Flatten image
        features = image.flatten()

        X.append(features)
        y.append(label)

        print(f"Loaded: {class_name}/{filename}")


# ==========================================
# CHECK DATA
# ==========================================

X = np.array(X)
y = np.array(y)

print("\n===================================")
print("IMAGE DATASET INFORMATION")
print("===================================")

print(f"Total images : {len(X)}")
print(f"Normal       : {np.sum(y == 0)}")
print(f"Damaged      : {np.sum(y == 1)}")


if len(X) < 2:

    print("\nNot enough images for training.")
    exit()


# ==========================================
# TRAIN MODEL
# ==========================================

print("\nTraining image AI model...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


# ==========================================
# SAVE MODEL
# ==========================================

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, MODEL_PATH)


print("\n===================================")
print("MODEL TRAINING COMPLETED")
print("===================================")

print(f"Model saved at:")
print(MODEL_PATH)