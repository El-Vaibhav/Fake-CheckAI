from ddgs import DDGS
from bs4 import BeautifulSoup
from readability import Document
import requests


def search_duckduckgo(query, max_results=5):
    results_list = []

    with DDGS() as ddgs:
        results = ddgs.text(query, max_results=max_results)

        for result in results:
            results_list.append({
                "title": result.get("title"),
                "link": result.get("href"),
                "snippet": result.get("body")
            })

    return results_list


def extract_text_from_url(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=5)

        doc = Document(response.text)
        html = doc.summary()

        soup = BeautifulSoup(html, "html.parser")
        paragraphs = soup.find_all("p")

        text = " ".join([p.get_text() for p in paragraphs])
        return text.strip()

    except Exception as e:
        print("Scrape error:", e)
        return ""


def get_risk_level(score):
    if score > 75:
        return "High"
    elif score > 50:
        return "Moderate"
    else:
        return "Low"


def check_web_similarity(user_text):

    # Lazy import (VERY IMPORTANT)
    from similarity_model import (
        compute_overall_similarity,
        sentence_level_similarity
    )

    query = user_text[:200]
    search_results = search_duckduckgo(query, max_results=5)

    report = []
    highest_score = 0

    for result in search_results:
        url = result["link"]
        title = result["title"]

        web_text = extract_text_from_url(url)

        if len(web_text) < 300:
            continue

        overall_score = compute_overall_similarity(user_text, web_text)
        sentence_matches = sentence_level_similarity(user_text, web_text)

        if overall_score > highest_score:
            highest_score = overall_score

        report.append({
            "title": title,
            "url": url,
            "similarity": overall_score,
            "matched_sentences": sentence_matches[:3]
        })

    report = sorted(report, key=lambda x: x["similarity"], reverse=True)

    return {
        "highest_similarity": highest_score,
        "risk_level": get_risk_level(highest_score),
        "sources": report
    }
