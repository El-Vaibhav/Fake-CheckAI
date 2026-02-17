import re
import nltk
import numpy as np
from difflib import SequenceMatcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ==============================
# Clean Text
# ==============================
def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text.strip()


# ==============================
# Exact Match Boost
# ==============================
def exact_match_score(text1, text2):
    if text1 in text2 or text2 in text1:
        return 1.0
    return 0.0


# ==============================
# Longest Common Substring Ratio
# ==============================
def longest_common_substring_ratio(text1, text2):
    matcher = SequenceMatcher(None, text1, text2)
    match = matcher.find_longest_match(0, len(text1), 0, len(text2))
    longest = match.size
    return longest / max(len(text1), 1)


# ==============================
# Word Overlap (Jaccard)
# ==============================
def jaccard_similarity(text1, text2):
    words1 = set(text1.split())
    words2 = set(text2.split())
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / max(len(union), 1)


# ==============================
# TF-IDF Hybrid
# ==============================
def tfidf_similarity(text1, text2):

    word_vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 3)
    )

    word_matrix = word_vectorizer.fit_transform([text1, text2])
    word_score = cosine_similarity(word_matrix[0:1], word_matrix[1:2])[0][0]

    char_vectorizer = TfidfVectorizer(
        analyzer="char",
        ngram_range=(3, 5)
    )

    char_matrix = char_vectorizer.fit_transform([text1, text2])
    char_score = cosine_similarity(char_matrix[0:1], char_matrix[1:2])[0][0]

    return (0.6 * word_score) + (0.4 * char_score)


# ==============================
# Sliding Window Chunk Similarity
# ==============================
def sliding_window_similarity(text1, text2, window_size=300):

    if len(text1) < window_size:
        window_size = max(100, len(text1) // 2)

    max_score = 0

    for i in range(0, len(text1), window_size // 2):
        chunk = text1[i:i + window_size]
        score = SequenceMatcher(None, chunk, text2).ratio()
        if score > max_score:
            max_score = score

    return max_score


# ==============================
# FINAL OVERALL SIMILARITY
# ==============================
def compute_overall_similarity(text1, text2):

    text1 = clean_text(text1)
    text2 = clean_text(text2)

    if not text1 or not text2:
        return 0.0

    # 1️⃣ Exact copy
    exact = exact_match_score(text1, text2)
    if exact == 1.0:
        return 100.0

    # 2️⃣ Hybrid TF-IDF
    tfidf_score = tfidf_similarity(text1, text2)

    # 3️⃣ Sequence similarity
    seq_score = SequenceMatcher(None, text1, text2).ratio()

    # 4️⃣ Longest substring ratio
    lcs_score = longest_common_substring_ratio(text1, text2)

    # 5️⃣ Jaccard overlap
    jaccard_score = jaccard_similarity(text1, text2)

    # 6️⃣ Sliding window similarity
    window_score = sliding_window_similarity(text1, text2)

    # Weighted combination
    final_score = (
        0.35 * tfidf_score +
        0.20 * seq_score +
        0.15 * lcs_score +
        0.15 * jaccard_score +
        0.15 * window_score
    )

    return round(float(final_score) * 100, 2)


# ==============================
# Sentence-Level Similarity
# ==============================
def sentence_level_similarity(text1, text2, threshold=0.65):

    text1 = clean_text(text1)
    text2 = clean_text(text2)

    sentences1 = nltk.sent_tokenize(text1)
    sentences2 = nltk.sent_tokenize(text2)

    sentences1 = [s for s in sentences1 if len(s) > 25]
    sentences2 = [s for s in sentences2 if len(s) > 25]

    if not sentences1 or not sentences2:
        return []

    all_sentences = sentences1 + sentences2

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2)
    )

    tfidf_matrix = vectorizer.fit_transform(all_sentences)

    emb1 = tfidf_matrix[:len(sentences1)]
    emb2 = tfidf_matrix[len(sentences1):]

    similarity_matrix = cosine_similarity(emb1, emb2)

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
