import { useState, useCallback } from "react";
import { Upload, FileText, Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultsSection } from "./ResultsSection";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";


type AnalysisResult = {
  prediction: "real" | "fake";
  confidence: number;
  reasons: string[];
} | null;

function buildReasons(data: any) {
  const reasons: string[] = [];

  /* -------------------------------
     1. Confidence-based reasoning
     ------------------------------- */
  if (data.confidence >= 0.9) {
    reasons.push(
      "The model shows very high confidence, indicating strong alignment with patterns learned from labeled fake and real news articles."
    );
  } else if (data.confidence >= 0.75) {
    reasons.push(
      "The model shows moderate-to-high confidence, suggesting multiple linguistic indicators contributed to the final decision."
    );
  } else if (data.confidence >= 0.6) {
    reasons.push(
      "The model confidence is moderate, meaning the article exhibits both reliable and unreliable textual characteristics."
    );
  } else {
    reasons.push(
      "The model confidence is low, indicating mixed or ambiguous linguistic patterns that are harder to classify decisively."
    );
  }

  /* -------------------------------
     2. Sentiment-based reasoning
     ------------------------------- */
  const absSentiment = Math.abs(data.sentiment);

  if (absSentiment >= 0.75) {
    reasons.push(
      "The article contains a highly emotional tone, which strongly influences the model’s assessment through sentiment analysis."
    );
  } else if (absSentiment >= 0.45) {
    reasons.push(
      "The article shows a noticeable emotional tone, contributing moderately to the model’s decision."
    );
  } else {
    reasons.push(
      "The article maintains a relatively neutral emotional tone, which is generally associated with informational writing."
    );
  }

  /* -------------------------------
     3. Length and structural depth
     ------------------------------- */
  if (data.word_count < 100) {
    reasons.push(
      "The article is very short, limiting contextual depth and increasing uncertainty in credibility-related patterns."
    );
  } else if (data.word_count < 300) {
    reasons.push(
      "The article is short to medium in length, providing limited but usable context for linguistic analysis."
    );
  } else if (data.word_count < 900) {
    reasons.push(
      "The article has substantial length, allowing the model to evaluate richer linguistic and structural patterns."
    );
  } else {
    reasons.push(
      "The article is long-form, enabling strong signal extraction from repeated phrases and contextual consistency."
    );
  }

  /* -------------------------------
     4. Language-pattern reasoning
     ------------------------------- */
  reasons.push(
    "The model analyzed term importance using TF-IDF and n-gram patterns, identifying phrases that statistically differentiate fake and real news."
  );

  /* -------------------------------
     5. Feature fusion explanation
     ------------------------------- */
  reasons.push(
    "Final prediction was produced by combining textual frequency patterns, sentiment polarity, and normalized article length."
  );

  /* -------------------------------
     6. Responsible AI disclaimer
     ------------------------------- */
  reasons.push(
    "This assessment is probabilistic and based on learned statistical patterns, not direct fact verification or source validation."
  );

  return reasons;
}

function adjustConfidence(rawConfidence: number): number {
  let adjusted = rawConfidence;

  if (rawConfidence >= 99) {
    adjusted = rawConfidence - 4;
  } else if (rawConfidence >= 95) {
    adjusted = rawConfidence - 3;
  }

  // Safety clamp
  if (adjusted < 50) adjusted = 50;

  return adjusted;
}

export function DetectionWorkspace() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<AnalysisResult>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [coverageStrength, setCoverageStrength] = useState<string | null>(null);
  const [sourceQuality, setSourceQuality] = useState<string | null>(null);


  const [searchMeta, setSearchMeta] = useState<any>(null);


  const maxChars = 10000;
  const charCount = text.length;
  const handleAnalyzeURL = async () => {
    if (!url.trim()) return;

    setIsFetchingUrl(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/analyze-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // ✅ Load extracted article into text area
      setText((data.title + "\n\n" + data.extracted_text).slice(0, maxChars));

    } catch (error) {
      console.error("URL Fetch Error:", error);
      alert("Failed to fetch article from URL.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setSearchResults([]);


    console.log("ANALYZE CLICKED, sending to backend");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      console.log("RESPONSE FROM BACKEND:", data);

      const rawConfidence = Math.round(data.confidence * 100);

      setResult({
        prediction: data.label.toLowerCase().includes("fake") ? "fake" : "real",
        confidence: adjustConfidence(rawConfidence),
        reasons: buildReasons(data),
      });
      // 🔎 Call search API
      const searchResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/search-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const searchData = await searchResponse.json();
      setSearchResults(searchData.results || []);
      setCoverageStrength(searchData.coverage_strength || null);
      setSourceQuality(searchData.source_quality || null);


      setSearchMeta({
        query: searchData.query_used,
        status: searchData.api_status,
        total: searchData.total_articles_found,
        raw: searchData.raw_response
      });



    } catch (error) {
      console.error("ERROR CALLING BACKEND:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText((event.target?.result as string).slice(0, maxChars));
      };
      reader.readAsText(file);
      return;
    }

    if (file.type === "application/pdf") {
      try {
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/extract-pdf`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setText(data.text.slice(0, maxChars));
      } catch (err) {
        console.error(err);
        alert("PDF extraction failed");
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, []);


  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // TXT files → browser read
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content.slice(0, maxChars));
      };
      reader.readAsText(file);
      return;
    }

    // PDF files → backend extraction
    if (file.type === "application/pdf") {
      try {
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/extract-pdf`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.text || data.text.trim().length === 0) {
          alert("No readable text found in PDF.");
          return;
        }

        setText(data.text.slice(0, maxChars));
      } catch (err) {
        console.error("PDF extraction failed:", err);
        alert("Failed to extract text from PDF.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };


  const clearAll = () => {
    setText("");
    setUrl("");
    setFileName(null);
    setResult(null);
    setSearchResults([]);
    setCoverageStrength(null);
    setSourceQuality(null);

  };
  const handleDownloadReport = async () => {
    if (!result) {
      alert("No analysis available!");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/download-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prediction: result.prediction.toUpperCase(),
          confidence: result.confidence,
          credibility_score:
            result.prediction === "real"
              ? result.confidence
              : 100 - result.confidence,
          reasons: result.reasons,
          article_text: text,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "analysis_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <section id="detect" className="py-20 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Detection Workspace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Analyze Any{" "}
            <span className="gradient-text">News Article</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Paste your article below or upload a text file to get instant AI-powered analysis
          </p>
        </div>

        {/* Workspace Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl">
            {/* URL Input */}
            <div className="mb-6 space-y-3">
              <label className="text-sm font-medium text-foreground">
                Paste News Article URL
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/news-article"
                  className="flex-1 p-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <Button
                  variant="outline"
                  onClick={handleAnalyzeURL}
                  disabled={!url.trim() || isFetchingUrl}
                >
                  {isFetchingUrl ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Fetch"
                  )}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Text Input Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  News Article Text
                </label>
                {fileName && (
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {fileName}
                  </span>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                  placeholder="Paste the news article here... The AI will analyze linguistic patterns, source credibility indicators, and content structure to determine authenticity."
                  className="w-full h-48 lg:h-64 p-4 rounded-2xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* File Upload */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
            >
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag & drop your file here
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .txt and .pdf files (max 10MB)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                variant="hero"
                size="xl"
                className="flex-1"
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with ML models...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Article
                  </>
                )}
              </Button>
              {(text || result) && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={clearAll}
                  disabled={isAnalyzing}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Our AI models analyze text patterns and linguistic features. Results are probabilistic and should complement, not replace, human judgment and fact-checking.
              </p>
            </div>
          </div>

          {/* Results Section */}
          {/* Results Section */}
          {result && <ResultsSection result={result} />}

          {/* 🔽 Download PDF Button */}
          {result && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={handleDownloadReport}
              >
                Download Analysis Report (PDF)
              </Button>
            </div>
          )}


          {/* 🟢 External Coverage Strength */}
          {coverageStrength && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-2">
                External Coverage Strength
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${coverageStrength === "strong"
                    ? "bg-green-500 w-full"
                    : coverageStrength === "moderate"
                      ? "bg-yellow-500 w-2/3"
                      : coverageStrength === "weak"
                        ? "bg-orange-500 w-1/3"
                        : "bg-red-500 w-1/12"
                    }`}
                />
              </div>

              <p className="text-sm mt-2 text-muted-foreground capitalize">
                {coverageStrength} coverage detected
              </p>
            </div>
          )}

          {/* 🟢 Source Credibility */}
          {sourceQuality && (
            <div className="mt-4 text-sm font-medium">
              Source Credibility:
              <span
                className={
                  sourceQuality === "high"
                    ? "text-green-500 ml-2"
                    : sourceQuality === "mixed"
                      ? "text-yellow-500 ml-2"
                      : "text-red-500 ml-2"
                }
              >
                {sourceQuality.toUpperCase()}
              </span>
            </div>
          )}

          {/* 🌐 Sources Found */}
          {searchResults.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-6">
                Sources Found on the Internet
              </h3>

              <div className="space-y-4">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="glass rounded-xl p-4 shadow-md hover:shadow-lg transition"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline text-base"
                    >
                      {item.title}
                    </a>

                    <p className="text-sm text-muted-foreground mt-2">
                      {item.snippet}
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ❗ No coverage */}
          {result && searchResults.length === 0 && (
            <div className="mt-8 text-sm text-muted-foreground">
              No major news coverage found for this claim.
              (The text might be AI generated, try our new AI checker tool for more insights!)
            </div>
          )}
          {/* 🔎 Cross Source Verification CTA */}
          {result && (
            <div className="mt-12 text-center space-y-4">
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Want to analyze similar news sources? Try our latest{" "}
                <span className="font-semibold text-primary">
                  Cross Source Verification
                </span>{" "}
                feature for deeper multi-source validation.
              </p>

              <div className="flex justify-center">
                <Button
                  variant="hero-outline"
                  size="lg"
                  onClick={() => navigate("/cross-verify")}
                  className="group"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Try Cross-Source Verification
                </Button>
              </div>
            </div>
          )}


        </div>
      </div>
    </section>
  );
}
