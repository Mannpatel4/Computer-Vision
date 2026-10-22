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
│   ├── class_names.json                 # List of the 90 animal class names
│   └── animal_classification.ipynb      # Model training & evaluation notebook
├── frontend/
│   ├── index.html                       # Main user interface
│   ├── style.css                        # Styling and layout
│   └── script.js                        # API integration and DOM logic
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

## 🛠️ Tech Stack

* **Deep Learning:** TensorFlow, Keras, NumPy, Pillow (PIL)
* **Backend API:** FastAPI, Uvicorn
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (`fetch` API)