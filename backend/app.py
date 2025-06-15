import torch
import torch.nn as nn
import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import BertTokenizer, BertModel

# Initialize Flask app
app = Flask(__name__, static_folder="public/build", static_url_path="")
CORS(app)  # Enable CORS for frontend requests

# Load tokenizer and model
TOKENIZER_PATH = r"C:\Users\Asus\models\bert-base-uncased"
MODEL_PATH = r"C:\Users\Asus\fake-news-detector\backend\fake_news_model.pth"

tokenizer = BertTokenizer.from_pretrained(TOKENIZER_PATH, local_files_only=True)

class FakeNewsClassifier(nn.Module):
    def __init__(self):
        super(FakeNewsClassifier, self).__init__()
        self.bert = BertModel.from_pretrained(TOKENIZER_PATH, local_files_only=True)
        self.fc1 = nn.Linear(768, 512)
        self.fc2 = nn.Linear(512, 2)
        self.relu = nn.ReLU()

    def forward(self, input_ids, attention_mask):
        output = self.bert(input_ids, attention_mask=attention_mask)
        x = self.fc1(output.last_hidden_state[:, 0, :])  # CLS token
        x = self.relu(x)
        return self.fc2(x)

# Load trained model
model = FakeNewsClassifier()
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()  # Set model to evaluation mode
print("Model loaded successfully!")

# API Endpoint to Predict Fake News
@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Tokenize input text
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")

    # Run through model
    with torch.no_grad():
        logits = model(inputs["input_ids"], inputs["attention_mask"])
    
    prediction = torch.argmax(logits, dim=1).item()
    result = "Fake News" if prediction == 1 else "Real News"

    return jsonify({"prediction": result})

if __name__ == "__main__":
    print("Starting Flask Server...")
    app.run(host="0.0.0.0", port=5000, debug=True)
