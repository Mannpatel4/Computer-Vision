# 🐾 Animal Image Classifier (90 Species)

An end-to-end Deep Learning web application that classifies images of **90 different animal species**. The model is built using **TensorFlow/Keras** with **MobileNetV2 Transfer Learning**, served via a high-performance **FastAPI** backend, and paired with a responsive **HTML, CSS, and JavaScript** frontend.

---

## ✨ Features

* **90 Animal Categories:** Capable of identifying mammals, birds, reptiles, insects, and marine life.
* **Transfer Learning Architecture:** Uses a pre-trained `MobileNetV2` backbone with custom data augmentation and classification layers for high accuracy on small datasets.
* **FastAPI Backend:** Asynchronous REST API that loads the `.keras` model once at startup and serves real-time Top-3 predictions with confidence scores.
* **Interactive Web Frontend:** Clean drag-and-drop image upload interface with live API health checking and animated probability bars.

---

## 📂 Project Structure

```text
animal-classifier/
├── main.py                              # FastAPI backend server
├── model/
│   ├── PreTrainAnimalPrediction.keras   # Trained TensorFlow/Keras model
│   └── class_names.json                 # List of the 90 animal class names
├── frontend/
│   ├── index.html                       # Main user interface
│   ├── style.css                        # Styling and layout
│   └── script.js                        # API integration and DOM logic
├── notebooks/
│   └── animal_classification.ipynb      # Model training & evaluation notebook
├── .gitignore                           # Ignored files for Git
└── README.md                            # Project documentation
```

---

## 📊 Dataset & Model Details

* **Dataset:** [Animal Image Dataset (90 Different Animals)](https://www.kaggle.com/datasets/iamsouravbanerjee/animal-image-dataset-90-different-animals) from Kaggle.
* **Total Images:** 5,400 images (60 images per class), split into 80% training and 20% validation.
* **Input Shape:** `(224, 224, 3)` RGB images.
* **Data Augmentation:** Random horizontal flip, random rotation (`0.2`), and random zoom (`0.2`) to prevent overfitting.
* **Model Backbone:** `MobileNetV2` (pre-trained on ImageNet) + `GlobalAveragePooling2D` + `Dense(512, activation='relu')` + `Dropout(0.5)` + `Dense(90, activation='softmax')`.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/animal-classifier.git
cd animal-classifier
```

### 2. Create a Virtual Environment & Install Dependencies
```bash
python -m venv venv

# Activate on Windows:
venv\Scripts\activate

# Activate on macOS/Linux:
source venv/bin/activate

# Install required packages:
pip install fastapi uvicorn tensorflow pillow numpy python-multipart
```

### 3. Add Your Model Files
Ensure your trained model and class names file are placed inside the `model/` directory:
* `model/PreTrainAnimalPrediction.keras`
* `model/class_names.json`

### 4. Run the FastAPI Backend
Start the local Uvicorn server from the project root directory:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Once running, you can view the interactive API documentation at:
* **Swagger UI:** `http://127.0.0.1:8000/docs`
* **Health Check:** `http://127.0.0.1:8000/`

### 5. Launch the Frontend
Open `frontend/index.html` directly in your web browser (or use the **Live Server** extension in VS Code). Upload any animal photo (`JPEG`, `PNG`, `BMP`, or `WEBP`) and click **Predict Animal**.

---

## 🔌 API Endpoints

### `GET /`
Checks if the server is running and confirms that the Keras model is loaded into memory.
* **Response:**
  ```json
  {
    "status": "ok",
    "model_loaded": true,
    "num_classes": 90
  }
  ```

### `POST /predict`
Accepts an uploaded image file (`multipart/form-data` under the key `file`), resizes it to `224x224`, and returns the top predicted animal along with the top 3 probabilities.
* **Response:**
  ```json
  {
    "filename": "tiger.jpg",
    "prediction": "tiger",
    "confidence": 0.9642,
    "top_3": [
      { "class": "tiger", "confidence": 0.9642 },
      { "class": "lion", "confidence": 0.0241 },
      { "class": "leopard", "confidence": 0.0085 }
    ]
  }
  ```

---

## 🛠️ Tech Stack

* **Deep Learning:** TensorFlow, Keras, NumPy, Pillow (PIL)
* **Backend API:** FastAPI, Uvicorn
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (`fetch` API)