from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="Heart Disease & Profile Prediction API",
    description="API for serving real-time ML predictions"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from React local server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load saved model and scaler
try:
    model = joblib.load("fake_profile_model.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    model = None
    scaler = None
    print(f"Warning: Model files failed to load: {e}")

class PredictionInput(BaseModel):
    features: list[float]

@app.get("/")
def home():
    return {"status": "API is running successfully"}

@app.post("/predict")
def predict(data: PredictionInput):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model or Scaler not loaded properly.")
    
    try:
        input_array = np.array(data.features).reshape(1, -1)
        scaled_features = scaler.transform(input_array)
        prediction = model.predict(scaled_features)
        
        return {
            "prediction": int(prediction[0]),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))