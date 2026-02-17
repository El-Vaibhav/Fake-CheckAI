import { useState, useCallback } from "react";
import {
    Upload,
    Search,
    Loader2,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CrossVerifyResult = {
    highest_similarity: number;
    risk_level: string;
    sources: any[];
} | null;

export function CrossVerifyWorkspace() {
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<CrossVerifyResult>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const maxChars = 10000;
    const charCount = text.length;

    /* ===============================
       ANALYZE
    ================================ */
    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/cross-verify`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                }
            );

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Cross Verify Error:", error);
            alert("Cross verification failed.");
        } finally {
            setIsAnalyzing(false);
        }
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
        } if (file.type === "application/pdf") {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/extract-pdf`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data.text) {
                    setText(data.text.slice(0, maxChars));
                }
            } catch (err) {
                console.error("PDF extraction error:", err);
            }
        }



    }, []);

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
        }

        // ✅ PDF Handling (backend extraction)
        if (file.type === "application/pdf") {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/extract-pdf`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data.text) {
                    setText(data.text.slice(0, maxChars));
                } else {
                    alert("Failed to extract PDF text.");
                }
            } catch (err) {
                console.error("PDF extraction error:", err);
                alert("PDF extraction failed.");
            }
        }
    };
    const clearAll = () => {
        setText("");
        setFileName(null);
        setResult(null);
    };
    const handleDownloadPDF = async () => {
        if (!result) return;

        const reportPayload = {
            prediction: result.risk_level + " Similarity Risk",
            confidence: result.highest_similarity,
            credibility_score: 100 - result.highest_similarity,
            article_text: text,
            reasons: result.sources.map(
                (s: any) =>
                    `${s.title} (${s.similarity}% similarity)`
            ),
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/download-report`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reportPayload),
                }
            );

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "cross_verification_report.pdf";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("PDF download failed.");
        }
    };


    return (
        <section id="cross-workspace" className="py-24 relative">
            <div className="absolute inset-0 bg-muted/30" />

            <div className="container mx-auto px-4 relative z-10">

                {/* HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-6">
                        <Sparkles className="w-4 h-4" />
                        Cross-Source Verification
                    </div>

                    <h2 className="text-2xl lg:text-4xl font-semibold mb-4">
                        Verify Content Across the Web
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Compare your article against global news sources using semantic similarity intelligence.
                    </p>
                </div>

                {/* WORKSPACE CARD */}
                <div className="max-w-5xl mx-auto">
                    <div className="glass rounded-3xl p-8 shadow-2xl border border-border">

                        {/* TEXTAREA */}
                        <textarea
                            value={text}
                            onChange={(e) =>
                                setText(e.target.value.slice(0, maxChars))
                            }
                            placeholder="Paste article text here..."
                            className="w-full h-48 p-4 rounded-2xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none text-base"
                        />

                        <div className="text-xs text-muted-foreground text-right mt-2">
                            {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                        </div>

                        {/* DIVIDER */}
                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-sm text-muted-foreground">OR</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* UPLOAD */}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${isDragging
                                ? "border-accent bg-accent/5 scale-[1.02]"
                                : "border-border hover:border-accent/50 hover:bg-muted/40"
                                }`}
                        >
                            <input
                                type="file"
                                accept=".txt,.pdf"
                                onChange={handleFileInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                            <p className="font-medium mb-1">
                                Drag & drop your .pdf/.txt file here
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports .txt and .pdf files
                            </p>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
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
                                        Analyzing Sources...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Cross Verify
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

                        {/* INFO */}
                        <div className="flex items-start gap-3 mt-8 p-5 rounded-xl bg-muted/50 border border-border">
                            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                This tool compares semantic similarity between your text and live web articles.
                                It measures narrative overlap and contextual alignment.
                            </p>
                        </div>
                    </div>
                    {/* LOADING PANEL */}
                    {isAnalyzing && (
                        <div className="mt-16 max-w-3xl mx-auto text-center animate-fade-in-up">

                            <div className="glass rounded-3xl p-8 shadow-xl border border-border bg-gradient-to-br from-background to-muted/30">

                                {/* Spinner */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse" />
                                    </div>
                                </div>

                                {/* Main Message */}
                                <h3 className="text-lg font-semibold mb-3">
                                    Please wait while we analyze the news...
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    This usually takes 5–10 seconds as we are:
                                </p>

                                {/* Steps */}
                                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                                    <div>..Searching global news sources</div>
                                    <div>..Generating semantic embeddings</div>
                                    <div>..Comparing contextual similarity</div>
                                    <div>..Calculating credibility signals</div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ===============================
             RESULTS SECTION
          ================================ */}
                    {result && (
                        <div className="mt-20 space-y-12 animate-fade-in-up">

                            {/* SUMMARY CARD */}
                            <div className="relative overflow-hidden rounded-3xl p-12 shadow-2xl border border-border bg-gradient-to-br from-background to-muted/30">

                                <div className={`absolute inset-0 blur-3xl opacity-20 ${result.risk_level === "High"
                                    ? "bg-red-500"
                                    : result.risk_level === "Moderate"
                                        ? "bg-yellow-400"
                                        : "bg-green-500"
                                    }`} />

                                <div className="relative text-center">
                                    <div className="text-4xl font-extrabold mb-6 gradient-text">
                                        {result.highest_similarity}%
                                    </div>

                                    <div className="w-full max-w-xl mx-auto h-4 bg-muted rounded-full overflow-hidden mb-6">
                                        <div
                                            className={`h-full transition-all duration-1000 ${result.risk_level === "High"
                                                ? "bg-gradient-to-r from-red-500 to-red-700"
                                                : result.risk_level === "Moderate"
                                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                                    : "bg-gradient-to-r from-green-400 to-green-600"
                                                }`}
                                            style={{ width: `${result.highest_similarity}%` }}
                                        />
                                    </div>

                                    <span
                                        className={`px-5 py-2 rounded-full text-sm font-semibold ${result.risk_level === "High"
                                            ? "bg-red-500/10 text-red-500 border border-red-500/40"
                                            : result.risk_level === "Moderate"
                                                ? "bg-yellow-400/10 text-yellow-500 border border-yellow-400/40"
                                                : "bg-green-500/10 text-green-500 border border-green-500/40"
                                            }`}
                                    >
                                        {result.risk_level} Similarity Risk
                                    </span>
                                </div>
                            </div>
                            {/* DOWNLOAD BUTTON */}
                            <div className="text-center mt-8">
                                <Button
                                    variant="hero"
                                    size="xl"
                                    onClick={handleDownloadPDF}
                                >
                                    Download Verification Report
                                </Button>
                            </div>
                            
                            {/* SOURCE CARDS */}
                            <div className="space-y-10">
                                {(result?.sources || []).map((source: any, index: number) => {
                                    const domain = new URL(source.url).hostname;

                                    return (
                                        <div
                                            key={index}
                                            className="group relative rounded-3xl p-8 shadow-xl border border-border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="grid grid-cols-[1fr_auto] gap-6 items-start">

                                                <div>
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base font-semibold text-primary hover:underline break-all"
                                                    >
                                                        {source.title}
                                                    </a>

                                                    <div className="text-xs text-muted-foreground mt-2 break-all">
                                                        {source.url}
                                                    </div>

                                                    <div className="mt-3 inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30">
                                                        {domain}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">
                                                        {source.similarity}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Similarity
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 h-3 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                                                    style={{ width: `${source.similarity}%` }}
                                                />
                                            </div>

                                            {source.matched_sentences?.length > 0 && (
                                                <div className="mt-6 space-y-4">
                                                    {(source.matched_sentences || []).map(

                                                        (match: any, i: number) => (
                                                            <div
                                                                key={i}
                                                                className="rounded-xl p-3 bg-muted/40 border border-border text-sm"
                                                            >
                                                                <div className="font-medium text-primary mb-1">
                                                                    Matched Segment ({match.similarity}%)
                                                                </div>
                                                                <div className="leading-relaxed">
                                                                    {match.input_sentence}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
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
