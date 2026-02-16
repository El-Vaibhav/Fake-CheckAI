import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Search,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIResultsSection } from "./AiResultsSection";

type AnalysisResult = {
  prediction: "ai" | "human";
  confidence: number;
  reasons: string[];
  aiProbability: number;
  humanProbability: number;
} | null;

/* ===============================
   Confidence Smoothing (-4%)
================================ */
function adjustConfidence(raw: number): number {
  let adjusted = raw;

  if (raw >= 99) adjusted -= 4;
  else if (raw >= 95) adjusted -= 3;

  if (adjusted < 50) adjusted = 50;

  return adjusted;
}

/* ===============================
   Explanation Builder
================================ */
function buildReasons(data: any): string[] {
  const reasons: string[] = [];

  if (data.confidence >= 90) {
    reasons.push(
      "Strong statistical alignment with AI-generated linguistic patterns."
    );
  } else if (data.confidence >= 75) {
    reasons.push(
      "Moderate stylistic consistency with AI writing structures."
    );
  } else {
    reasons.push(
      "Mixed stylometric signals between human and AI writing."
    );
  }

  reasons.push(
    "TF-IDF n-gram modeling analyzed phrase frequency distributions."
  );

  reasons.push(
    "Stylometric features such as entropy, lexical diversity, and repetition ratio influenced the classification."
  );

  reasons.push(
    "This assessment is probabilistic and does not verify factual accuracy."
  );

  return reasons;
}

export function AIDetectionWorkspace() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<AnalysisResult>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [paragraphResults, setParagraphResults] = useState<any[]>([]);


  const maxChars = 10000;
  const charCount = text.length;

  /* ===============================
     Analyze
  ================================ */
  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai-detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const adjustedConfidence = adjustConfidence(data.confidence);

      setResult({
        prediction:
          data.prediction.toLowerCase().includes("ai")
            ? "ai"
            : "human",
        confidence: adjustedConfidence,
        reasons: buildReasons(data),
        aiProbability: data.ai_probability,
        humanProbability: data.human_probability,
      });
    } catch (error) {
      console.error("AI Detection Error:", error);
      alert("AI detection failed.");
    } finally {
      setIsAnalyzing(false);
    }
    // Paragraph-level detection
    // Sentence-level detection
    const paraResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai-detect-sentences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const paraData = await paraResponse.json();
    setParagraphResults(paraData.sentences);

  };

  /* ===============================
     Drag & Drop
  ================================ */
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

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/extract-pdf`,
          {
            method: "POST",
            body: formData,
          }
        );

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
  }, []);

  /* ===============================
     File Input
  ================================ */
  const handleFileInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
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

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/extract-pdf`,
          {
            method: "POST",
            body: formData,
          }
        );

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
    setFileName(null);
    setResult(null);
  };

  /* ===============================
     Download PDF Report
  ================================ */
  const handleDownloadReport = async () => {
    if (!result) return alert("No analysis available!");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/download-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            report_type: "AI Authorship",
            prediction: result.prediction.toUpperCase(),
            confidence: result.confidence,
            credibility_score:
              result.prediction === "human"
                ? result.confidence
                : 100 - result.confidence,
            reasons: result.reasons,
            article_text: text,
          }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_authorship_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <section id="aidetect" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            AI Authorship Detection
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Analyze AI vs Human Written Content
          </h2>

          <p className="text-lg text-muted-foreground">
            Paste content or upload a TXT/PDF file to detect AI-generated writing.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl">

            {/* Text Area */}
            <textarea
              value={text}
              onChange={(e) =>
                setText(e.target.value.slice(0, maxChars))
              }
              placeholder="Paste text here..."
              className="w-full h-56 lg:h-64 p-4 rounded-2xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />

            <div className="text-xs text-muted-foreground text-right mt-2">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Upload */}
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
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag & drop your .txt or .pdf file here
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .txt and .pdf files (max 10MB)
              </p>
            </div>

            {/* Buttons */}
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
                    Detect Authorship
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
                  Clear
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This tool analyzes statistical and stylometric writing patterns.
                Results are probabilistic and should complement human judgment.
              </p>
            </div>
          </div>

          {/* Results */}
          {result && <AIResultsSection result={result} />}

          {/* Download */}
          {result && (
            <div className="mt-6 flex justify-center">
              <Button variant="hero" size="lg" onClick={handleDownloadReport}>
                Download AI Analysis Report (PDF)
              </Button>
            </div>
          )}
          {paragraphResults.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">
                Sentence-Level Analysis
              </h3>

              <div className="space-y-4">
                {paragraphResults.map((para, index) => {
                  const humanProb = para.human_probability;

                  const isHuman = humanProb > 70;   // ✅ Correct threshold
                  const isAI = !isHuman;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${isAI
                          ? "bg-red-500/10 border-red-500"
                          : "bg-green-500/10 border-green-500"
                        }`}
                    >
                      <div className="text-xs mb-2 font-semibold flex justify-between">
                        <span>{isAI ? "AI Likely" : "Human Likely"}</span>
                        <span>{Math.max(para.ai_probability, para.human_probability)}%</span>
                      </div>

                      <p className="text-sm text-foreground leading-relaxed">
                        {para.text}
                      </p>
                    </div>
                  );
                })}


              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
