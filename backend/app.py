from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import pickle
import re
import string
import os
import requests
from scipy.sparse import hstack
from nltk.tokenize import sent_tokenize
import numpy as np

# ML + NLP
from scipy.sparse import hstack
from textblob import TextBlob

# PDF + OCR
import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO

# PDF extraction 
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from datetime import datetime
import io

import nltk
import os
from web_checker import check_web_similarity

# Create persistent nltk directory
nltk_data_dir = os.path.join(os.getcwd(), "nltk_data")

if not os.path.exists(nltk_data_dir):
    os.makedirs(nltk_data_dir)

nltk.data.path.append(nltk_data_dir)


# ----------------------------
# App init
# ----------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------
# Load ML bundle
# ----------------------------
bundle = joblib.load("combined_fake_news_model.pkl")


model = bundle["model"]
tfidf = bundle["tfidf"]


# ----------------------------
# GNEWS CONFIG
# ----------------------------
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
GNEWS_ENDPOINT = "https://gnews.io/api/v4/search"

@app.route("/cross-verify", methods=["POST"])
def cross_verify():

    data = request.json
    user_text = data.get("text")

    if not user_text or len(user_text.strip()) < 20:
        return jsonify({"error": "Invalid or empty text"}), 400

    try:
        result = check_web_similarity(user_text)
        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500
    
#pdf generation 
def generate_pdf(report_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()

    # Custom Styles
    prediction_style = ParagraphStyle(
        'PredictionStyle',
        parent=styles['Heading2'],
        textColor=colors.green if report_data['prediction'] == "REAL" else colors.red
    )

    score_style = ParagraphStyle(
        'ScoreStyle',
        parent=styles['Normal'],
        textColor=colors.blue,
        fontSize=12,
    )

    normal_style = styles["Normal"]

    # Title
    elements.append(Paragraph("Fake News Analysis Report", styles["Heading1"]))
    elements.append(Spacer(1, 0.2 * inch))

    # Timestamp
    now = datetime.now().strftime("%d %B %Y, %H:%M")
    elements.append(Paragraph(f"Generated on: {now}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.3 * inch))

    # Prediction (Colorful)
    elements.append(
        Paragraph(f"Prediction: {report_data['prediction']}", prediction_style)
    )
    elements.append(Spacer(1, 0.2 * inch))

    # Confidence
    elements.append(
        Paragraph(f"Model Confidence: {report_data['confidence']}%", score_style)
    )
    elements.append(Spacer(1, 0.2 * inch))

    # Credibility
    elements.append(
        Paragraph(f"Credibility Score: {report_data['credibility_score']}/100", score_style)
    )
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.3 * inch))

    # Article Section
    elements.append(Paragraph("Submitted Article:", styles["Heading2"]))
    elements.append(Spacer(1, 0.2 * inch))

    article_preview = report_data.get("article_text", "")

    # Limit text length for PDF cleanliness
    if len(article_preview) > 1500:
        article_preview = article_preview[:1500] + "..."

    elements.append(Paragraph(article_preview.replace("\n", "<br/>"), normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.3 * inch))

    # Reasons Section
    elements.append(Paragraph("Analysis Explanation:", styles["Heading2"]))
    elements.append(Spacer(1, 0.2 * inch))

    for reason in report_data["reasons"]:
        elements.append(Paragraph(f"• {reason}", normal_style))
        elements.append(Spacer(1, 0.15 * inch))

    elements.append(Spacer(1, 0.4 * inch))

    # Footer
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(
        Paragraph(
            "This report is generated using probabilistic machine learning models and does not constitute factual verification.",
            styles["Italic"],
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer
# ----------------------------
# Text utilities
# ----------------------------
def clean_extracted_text(text: str) -> str:
    text = re.sub(r"[^\x20-\x7E]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# ----------------------------
# PDF extraction
# ----------------------------
def extract_text_from_pdf(file_bytes: bytes) -> str:
    extracted_text = ""

    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
    except Exception as e:
        print("pdfplumber failed:", e)

    extracted_text = clean_extracted_text(extracted_text)

    # OCR fallback
    if len(extracted_text) < 200:
        print("⚠️ Falling back to OCR...")
        try:
            images = convert_from_bytes(
                file_bytes,
                dpi=300,
                poppler_path=r"C:\Users\HP\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
            )
            ocr_text = ""
            for img in images:
                ocr_text += pytesseract.image_to_string(img, lang="eng")

            extracted_text = clean_extracted_text(ocr_text)
        except Exception as e:
            print("OCR failed:", e)

    return extracted_text

# ----------------------------
# Preprocessing (MUST MATCH TRAINING)
# ----------------------------
def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_sentiment(text: str) -> float:
    return TextBlob(text).sentiment.polarity

# ----------------------------
# Search Query Builder
# ----------------------------
def build_search_query(text):
    # Lowercase
    text = text.lower()

    # Remove special characters
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

    # Remove common filler words
    stop_words = {
        "the", "is", "are", "was", "were", "including",
        "and", "at", "of", "in", "to", "for", "with",
        "on", "by", "a", "an"
    }

    words = [w for w in text.split() if w not in stop_words]

    # Keep only first 5–6 strong keywords
    keywords = words[:6]

    return " ".join(keywords)


# ----------------------------
# GNEWS SEARCH
# ----------------------------
def search_gnews(query):
    params = {
        "q": query.strip(),
        "lang": "en",
        "max": 5,
        "token": GNEWS_API_KEY
    }

    try:
        response = requests.get(GNEWS_ENDPOINT, params=params)
        data = response.json()
    except Exception as e:
        print("GNews API error:", e)
        return []

    results = []

    if "articles" in data:
        for article in data["articles"]:
            results.append({
                "title": article.get("title"),
                "url": article.get("url"),
                "snippet": article.get("description"),
                "source": article.get("source", {}).get("name"),
                "publishedAt": article.get("publishedAt")
            })

    return results

#report download route 
@app.route("/download-report", methods=["POST"])
def download_report():
    data = request.json

    pdf_buffer = generate_pdf(data)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name="analysis_report.pdf",
        mimetype="application/pdf"
    )

# ----------------------------
# Home route
# ----------------------------
@app.route("/", methods=["GET"])
def home():
    return "Fake News Detection backend running 🚀"

# ----------------------------
# PDF Extraction API
# ----------------------------
@app.route("/extract-pdf", methods=["POST"])
def extract_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_bytes = file.read()

    try:
        text = extract_text_from_pdf(file_bytes)
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Prediction API
# ----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    cleaned = preprocess(text)
    sentiment = get_sentiment(cleaned)
    word_count = len(cleaned.split())


    X_tfidf = tfidf.transform([cleaned])
    

    X_final = hstack([X_tfidf])

    prediction = model.predict(X_final)[0]
    confidence = model.predict_proba(X_final).max()

    return jsonify({
        "label": "Fake" if prediction == 0 else "Real",
        "confidence": round(float(confidence), 3),
        "word_count": word_count,
        "sentiment": round(float(sentiment), 3)
    })

# ----------------------------
# GNEWS SEARCH API
# ----------------------------
@app.route("/search-news", methods=["POST"])
def search_news():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"results": [],
                        "coverage_strength": "none",
                        "source_quality": "low"})

    query = build_search_query(text)

    # Call GNews
    params = {
        "q": query,
        "lang": "en",
        "max": 5,
        "sortby": "relevance",
        "token": GNEWS_API_KEY
    }

    response = requests.get(GNEWS_ENDPOINT, params=params)
    raw_data = response.json()

    results = []

    if "articles" in raw_data:
        for article in raw_data["articles"]:
            results.append({
                "title": article.get("title"),
                "url": article.get("url"),
                "snippet": article.get("description"),
                "source": article.get("source", {}).get("name"),
                "publishedAt": article.get("publishedAt")
            })  

    # ----------------------------
    # Coverage Strength Logic
    # ----------------------------
    total_articles = len(results)

    unique_domains = set()
    for item in results:
        try:
            domain = item["url"].split("/")[2].replace("www.", "")
            unique_domains.add(domain)
        except:
            pass

    unique_count = len(unique_domains)

    if total_articles >= 2 and unique_count >= 1:
        coverage_strength = "strong"
    elif total_articles >= 1:
        coverage_strength = "moderate"
    elif total_articles == 0:
        coverage_strength = "weak"
    else:
        coverage_strength = "none"

    # ----------------------------
    # Source Credibility Logic
    # ----------------------------
    HIGH_CREDIBILITY = {
        "reuters.com",
        "bbc.com",
        "apnews.com",
        "nytimes.com",
        "theguardian.com"
    }

    MEDIUM_CREDIBILITY = {
        "cnn.com",
        "ndtv.com",
        "news18.com",
        "timesofindia.com",
        "hindustantimes.com",
        "india.com"
    }

    credibility_scores = []

    for domain in unique_domains:
        if domain in HIGH_CREDIBILITY:
            credibility_scores.append(2)
        elif domain in MEDIUM_CREDIBILITY:
            credibility_scores.append(1)
        else:
            credibility_scores.append(0)

    if credibility_scores:
        avg_score = sum(credibility_scores) / len(credibility_scores)
    else:
        avg_score = 0

    if avg_score >= 1.0:
        source_quality = "high"
    elif avg_score >= 0.5:
        source_quality = "mixed"
    else:
        source_quality = "low"
    
    return jsonify({
        "query_used": query,
        "api_status": response.status_code,
        "total_articles_found": raw_data.get("totalArticles"),
        "results": results,
        "coverage_strength": coverage_strength,
        "source_quality": source_quality,
        "raw_response": raw_data  # full API response
    })
# ----------------------------
# Load AI Detection Model
# ----------------------------
import joblib

ai_pipeline = joblib.load("ai_detector_realistic.pkl")

ai_model = ai_pipeline["model"]
ai_tfidf = ai_pipeline["tfidf"]
ai_scaler = ai_pipeline["scaler"]

# ----------------------------
# Stylometric Feature Extraction
# ----------------------------
def extract_stylometric_features(cleaned):
    from nltk.tokenize import sent_tokenize, word_tokenize
    from nltk.corpus import stopwords
    import numpy as np
    import math
    from collections import Counter

    stop_words = set(stopwords.words("english"))

    sentences = sent_tokenize(cleaned)
    words = word_tokenize(cleaned)
    words = [w for w in words if w.isalpha()]

    if len(sentences) == 0 or len(words) == 0:
        return np.array([[0] * 10])

    sentence_lengths = [len(word_tokenize(s)) for s in sentences]
    burstiness = np.var(sentence_lengths)
    avg_sentence_length = np.mean(sentence_lengths)

    word_lengths = [len(w) for w in words]
    avg_word_length = np.mean(word_lengths)

    unique_words = len(set(words))
    lexical_diversity = unique_words / len(words)

    stopword_ratio = sum(w in stop_words for w in words) / len(words)

    counts = Counter(words)
    repetition_score = max(counts.values()) / len(words)

    total_words = len(words)
    entropy = -sum((c/total_words) * math.log2(c/total_words)
                   for c in counts.values())

    hapax_ratio = len([w for w, c in counts.items() if c == 1]) / total_words

    return np.array([[
        burstiness,
        avg_sentence_length,
        avg_word_length,
        lexical_diversity,
        stopword_ratio,
        repetition_score,
        entropy,
        hapax_ratio,
        total_words,
        len(sentences)
    ]])

# ----------------------------
# AI Detection Route
# ----------------------------
@app.route("/ai-detect", methods=["POST"])
def ai_detect():

    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    cleaned = text.lower()

    # TF-IDF
    tfidf_features = ai_tfidf.transform([cleaned])

    # Stylometric Features
    stylometric = extract_stylometric_features(cleaned)

    stylometric_scaled = ai_scaler.transform(stylometric)

    final_input = hstack([tfidf_features, stylometric_scaled])

    prediction = ai_model.predict(final_input)[0]
    probabilities = ai_model.predict_proba(final_input)[0]

    ai_prob = float(probabilities[1])
    human_prob = float(probabilities[0])

    confidence = round(max(ai_prob, human_prob) * 100, 2)

    return jsonify({
        "prediction": "AI Generated" if prediction == 1 else "Human Written",
        "ai_probability": round(ai_prob * 100, 2),
        "human_probability": round(human_prob * 100, 2),
        "confidence": confidence
    })

# ----------------------------
# Reusable Prediction Function
# ----------------------------
def predict_text_unit(unit_text):

    cleaned = unit_text.lower()

    tfidf_features = ai_tfidf.transform([cleaned])

    stylometric = extract_stylometric_features(cleaned)
    stylometric_scaled = ai_scaler.transform(stylometric)

    final_input = hstack([tfidf_features, stylometric_scaled])

    prediction = ai_model.predict(final_input)[0]
    probabilities = ai_model.predict_proba(final_input)[0]

    ai_prob = float(probabilities[1])
    human_prob = float(probabilities[0])

    return prediction, ai_prob, human_prob

# ----------------------------
# Sentence-Level AI Detection
# ----------------------------
@app.route("/ai-detect-sentences", methods=["POST"])
def ai_detect_sentences():

    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    sentences = sent_tokenize(text)

    results = []

    for sentence in sentences:

        if len(sentence.strip()) < 15:
            continue  # skip extremely short sentences

        prediction, ai_prob, human_prob = predict_text_unit(sentence)

        ai_percent = ai_prob * 100
        human_percent = human_prob * 100

        confidence = max(ai_percent, human_percent)

        # Confidence smoothing (-4 if too high)
        if confidence >= 95:
            confidence -= 4

        results.append({
            "text": sentence,
            "ai_probability": round(ai_percent, 2),
            "human_probability": round(human_percent, 2),
            "confidence": round(confidence, 2),
            "label": "AI Likely" if ai_prob > human_prob else "Human Likely"
        })

    return jsonify({"sentences": results})

# ----------------------------
# Sliding Window AI Detection
# ----------------------------
@app.route("/ai-detect-sliding", methods=["POST"])
def ai_detect_sliding():

    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    sentences = sent_tokenize(text)

    window_size = 4  # change to 3 if needed

    results = []

    for i in range(len(sentences) - window_size + 1):

        chunk = " ".join(sentences[i:i + window_size])

        prediction, ai_prob, human_prob = predict_text_unit(chunk)

        ai_percent = ai_prob * 100
        human_percent = human_prob * 100

        confidence = max(ai_percent, human_percent)

        if confidence >= 95:
            confidence -= 4

        results.append({
            "text": chunk,
            "ai_probability": round(ai_percent, 2),
            "human_probability": round(human_percent, 2),
            "confidence": round(confidence, 2),
            "label": "AI Likely" if ai_prob > human_prob else "Human Likely"
        })

    return jsonify({"segments": results})

from flask import request, jsonify
from newspaper import Article
import traceback

@app.route("/analyze-url", methods=["POST"])
def analyze_url():
    data = request.get_json()
    url = data.get("url", "")

    print("Received URL:", url)

    if not url.startswith(("http://", "https://")):
        return jsonify({"error": "Invalid URL"}), 400

    from newspaper import Article

    article = Article(url)
    article.download()
    article.parse()

    print("TITLE:", article.title)
    print("TEXT LENGTH:", len(article.text))

    return jsonify({
        "title": article.title,
        "extracted_text": article.text[:1500]
    })

# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
