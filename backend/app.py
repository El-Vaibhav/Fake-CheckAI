from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request
)
from auth import auth_bp
import joblib
import pickle
import re
import string
import os
import requests
from scipy.sparse import hstack
from nltk.tokenize import sent_tokenize
import numpy as np
from collections import Counter
# ML + NLP
from scipy.sparse import hstack
from textblob import TextBlob

# PDF + OCR
import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO

# PDF extraction 
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
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

# DB connection
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

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

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
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

    # JWT is OPTIONAL
    verify_jwt_in_request(optional=True)

    identity = get_jwt_identity()
    user_id = int(identity) if identity else None

    data = request.get_json()

    print("========== CROSS VERIFY REQUEST ==========")
    print("Received JSON:", data)

    user_text = data.get("text") if data else None

    if not user_text or len(user_text.strip()) < 20:
        return jsonify({"error": "Invalid or empty text"}), 400

    try:

        result = check_web_similarity(user_text)

        highest_similarity = result.get("highest_similarity", 0)
        risk_level = result.get("risk_level", "Unknown")

        sources = result.get("sources", [])
        total_sources = len(sources)

        if user_id and sources:

            conn = get_db_connection()
            cursor = conn.cursor()

            # Keep only UNIQUE source types
            unique_sources = {
                src.get("source_type", "Other")
                for src in sources
            }

            print("Unique Sources:", unique_sources)

            # Insert each unique source ONLY ONCE
            for source_type in unique_sources:

                cursor.execute(
                    """
                    INSERT INTO cross_verify_logs
                    (
                        input_text,
                        highest_similarity,
                        risk_level,
                        total_sources,
                        source_type,
                        created_at,
                        user_id
                    )
                    VALUES
                    (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        NOW() AT TIME ZONE 'Asia/Kolkata',
                        %s
                    )
                    """,
                    (
                        user_text,
                        highest_similarity,
                        risk_level,
                        total_sources,
                        source_type,
                        user_id
                    )
                )

            conn.commit()
            cursor.close()
            conn.close()

        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/source-wise-stats", methods=["GET"])
@jwt_required()
def source_wise_stats():

    user_id = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT source_type, COUNT(*)
        FROM cross_verify_logs
        WHERE user_id = %s
        GROUP BY source_type
    """, (user_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {
        "Twitter": 0,
        "Reddit": 0,
        "News": 0,
        "Blogs": 0,
        "Social": 0
    }

    for r in rows:
        if r[0] in data:
            data[r[0]] = r[1]

    return jsonify([
        {"name": k, "value": v} for k, v in data.items()
    ])

@app.route("/cross-verify-stats", methods=["GET"])
@jwt_required()
def cross_verify_stats():

    user_id = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT risk_level, COUNT(*) 
        FROM cross_verify_logs
        WHERE user_id = %s
        GROUP BY risk_level
    """, (user_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {
        "Low": 0,
        "Moderate": 0,
        "High": 0
    }

    for r in rows:
        data[r[0]] = r[1]

    return jsonify([
        {"name": "Low Risk", "value": data["Low"]},
        {"name": "Moderate Risk", "value": data["Moderate"]},
        {"name": "High Risk", "value": data["High"]}
    ])

@app.route("/cross-stats", methods=["GET"])
@jwt_required()
def cross_stats():

    user_id = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT risk_level, COUNT(*)
        FROM cross_verify_logs
        WHERE user_id = %s
        GROUP BY risk_level
    """, (user_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {
        "Low": 0,
        "Moderate": 0,
        "High": 0
    }

    for r in rows:
        data[r[0]] = r[1]

    return jsonify(data)
    
#pdf generation 
def generate_pdf(report_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()

    # 🎨 CUSTOM STYLES
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        textColor=colors.HexColor("#1e3a8a"),
        alignment=1  # center
    )

    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        textColor=colors.HexColor("#0ea5e9")
    )

    normal = styles["Normal"]

    box_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 1, colors.grey),
        ('INNERPADDING', (0, 0), (-1, -1), 8),
    ])

    # 🎯 HEADER
    elements.append(Paragraph("🧠 Fake News Analysis Report", title_style))
    elements.append(Spacer(1, 0.2 * inch))

    now = datetime.now().strftime("%d %B %Y, %H:%M")
    elements.append(Paragraph(f"<b>Generated:</b> {now}", normal))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.3 * inch))

    # 🎯 PREDICTION BADGE
    pred_color = "#16a34a" if report_data["prediction"] == "REAL" else "#dc2626"

    elements.append(
        Paragraph(
            f"<b>Prediction:</b> <font color='{pred_color}' size=14><b>{report_data['prediction']}</b></font>",
            normal
        )
    )
    elements.append(Spacer(1, 0.2 * inch))

    # 📊 SCORE CARDS
    score_table = Table([
        ["Confidence", "Credibility Score"],
        [
            f"{report_data['confidence']}%",
            f"{report_data['credibility_score']}/100"
        ]
    ])

    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e0f2fe")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOX', (0, 0), (-1, -1), 1, colors.grey),
        ('INNERPADDING', (0, 0), (-1, -1), 8),
    ]))

    elements.append(score_table)
    elements.append(Spacer(1, 0.4 * inch))

    # 🧾 ARTICLE SECTION
    elements.append(Paragraph("📝 Submitted Article", section_title))
    elements.append(Spacer(1, 0.15 * inch))

    article = report_data.get("article_text", "")
    if len(article) > 1200:
        article = article[:1200] + "..."

    article_box = Table([[Paragraph(article.replace("\n", "<br/>"), normal)]])
    article_box.setStyle(box_style)

    elements.append(article_box)
    elements.append(Spacer(1, 0.4 * inch))

    # 💡 REASONS
    elements.append(Paragraph("💡 Model Explanation", section_title))
    elements.append(Spacer(1, 0.2 * inch))

    for reason in report_data["reasons"]:
        elements.append(Paragraph(f"• {reason}", normal))
        elements.append(Spacer(1, 0.12 * inch))

    elements.append(Spacer(1, 0.4 * inch))

    # ⚠️ FOOTER
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
    elements.append(Spacer(1, 0.2 * inch))

    elements.append(
        Paragraph(
            "<i>This report is generated using machine learning and may not represent absolute truth.</i>",
            styles["Italic"]
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
@jwt_required()
def download_report():
    data = request.json
    user_id = int(get_jwt_identity())

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

    # JWT is OPTIONAL
    verify_jwt_in_request(optional=True)

    identity = get_jwt_identity()
    user_id = int(identity) if identity else None

    print("Logged in User ID:", user_id)

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

    prediction_label = "Fake" if prediction == 0 else "Real"
    confidence_val = float(confidence)

    # Save ONLY for logged-in users
    if user_id:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO analysis_logs
            (
                input_text,
                prediction,
                confidence,
                created_at,
                user_id
            )
            VALUES
            (
                %s,
                %s,
                %s,
                NOW() AT TIME ZONE 'Asia/Kolkata',
                %s
            )
            """,
            (
                text,
                prediction_label,
                confidence_val,
                user_id
            )
        )

        conn.commit()
        cursor.close()
        conn.close()

    return jsonify({
        "label": prediction_label,
        "confidence": round(confidence_val, 3),
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

    # JWT is OPTIONAL
    verify_jwt_in_request(optional=True)

    identity = get_jwt_identity()
    user_id = int(identity) if identity else None

    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    cleaned = text.lower()

    # TF-IDF features
    tfidf_features = ai_tfidf.transform([cleaned])

    # Stylometric features
    stylometric = extract_stylometric_features(cleaned)
    stylometric_scaled = ai_scaler.transform(stylometric)

    # Combine features
    final_input = hstack([tfidf_features, stylometric_scaled])

    # Prediction
    prediction = ai_model.predict(final_input)[0]
    probabilities = ai_model.predict_proba(final_input)[0]

    ai_prob = float(probabilities[1])
    human_prob = float(probabilities[0])

    confidence = round(max(ai_prob, human_prob) * 100, 2)

    result_label = "AI Generated" if prediction == 1 else "Human Written"

    print("========== AI DETECT ==========")
    print("User ID:", user_id)
    print("Result:", result_label)
    print("Confidence:", confidence)

    # Save ONLY for logged-in users
    if user_id:
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                """
                INSERT INTO ai_detection_logs
                (
                    input_text,
                    result,
                    confidence,
                    created_at,
                    user_id
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    NOW() AT TIME ZONE 'Asia/Kolkata',
                    %s
                )
                """,
                (
                    text,
                    result_label,
                    confidence,
                    user_id
                )
            )

            conn.commit()

        except Exception as e:
            print("DB Error:", e)

        finally:
            cursor.close()
            conn.close()

    return jsonify({
        "prediction": result_label,
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

@app.route("/chart-data", methods=["GET"])
@jwt_required()
def chart_data():
    user_id = int(get_jwt_identity())
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get analysis logs (fake/real)
    cursor.execute("""
SELECT created_at, prediction
FROM analysis_logs
WHERE user_id=%s
ORDER BY created_at ASC
""", (user_id,))
    analysis_rows = cursor.fetchall()

    # Get AI logs
    cursor.execute("""
SELECT created_at, result
FROM ai_detection_logs
WHERE user_id=%s
ORDER BY created_at ASC
""", (user_id,))
    ai_rows = cursor.fetchall()

    cursor.close()
    conn.close()

    data = []

    # merge both logs
    combined = []

    for row in analysis_rows:
        combined.append({
            "time": row[0],
            "fake": 1 if row[1] == "Fake" else 0,
            "real": 1 if row[1] == "Real" else 0,
            "ai": 0
        })

    for row in ai_rows:
        combined.append({
            "time": row[0],
            "fake": 0,
            "real": 0,
            "ai": 1 if row[1] == "AI Generated" else 0
        })

    # sort by time
    combined.sort(key=lambda x: x["time"])

    fake_count = 0
    ai_count = 0

    for item in combined:
        fake_count += item["fake"]
        ai_count += item["ai"]

        data.append({
            "time": item["time"].isoformat(),
            "fake": fake_count,
            "ai": ai_count
        })

    return jsonify(data)

@app.route("/table-data", methods=["GET"])
@jwt_required()
def table_data():
    user_id = int(get_jwt_identity())
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fake / Real (analysis_logs)
    # analysis_logs
    cursor.execute("""
SELECT id,input_text,prediction,confidence,created_at
FROM analysis_logs
WHERE user_id=%s
""", (user_id,))
    analysis_rows = cursor.fetchall() 
    # ai_detection_logs
    cursor.execute("""
SELECT id,input_text,result,confidence,created_at
FROM ai_detection_logs
WHERE user_id=%s
""", (user_id,))
    ai_rows = cursor.fetchall()

    cursor.close()
    conn.close()

    combined = []

    # Add analysis logs
    for r in analysis_rows:
        combined.append({
            "id": r[0],
            "text": r[1],
            "type": r[2],  # Fake / Real
            "confidence": r[3],
            "date": r[4]
        })

    # Add AI logs
    for r in ai_rows:
        combined.append({
            "id": r[0],
            "text": r[1],
            "type": r[2],  # AI Generated / Human Written
            "confidence": r[3],
            "date": r[4]
        })

    # Sort by latest
    combined.sort(key=lambda x: x["date"], reverse=True)

    return jsonify([
        {
            "id": item["id"],
            "text": item["text"],
            "type": item["type"],
            "confidence": item["confidence"],
            "date": item["date"].isoformat()
        }
        for item in combined[:50]
    ])

@app.route("/metrics", methods=["GET"])
@jwt_required()
def get_metrics():
    user_id = int(get_jwt_identity())
    conn = get_db_connection()
    cursor = conn.cursor()

    # counts
    cursor.execute("SELECT COUNT(*) FROM analysis_logs WHERE user_id=%s", (user_id,))
    analysis_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ai_detection_logs WHERE user_id=%s", (user_id,))
    ai_count = cursor.fetchone()[0]

    total = analysis_count + ai_count

    # fake / real
    cursor.execute("SELECT COUNT(*) FROM analysis_logs WHERE prediction='Fake' AND user_id=%s", (user_id,))
    fake = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM analysis_logs WHERE prediction='Real' AND user_id=%s", (user_id,))
    real = cursor.fetchone()[0]

    # AI stats
    cursor.execute("SELECT COUNT(*) FROM ai_detection_logs WHERE result='AI Generated' AND user_id=%s", (user_id,))
    ai_generated = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ai_detection_logs WHERE result='Human Written' AND user_id=%s", (user_id,))
    human_written = cursor.fetchone()[0]

    # accuracy
    cursor.execute("SELECT AVG(confidence) FROM analysis_logs WHERE user_id=%s", (user_id,))
    analysis_avg = cursor.fetchone()[0] or 0

    cursor.execute("SELECT AVG(confidence) FROM ai_detection_logs WHERE user_id=%s", (user_id,))
    ai_avg = cursor.fetchone()[0] or 0

    total_count = analysis_count + ai_count

    avg_accuracy = (
        ((analysis_avg * analysis_count) + (ai_avg * ai_count)) / total_count
        if total_count > 0 else 0
    )

    cursor.execute("SELECT COUNT(*) FROM exported_reports WHERE user_id=%s", (user_id,))
    exported = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    fake_pct = round((fake / analysis_count) * 100, 2) if analysis_count else 0
    ai_pct = round((ai_generated / ai_count) * 100, 2) if ai_count else 0



    return jsonify({
        "total": total,
        "analysis_count": analysis_count,
        "ai_count": ai_count,
        "fake": fake,
        "real": real,
        "ai_generated": ai_generated,
        "human_written": human_written,
        "fake_pct": fake_pct,
        "ai_pct": ai_pct,
        "accuracy": round(avg_accuracy, 2),
        "exported": exported
    })

@app.route("/exports", methods=["GET"])
@jwt_required()
def get_exports():
    user_id = int(get_jwt_identity())
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT e.id, e.report_id, e.type, e.created_at, a.input_text
        FROM exported_reports e
        JOIN analysis_logs a ON e.report_id = a.id
        WHERE e.user_id = %s
        ORDER BY e.created_at DESC
    """, (user_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "report_id": r[1],
            "type": r[2],
            "date": r[3].isoformat(),
            "text": r[4][:120] if r[4] else "Report"
        }
        for r in rows
    ])

@app.route("/download-report/<int:id>")
@jwt_required()
def download_report_by_id(id):
    user_id = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()

    # 🔥 Fetch data
    cursor.execute("""
SELECT
input_text,
prediction,
confidence
FROM analysis_logs
WHERE id=%s
AND user_id=%s
""", (id, user_id))
    row = cursor.fetchone()

    if not row:
        cursor.close()
        conn.close()
        return "Not found", 404

    text, prediction, confidence = row

    # SAVE EXPORT
    cursor.execute(
        "INSERT INTO exported_reports (report_id, type, user_id) VALUES (%s, %s, %s)",
        (id, prediction, user_id)
    )
    conn.commit()

    cursor.close()
    conn.close()

    # Convert DB → report format (VERY IMPORTANT)
    report_data = {
        "prediction": prediction.upper(),
        "confidence": round(float(confidence) * 100, 2) if confidence <= 1 else round(float(confidence), 2),
        "credibility_score": 100 - int(float(confidence) * 100) if prediction == "Fake" else int(float(confidence) * 100),
        "article_text": text,
        "reasons": [
            "Model detected linguistic patterns",
            "Confidence based on training dataset",
            "Cross-source verification may vary"
        ]
    }

    # USE SAME PDF FUNCTION
    pdf_buffer = generate_pdf(report_data)
    safe_title = re.sub(r'[^\w\s-]', '', text).strip().replace(" ", "_")[:50]

    return send_file(
    pdf_buffer,
    as_attachment=True,
    download_name=f"{safe_title}.pdf",
    mimetype="application/pdf"
)
# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
