// Global variables
let selectedFile = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const predictBtn = document.getElementById('predictBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Click to upload (only when no file is selected)
    uploadArea.addEventListener('click', () => {
        if (!selectedFile) {
            fileInput.click();
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    console.log('File selected:', file ? file.name : 'No file');
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
    }
    
    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB.');
        return;
    }
    
    // Store the original file for prediction
    selectedFile = file;
    console.log('File stored for prediction:', selectedFile.name);
    
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        uploadArea.style.display = 'none';
        predictBtn.disabled = false;
        
        // Add animation
        imagePreview.classList.add('fade-in');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedFile = null;
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadArea.style.display = 'block';
    predictBtn.disabled = true;
    resultsSection.style.display = 'none';
}

async function predictDisease() {
    if (!selectedFile) {
        showError('Please select an image first.');
        return;
    }
    
    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        console.log('Sending file:', selectedFile.name, 'Size:', selectedFile.size);
        
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result);
        } else {
            showError(result.error || 'Prediction failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
    }
}

function displayResults(result) {
    const { prediction, confidence } = result;
    
    // Display the uploaded image in results (notebook style)
    const resultImage = document.getElementById('resultImage');
    resultImage.src = previewImg.src; // Use the same image from preview
    
    // Update prediction badge on image
    document.getElementById('predictedDiseaseBadge').textContent = formatDiseaseName(prediction);
    document.getElementById('confidenceBadge').textContent = `${confidence.toFixed(2)}%`;
    
    // Update main prediction text (notebook format)
    document.getElementById('predictedDisease').textContent = `'${formatDiseaseName(prediction)}'`;
    document.getElementById('confidenceText').textContent = `${confidence.toFixed(2)}%`;
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('slide-up');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function formatDiseaseName(disease) {
    return disease
        .replace('Potato___', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function getDiseaseIcon(disease) {
    if (disease.includes('Early_blight')) {
        return '<i class="fas fa-exclamation-triangle"></i>';
    } else if (disease.includes('Late_blight')) {
        return '<i class="fas fa-skull-crossbones"></i>';
    } else if (disease.includes('healthy')) {
        return '<i class="fas fa-heart"></i>';
    }
    return '<i class="fas fa-leaf"></i>';
}

function getDiseaseColor(disease) {
    if (disease.includes('Early_blight')) {
        return '#f59e0b'; // Orange
    } else if (disease.includes('Late_blight')) {
        return '#ef4444'; // Red
    } else if (disease.includes('healthy')) {
        return '#10b981'; // Green
    }
    return '#6b7280'; // Gray
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Add CSS for error notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Health check on page load
async function checkAPIHealth() {
    try {
        const response = await fetch('/health');
        const result = await response.json();
        
        if (!result.status === 'healthy') {
            console.warn('API health check failed');
        }
    } catch (error) {
        console.warn('API health check failed:', error);
    }
}

// Run health check when page loads
document.addEventListener('DOMContentLoaded', checkAPIHealth);
