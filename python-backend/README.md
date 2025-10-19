# AI Medical Chatbot - Python Backend

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
cd python-backend
pip install -r requirements.txt
```

Or create a virtual environment (recommended):

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2. Start the Flask Server

```bash
python chatbot_api.py
```

Server will run on: **http://localhost:5000**

## 📡 API Endpoints

### 1. Chat Endpoint
**POST** `/api/chat`

Send chat messages with optional image analysis

```json
{
  "message": "I have itching and redness on my arm",
  "image": "data:image/jpeg;base64,..." // Optional
}
```

Response:
```json
{
  "success": true,
  "response": "## Medical Analysis...",
  "timestamp": "2024-01-15T10:30:00",
  "hasImageAnalysis": true
}
```

### 2. Symptom Analysis
**POST** `/api/analyze-symptoms`

Analyze text symptoms

```json
{
  "symptoms": "itching, redness, swelling, small bumps"
}
```

### 3. Health Check
**GET** `/api/health`

Check if API is running

## 🧠 AI Features

### Medical Knowledge Base
- **6 Skin Conditions**: Mosquito bites, acne, rash, eczema, burns, bedbug bites
- **3 Common Symptoms**: Headache, fever, cough (with subtypes)
- **Treatment Protocols**: Evidence-based recommendations
- **Emergency Guidelines**: Red flag warnings

### Image Analysis
- Color-based heuristic analysis
- Redness level detection
- Condition classification
- Confidence scoring (85-92%)

### Symptom Matching
- Keyword-based symptom detection
- Weighted scoring algorithm
- Best-match condition selection
- Multi-symptom correlation

## 🔧 Technical Stack

- **Flask**: Web framework
- **Flask-CORS**: Cross-origin support
- **Pillow (PIL)**: Image processing
- **NumPy**: Numerical analysis
- **Base64**: Image encoding/decoding

## 📊 Response Format

All AI responses use Markdown formatting:
- Headers (##, ###)
- Numbered lists
- Bullet points
- Bold text
- Emojis for visual clarity
- Warning indicators (🚨)

## 🛡️ Safety Features

- Medical disclaimers on all responses
- Emergency condition detection
- Red flag warnings
- Professional consultation recommendations

## 🔒 Security Notes

- CORS enabled for development (localhost:3001)
- Input validation on all endpoints
- Error handling and logging
- No sensitive data storage

## 📝 Usage Example

```python
import requests

# Send chat message
response = requests.post('http://localhost:5000/api/chat', json={
    'message': 'I have a severe headache with nausea'
})

print(response.json()['response'])
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module not found:**
```bash
pip install -r requirements.txt --upgrade
```

**CORS errors:**
- Ensure Flask-CORS is installed
- Check frontend URL matches CORS config

## 🎯 Next Steps

1. **Real AI Integration**: Replace heuristics with ML models (TensorFlow, PyTorch)
2. **Database**: Store conversation history
3. **Authentication**: Add user auth and sessions
4. **Advanced Image Analysis**: Use medical image classification models
5. **NLP Enhancement**: Integrate GPT or medical NLP models
