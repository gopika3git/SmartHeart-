import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_cardiac_model(csv_path="heart.csv", target_col="target"):
    # 1. Load Dataset
    df = pd.read_csv(csv_path)
    
    # 2. Automated Feature Engineering (BMI)
    df['bmi'] = np.round(df['weight_kg'] / ((df['height_cm'] / 100) ** 2), 2)
    
    feature_cols = [
        'age', 'sex', 'height_cm', 'weight_kg', 'bmi', 'bp_sys', 
        'high_sugar', 'exercise', 'chol_high', 'family_history', 'smoking', 'alcohol'
    ]
    
    X = df[feature_cols]
    y = df[target_col]
    
    # 3. Train-Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 4. Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 5. Model Training (High-Accuracy Extra Trees Classifier)
    model = ExtraTreesClassifier(
        n_estimators=500,
        max_depth=16,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # 6. Evaluation
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    
    print("=" * 55)
    print(f" User-Friendly Cardiac Risk Model Training Completed!")
    print(f" Model Accuracy: {acc * 100:.2f}%")
    print("=" * 55)
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    # 7. Save Model & Scaler
    joblib.dump(model, "fake_profile_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    print("\nArtifacts saved: 'fake_profile_model.pkl' and 'scaler.pkl'")

if __name__ == "__main__":
    train_cardiac_model("heart.csv")