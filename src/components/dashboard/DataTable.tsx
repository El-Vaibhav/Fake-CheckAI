import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Download, Eye, GitCompareArrows, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Report } from "@/data/dashboardMock";
import api from "@/api/api";

interface Props {
  reports: Report[];
  externalSearchQuery?: string;
  onView: (report: Report) => void;
  onCompare: (report: Report) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DataTable({ reports, externalSearchQuery = "", onView, onCompare, onToggleFavorite, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "confidence">("date");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(externalSearchQuery);

    const trimmed = externalSearchQuery.trim();
    if (!trimmed) return;

    const hasMatch = reports.some((r) => [r.title, r.source, r.id].join(" ").toLowerCase().includes(trimmed.toLowerCase()));
    if (hasMatch) {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [externalSearchQuery, reports]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return reports
      .filter((r) => (typeFilter === "all" ? true : r.type === typeFilter))
      .filter((r) => [r.title, r.source, r.id].join(" ").toLowerCase().includes(q))
      .sort((a, b) =>
        sortBy === "date"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : b.confidence_score - a.confidence_score
      );
  }, [reports, query, typeFilter, sortBy]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const normalizedQuery = query.trim().toLowerCase();

  const highlightedRowId = normalizedQuery
    ? filtered.find((r) => [r.title, r.source, r.id].join(" ").toLowerCase().includes(normalizedQuery))?.id
    : null;

  const highlightedIndex = highlightedRowId ? filtered.findIndex((r) => r.id === highlightedRowId) : -1;

  useEffect(() => {
    if (highlightedIndex >= 0) {
      setPage(Math.floor(highlightedIndex / pageSize) + 1);
    } else {
      setPage(1);
    }
  }, [highlightedIndex]);

  const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);

  const badgeVariant = (type: Report["type"]) => {
    if (type === "fake") return "destructive"; // red
    if (type === "ai") return "outline"; // we'll custom style it
    if (type === "real") return "secondary"; // base for green
    if (type === "human") return "secondary";
    return "outline";
  };

  return (
    <Card ref={tableRef} className="rounded-2xl border-primary/15 dark:border-slate-800 shadow-sm bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d] animate-fade-in-up">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <CardTitle>Scan History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports..." className="w-full sm:w-64" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="fake">Fake</SelectItem>
                <SelectItem value="real">Real</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortBy(sortBy === "date" ? "confidence" : "date")}>
              <ArrowUpDown className="w-4 h-4 mr-2" /> Sort: {sortBy}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">
        {sliced.length === 0 ? (
          <div className="h-36 border border-dashed rounded-xl bg-gradient-to-br from-cyan-100/85 via-blue-100/85 to-purple-100/85 flex items-center justify-center text-muted-foreground">
            No reports found. Try changing filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliced.map((row) => (
                  <TableRow key={row.id} className={`bg-gradient-to-r from-cyan-50/30 to-purple-50/30 dark:from-slate-900/50 dark:to-slate-900/50 hover:bg-primary/5 dark:hover:bg-slate-800/50 transition-all duration-300 ${row.id === highlightedRowId ? "ring-2 ring-primary/60 bg-primary/10 dark:bg-slate-800/60" : ""}`}>
                    <TableCell className="min-w-72">
                      <p className="font-medium line-clamp-1">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.id}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={badgeVariant(row.type)}
                        className={`uppercase
    ${row.type === "fake" ? "bg-red-500 text-white" : ""}
    ${row.type === "ai" ? "bg-red-700 text-white" : ""}
    ${row.type === "real" ? "bg-green-600 text-white" : ""}
    ${row.type === "human" ? "bg-green-400 text-white" : ""}
  `}
                      >
                        {row.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.confidence_score}%</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onView(row)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onCompare(row)}><GitCompareArrows className="w-4 h-4" /></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            const loadingToast = toast.loading("Preparing report...");

                            try {
                              const response = await api.get(`/download-report/${row.id}`, {
                                responseType: "blob",
                              });

                              const blob = new Blob([response.data], {
                                type: "application/pdf",
                              });

                              const url = window.URL.createObjectURL(blob);

                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `report_${row.id}.pdf`;

                              document.body.appendChild(link);
                              link.click();

                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);

                              toast.success("Download started", {
                                id: loadingToast,
                              });

                            } catch (err) {
                              console.error(err);

                              toast.error("Failed to download report", {
                                id: loadingToast,
                              });
                            }
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(row.id)}><Star className={`w-4 h-4 ${row.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(row.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
