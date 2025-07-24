from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import uvicorn
import numpy as np
import requests

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_URL = "http://localhost:8501/v1/models/potato_disease_model:predict"
CLASS_NAMES = ['Potato Early Blight', 'Potato Late Blight', 'Potato Healthy']

def read_file_as_image(file_data) -> np.ndarray:
    """Convert uploaded file to numpy array"""
    image = np.array(Image.open(BytesIO(file_data)))
    return image.astype(np.float32)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict disease class from uploaded image"""
    try:
        # Read and preprocess image
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)
        
        # Prepare payload for TensorFlow Serving
        payload = {
            "instances": img_batch.tolist()
        }
        
        # Make prediction request
        response = requests.post(MODEL_URL, json=payload)
        response.raise_for_status()  # Raise exception for bad status codes
        
        result = response.json()
        print("📥 Raw response from model:", result)
        
        # Extract predictions
        predictions = result["predictions"][0]
        predicted_class = CLASS_NAMES[np.argmax(predictions)]
        confidence = round(float(np.max(predictions)) * 100, 2)
        
        return {
            'class': predicted_class, 
            'confidence': confidence
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)