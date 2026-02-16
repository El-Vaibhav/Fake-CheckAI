import requests
import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import nltk

HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}


# ==============================
# EMBEDDING FUNCTION (HF API)
# ==============================
def get_embedding(text):
    response = requests.post(
        MODEL_URL,
        headers=headers,
        json={"inputs": text},
        timeout=30
    )

    if response.status_code != 200:
        raise Exception(f"HuggingFace API Error: {response.text}")

    return np.array(response.json())


# ==============================
# Sentence Split
# ==============================
def split_into_sentences(text):
    sentences = nltk.sent_tokenize(text)
    return [s.strip() for s in sentences if len(s.strip()) > 20]


# ==============================
# Overall Similarity
# ==============================
def compute_overall_similarity(text1, text2):
    emb1 = get_embedding(text1)
    emb2 = get_embedding(text2)

    similarity = cosine_similarity(
        [emb1],
        [emb2]
    )[0][0]

    return round(float(similarity) * 100, 2)


# ==============================
# Sentence-Level Similarity
# ==============================
def sentence_level_similarity(text1, text2, threshold=0.75):
    sentences1 = split_into_sentences(text1)
    sentences2 = split_into_sentences(text2)

    if not sentences1 or not sentences2:
        return []

    embeddings1 = np.array([get_embedding(s) for s in sentences1])
    embeddings2 = np.array([get_embedding(s) for s in sentences2])

    similarity_matrix = cosine_similarity(embeddings1, embeddings2)

    matches = []

    for i, row in enumerate(similarity_matrix):
        max_score = max(row)
        if max_score >= threshold:
            matched_index = row.argmax()
            matches.append({
                "input_sentence": sentences1[i],
                "matched_sentence": sentences2[matched_index],
                "similarity": round(float(max_score) * 100, 2)
            })

    return matches
