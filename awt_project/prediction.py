import joblib
import numpy as np

class CardiacRiskPredictor:
    def __init__(self, model_path="fake_profile_model.pkl", scaler_path="scaler.pkl"):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.feature_names = [
            'age', 'sex', 'height_cm', 'weight_kg', 'bmi', 'bp_sys', 
            'high_sugar', 'exercise', 'chol_high', 'family_history', 'smoking', 'alcohol'
        ]

    def predict(self, user_inputs):
        """
        Accepts dictionary or list of raw inputs.
        Automatically calculates BMI = weight_kg / (height_m ^ 2)
        """
        if isinstance(user_inputs, dict):
            age = user_inputs['age']
            sex = user_inputs['sex']
            height_cm = user_inputs['height_cm']
            weight_kg = user_inputs['weight_kg']
            bp_sys = user_inputs['bp_sys']
            high_sugar = user_inputs['high_sugar']
            exercise = user_inputs['exercise']
            chol_high = user_inputs['chol_high']
            family_history = user_inputs['family_history']
            smoking = user_inputs['smoking']
            alcohol = user_inputs['alcohol']
        else:
            # list input order: age, sex, height_cm, weight_kg, bp_sys, high_sugar, exercise, chol_high, family_history, smoking, alcohol
            age, sex, height_cm, weight_kg, bp_sys, high_sugar, exercise, chol_high, family_history, smoking, alcohol = user_inputs

        # Calculate BMI automatically
        bmi = round(weight_kg / ((height_cm / 100) ** 2), 2)

        # Form feature vector in exact order
        feature_vector = np.array([[
            age, sex, height_cm, weight_kg, bmi, bp_sys, 
            high_sugar, exercise, chol_high, family_history, smoking, alcohol
        ]])

        scaled_vector = self.scaler.transform(feature_vector)
        prediction = self.model.predict(scaled_vector)[0]
        probability = self.model.predict_proba(scaled_vector)[0][1]

        return {
            "bmi": bmi,
            "risk_prediction": int(prediction),
            "risk_probability_pct": round(float(probability) * 100, 2),
            "status": "High Cardiac Risk Detected" if prediction == 1 else "Low Cardiac Risk (Normal)"
        }

if __name__ == "__main__":
    predictor = CardiacRiskPredictor()
    # Sample Test: Age 55, Male, 172cm, 85kg, BP 135, High Sugar (Yes), Exercise (No), High Chol (Yes), Family Hist (Yes), Smoking (Yes), Alcohol (No)
    sample = [55, 1, 172, 85, 135, 1, 0, 1, 1, 1, 0]
    res = predictor.predict(sample)
    print("Test Sample Prediction:", res)