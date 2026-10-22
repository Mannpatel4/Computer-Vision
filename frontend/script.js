// Change this if your FastAPI runs on a different port
const API_URL = "https://computer-vision-2hmd.onrender.com";

// DOM Elements
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const uploadPrompt = document.getElementById("upload-prompt");
const imagePreview = document.getElementById("image-preview");
const fileInfo = document.getElementById("file-info");
const fileNameSpan = document.getElementById("file-name");
const clearBtn = document.getElementById("clear-btn");
const predictBtn = document.getElementById("predict-btn");
const errorBox = document.getElementById("error-box");

const emptyResult = document.getElementById("empty-result");
const loadingBox = document.getElementById("loading");
const resultBox = document.getElementById("result-box");
const topClass = document.getElementById("top-class");
const topConf = document.getElementById("top-conf");
const top3List = document.getElementById("top3-list");

let selectedFile = null;

// 1. Check FastAPI Health on Startup (GET /)
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();

        if (response.ok && data.model_loaded) {
            statusDot.className = "dot online";
            statusText.textContent = `API Online (${data.num_classes} Classes)`;
        } else {
            statusDot.className = "dot offline";
            statusText.textContent = "API Online (Model Not Loaded)";
        }
    } catch (error) {
        statusDot.className = "dot offline";
        statusText.textContent = "FastAPI Offline (Run uvicorn)";
    }
}

// 2. Handle File Selection & Preview
function handleFile(file) {
    hideError();

    const validTypes = ["image/jpeg", "image/png", "image/bmp", "image/webp"];
    if (!validTypes.includes(file.type)) {
        showError("Invalid file type. Please upload a JPEG, PNG, BMP, or WEBP image.");
        return;
    }

    selectedFile = file;
    fileNameSpan.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("hidden");
        uploadPrompt.classList.add("hidden");
        fileInfo.classList.remove("hidden");
        predictBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// 3. Reset / Remove Image
function clearSelection() {
    selectedFile = null;
    fileInput.value = "";
    imagePreview.src = "";
    imagePreview.classList.add("hidden");
    uploadPrompt.classList.remove("hidden");
    fileInfo.classList.add("hidden");
    predictBtn.disabled = true;

    resultBox.classList.add("hidden");
    emptyResult.classList.remove("hidden");
    hideError();
}

// 4. Send Image to FastAPI (POST /predict)
async function predictAnimal() {
    if (!selectedFile) return;

    hideError();
    emptyResult.classList.add("hidden");
    resultBox.classList.add("hidden");
    loadingBox.classList.remove("hidden");
    predictBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", selectedFile); // Matches FastAPI: file: UploadFile = File(...)

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Prediction failed");
        }

        renderPredictions(data);
    } catch (error) {
        showError(error.message || "Could not connect to FastAPI server.");
        emptyResult.classList.remove("hidden");
    } finally {
        loadingBox.classList.add("hidden");
        predictBtn.disabled = false;
    }
}

// 5. Render Top Prediction and Top-3 Progress Bars
function renderPredictions(data) {
    const mainPercent = (data.confidence * 100).toFixed(2);
    topClass.textContent = data.prediction;
    topConf.textContent = `${mainPercent}%`;

    top3List.innerHTML = "";

    data.top_3.forEach((item, index) => {
        const pct = (item.confidence * 100).toFixed(2);

        const row = document.createElement("div");
        row.className = "prob-item";
        row.innerHTML = `
            <div class="prob-header">
                <span>#${index + 1} ${item.class}</span>
                <span>${pct}%</span>
            </div>
            <div class="prob-bar-bg">
                <div class="prob-bar-fill" style="width: ${pct}%"></div>
            </div>
        `;
        top3List.appendChild(row);
    });

    resultBox.classList.remove("hidden");
}

// Error Helpers
function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
}

function hideError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

// Event Listeners
dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

clearBtn.addEventListener("click", clearSelection);
predictBtn.addEventListener("click", predictAnimal);

// Run health check when page loads
checkServerHealth();