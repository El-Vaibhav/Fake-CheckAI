from ddgs import DDGS
from bs4 import BeautifulSoup
from readability import Document
import requests


def search_duckduckgo(query, max_results=8):
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
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            return ""

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove scripts and styles
        for script in soup(["script", "style", "noscript"]):
            script.decompose()

        paragraphs = soup.find_all("p")

        text = " ".join(
            p.get_text(strip=True)
            for p in paragraphs
            if len(p.get_text(strip=True)) > 40
        )

        return text.strip()

    except Exception as e:
        print("Scrape error:", e)
        return ""


def get_risk_level(score):
    if score > 70:
        return "High"
    elif score > 45:
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
    search_results = search_duckduckgo(query, max_results=8)

    report = []
    highest_score = 0

    for result in search_results:
        url = result["link"]
        title = result["title"]

        print("Processing:", url)

        web_text = extract_text_from_url(url)

        print("Extracted length:", len(web_text))

        if len(web_text) < 150:
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

    # Sort by similarity
    report = sorted(report, key=lambda x: x["similarity"], reverse=True)

    if report:
      for item in report:
        item["similarity"] = round(min(item["similarity"] + 15, 100.0), 2)

    # Recalculate highest AFTER boosting
        highest_score = report[0]["similarity"]
    else:
      highest_score = 0


    return {
        "highest_similarity": highest_score,
        "risk_level": get_risk_level(highest_score),
        "sources": report
    }
