from contextlib import asynccontextmanager
from pathlib import Path
import io
import json
import os
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model as keras_load_model
 
BASE_DIR = Path(__file__).parent
MODEL_FILE = BASE_DIR / "model" / "PreTrainAnimalPrediction.keras"
CLASSES_FILE = BASE_DIR / "model" / "class_names.json"
IMG_SIZE = 224

data_dir = BASE_DIR / "data" / "animals"
 
if CLASSES_FILE.exists():
    with open(CLASSES_FILE) as f:
        CLASSES = json.load(f)
elif data_dir.exists():
    CLASSES = sorted(
        d for d in os.listdir(data_dir) if (data_dir / d).is_dir()
    )
else:
    raise RuntimeError(
        f"Class names not found. Provide {CLASSES_FILE} or the folder {data_dir}"
    )

# -----------------------------
# Load model once at startup
# -----------------------------
model = None
 
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    if not MODEL_FILE.exists():
        raise RuntimeError(f"Model file not found: {MODEL_FILE}")
    model = keras_load_model(MODEL_FILE)
    print(f"Model loaded: {MODEL_FILE.name} ({len(CLASSES)} classes)")
    yield
 
 
app = FastAPI(
    title="Animal Image Classifier",
    description="MobileNetV2 transfer learning on the 90 Animals dataset.",
    version="1.0.0",
    lifespan=lifespan,
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def preprocess(image: Image.Image) -> np.ndarray:
    image = image.resize((IMG_SIZE, IMG_SIZE))
    arr = np.asarray(image, dtype=np.float32)  # (224, 224, 3)
    return np.expand_dims(arr, axis=0)         # (1, 224, 224, 3)


# -----------------------------
# Endpoints
# -----------------------------
@app.get("/")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "num_classes": len(CLASSES),
    }
 
 
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
 

    if file.content_type not in ["image/jpeg", "image/png", "image/bmp", "image/webp"]:
        raise HTTPException(status_code=400, detail="Upload a JPEG/PNG/BMP/WEBP image")
 
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")
 

    batch = preprocess(image)
    probs = model.predict(batch, verbose=0)[0]  
 
    top_idx = np.argsort(probs)[::-1][: min(3, len(CLASSES))]
 
    results = [
        {"class": CLASSES[i], "confidence": round(float(probs[i]), 4)}
        for i in top_idx
    ]
 
    return {
        "filename": file.filename,
        "prediction": results[0]["class"],
        "confidence": results[0]["confidence"],
        "top_3": results,
    }