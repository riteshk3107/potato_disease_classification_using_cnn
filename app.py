from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load the trained model
model_path = 'trainning/potato_disease_model.keras'
model = tf.keras.models.load_model(model_path)

# Class names - must match the order from dataset.class_names
class_names = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

# Image preprocessing parameters
IMAGE_SIZE = 256

def preprocess_image(image_file):
    """Preprocess image for model prediction - matches notebook preprocessing exactly"""
    # Save the uploaded file temporarily to use with tf.keras.preprocessing.image.load_img
    temp_path = '/tmp/temp_image.png'
    
    # Reset file pointer to beginning
    image_file.seek(0)
    image_file.save(temp_path)
    
    # Use the exact same preprocessing as in your notebook
    img = image.load_img(temp_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img_array = image.img_to_array(img)
    img_batch = np.expand_dims(img_array, axis=0)
    
    # Clean up temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
    
    return img_batch

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and prediction"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            return jsonify({'error': 'Invalid file type. Please upload an image file.'}), 400
        
        # Preprocess image using the exact same method as notebook
        processed_image = preprocess_image(file)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        confidence = float(np.max(predictions[0]) * 100)
        
        # Get all class probabilities
        all_predictions = {}
        for i, class_name in enumerate(class_names):
            all_predictions[class_name] = float(predictions[0][i] * 100)
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': round(confidence, 2),
            'all_predictions': all_predictions,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    print("Starting Potato Disease Classification API...")
    print("Model loaded successfully!")
    print("Available classes:", class_names)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
