export type DetectionType = "fake" | "real" | "ai" | "human";

export type Report = {
  raw_date: string;
  id: string;
  title: string;
  content: string;
  type: DetectionType;
  confidence_score: number;
  source: "Twitter" | "News Site" | "Blog" | "Reddit";
  date: string;
  modelReason: string;
  flaggedKeywords: string[];
  tags: string[];
  exported: boolean;
  favorite: boolean;
};

// export const reports: Report[] = [
//   {
//     id: "RPT-1001",
//     title: "Viral Post Claims New Policy Bans All EV Chargers",
//     content:
//       "A highly shared post claims that all EV chargers are being removed nationwide by next month. Multiple official sources contradict this statement.",
//     type: "fake",
//     confidence_score: 92,
//     source: "Twitter",
//     date: "2026-04-18",
//     modelReason: "High sensational tone, contradictory entities, and clickbait phrase patterns.",
//     flaggedKeywords: ["bans all", "nationwide next month", "shocking truth"],
//     tags: ["policy", "transport"],
//     exported: true,
//     favorite: true,
//   },
//   {
//     id: "RPT-1002",
//     title: "City Council Approves New Affordable Housing Plan",
//     content:
//       "Coverage from multiple local outlets confirms details of the approved housing package and implementation timeline.",
//     type: "real",
//     confidence_score: 88,
//     source: "News Site",
//     date: "2026-04-16",
//     modelReason: "Neutral language, source overlap, and high factual consistency.",
//     flaggedKeywords: ["approved", "implementation timeline"],
//     tags: ["housing", "local"],
//     exported: false,
//     favorite: false,
//   },
//   {
//     id: "RPT-1003",
//     title: "AI-Written Market Recap Shared in Community Newsletter",
//     content:
//       "The recap displays low burstiness, repetitive structure, and smooth transitions often seen in generated text.",
//     type: "ai",
//     confidence_score: 85,
//     source: "Blog",
//     date: "2026-04-14",
//     modelReason: "Entropy and repetition ratio indicate AI-generated writing style.",
//     flaggedKeywords: ["in summary", "overall market", "consistently"],
//     tags: ["finance", "newsletter"],
//     exported: true,
//     favorite: false,
//   },
//   {
//     id: "RPT-1004",
//     title: "Forum Thread Misstates Election Deadlines",
//     content:
//       "Thread claims ballot deadlines are tomorrow, but official election board pages list dates next month.",
//     type: "fake",
//     confidence_score: 90,
//     source: "Reddit",
//     date: "2026-04-12",
//     modelReason: "Temporal contradiction and unsupported certainty language.",
//     flaggedKeywords: ["deadline tomorrow", "confirmed everywhere"],
//     tags: ["election", "civic"],
//     exported: false,
//     favorite: true,
//   },
//   {
//     id: "RPT-1005",
//     title: "Weekly Industry Digest with Uniform Sentence Cadence",
//     content:
//       "The digest appears polished but has statistically uniform sentence lengths and low lexical diversity.",
//     type: "ai",
//     confidence_score: 81,
//     source: "News Site",
//     date: "2026-04-10",
//     modelReason: "Stylometric profile aligns with generated content patterns.",
//     flaggedKeywords: ["notably", "in conclusion"],
//     tags: ["industry", "digest"],
//     exported: true,
//     favorite: false,
//   },
//   {
//     id: "RPT-1006",
//     title: "Health Advisory Correctly Summarized by Regional Outlet",
//     content:
//       "The article accurately reflects agency guidance and cites primary public-health documentation.",
//     type: "real",
//     confidence_score: 87,
//     source: "News Site",
//     date: "2026-04-08",
//     modelReason: "Consistent citation patterns and neutral framing.",
//     flaggedKeywords: ["agency guidance", "primary documentation"],
//     tags: ["health"],
//     exported: false,
//     favorite: false,
//   },
// ];

export const trendData = [
  { period: "Mon", fake: 12, ai: 8 },
  { period: "Tue", fake: 16, ai: 11 },
  { period: "Wed", fake: 14, ai: 9 },
  { period: "Thu", fake: 19, ai: 13 },
  { period: "Fri", fake: 22, ai: 15 },
  { period: "Sat", fake: 18, ai: 17 },
  { period: "Sun", fake: 15, ai: 16 },
];

export const pieData = [
  { name: "Real News", value: 41 },
  { name: "Fake News", value: 35 },
  { name: "AI Generated", value: 24 },
];

export const sourceBarData = [
  { source: "Twitter", detections: 38 },
  { source: "News Sites", detections: 29 },
  { source: "Blogs", detections: 22 },
  { source: "Reddit", detections: 15 },
];