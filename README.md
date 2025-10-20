# Potato Disease Classification Web App

A modern web application for classifying potato plant diseases using deep learning. The app can identify three types of potato conditions:

- **Early Blight** - A fungal disease that affects potato leaves
- **Late Blight** - A serious fungal disease that can destroy entire crops
- **Healthy** - Normal, healthy potato plants

## Features

- 🖼️ **Image Upload**: Drag and drop or click to upload potato leaf images
- 🤖 **AI Classification**: Powered by a trained CNN model with 96% accuracy
- 📊 **Detailed Results**: Shows confidence scores for all disease categories
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚡ **Real-time Analysis**: Fast prediction with loading indicators
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Screenshots

The app features a clean, modern interface with:
- Gradient background with glassmorphism effects
- Drag-and-drop file upload area
- Real-time image preview
- Animated confidence bars
- Detailed analysis results
- Mobile-responsive design

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd /home/ritesh/Documents/cnn1/potato_disease_classification_using_cnn
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify the model file exists:**
   ```bash
   ls trainning/potato_disease_model.keras
   ```
   The model file should be present in the `trainning/` directory.

## Usage

### Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your web browser and navigate to:**
   ```
   http://localhost:5000
   ```

3. **Upload a potato leaf image:**
   - Drag and drop an image onto the upload area, or
   - Click "Choose File" to browse and select an image

4. **Click "Analyze Disease" to get predictions**

5. **View the results:**
   - Main prediction with confidence percentage
   - Detailed breakdown of all disease probabilities
   - Visual confidence indicators

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)

### Image Requirements

- **File size**: Maximum 16MB
- **Quality**: Clear, well-lit photos work best
- **Content**: Focus on potato leaves for accurate results
- **Format**: Any of the supported image formats

## API Endpoints

### POST /predict
Upload an image and get disease classification results.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
  "prediction": "Potato___Early_blight",
  "confidence": 95.67,
  "all_predictions": {
    "Potato___Early_blight": 95.67,
    "Potato___Late_blight": 3.21,
    "Potato___healthy": 1.12
  },
  "success": true
}
```

### GET /health
Check if the API is running and the model is loaded.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## Project Structure

```
potato_disease_classification_using_cnn/
├── app.py                          # Flask application
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── templates/
│   └── index.html                  # Main HTML template
├── static/
│   ├── style.css                   # CSS styles
│   └── script.js                   # JavaScript functionality
├── trainning/
│   ├── potato_disease_model.keras  # Trained CNN model
│   ├── trainning.ipynb            # Training notebook
│   └── PlantVillage/              # Training dataset
│       ├── Potato___Early_blight/
│       ├── Potato___healthy/
│       └── Potato___Late_blight/
└── exportToHTML/
    └── trainning.ipynb.html       # Exported notebook
```

## Model Information

- **Architecture**: Custom CNN with 6 convolutional layers
- **Input Size**: 256x256x3 (RGB images)
- **Classes**: 3 (Early Blight, Late Blight, Healthy)
- **Accuracy**: 96% on test dataset
- **Training Data**: 2,152 images from PlantVillage dataset
- **Framework**: TensorFlow/Keras

## Development

### Running in Development Mode

```bash
python app.py
```

The app will run in debug mode with auto-reload enabled.

### Running in Production

For production deployment, use a WSGI server like Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Common Issues

1. **Model not found error:**
   - Ensure `potato_disease_model.keras` exists in the `trainning/` directory
   - Check file permissions

2. **Import errors:**
   - Make sure all dependencies are installed: `pip install -r requirements.txt`
   - Verify Python version compatibility

3. **Image upload fails:**
   - Check file size (must be < 16MB)
   - Verify image format is supported
   - Ensure image is not corrupted

4. **Prediction errors:**
   - Check if the model file is corrupted
   - Verify TensorFlow installation
   - Check server logs for detailed error messages

### Performance Tips

- Use images with good lighting and clear leaf details
- Crop images to focus on the leaves
- Avoid blurry or heavily compressed images
- For best results, use images similar to the training data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **PlantVillage Dataset**: For providing the training images
- **TensorFlow/Keras**: For the deep learning framework
- **Flask**: For the web framework
- **Font Awesome**: For the icons

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the server logs for error messages
3. Ensure all dependencies are correctly installed
4. Verify the model file is present and accessible

For additional help, please open an issue in the project repository.
# potato_disease_classification_using_cnn
# potato_disease_classification_using_cnn
