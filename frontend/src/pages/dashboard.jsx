import React, { useState, useEffect, useCallback } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import ConnectGmailButton from "../components/ConnectGmailButton";
import FetchEmailsButton from "../components/FetchEmailsButton";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";
import toast from "react-hot-toast";
import { LineChart } from "@mui/x-charts/LineChart";
import axiosInstance from "../lib/axios";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
import jsPDF from "jspdf";
import {
  RefreshCw,
  Download,
  Sparkles,
  Smile,
  Frown,
  Activity,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function DashboardPage() {
  const [lastFetchedTime, setLastFetchedTime] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetricTab, setActiveMetricTab] = useState("satisfaction");
  const { addNotification } = useNotificationStore();
  const { authUser } = useAuthStore();
  const hasNoData = !isLoading && (!data || data.summary.totalFeedback === 0);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // ── Page-load path: reads the last saved snapshot from DB (no LLM, no scraping) ──
  const loadCachedResult = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/dashboard/latest-result");
      if (res.data?.noData) {
        setData(null);
      } else {
        setData(res.data);
      }
    } catch (error) {
      console.error("Dashboard cache load error:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Button path: scrapes + LLM analysis, saves snapshot to DB ──
  const runFetchAndAnalyze = useCallback(
    async (skipScrape = false) => {
      try {
        const savedApps = localStorage.getItem("connectedApps");
        const connectedApps = savedApps ? JSON.parse(savedApps) : {};

        const savedProvider = localStorage.getItem("prysm_llm_provider") || "";
        const savedKey = localStorage.getItem("prysm_llm_key") || "";
        const savedUrl = localStorage.getItem("prysm_llm_local_url") || "";
        const savedModel = localStorage.getItem("prysm_llm_model") || "";

        const res = await axiosInstance.post(
          "/dashboard/fetch-and-analyze",
          {
            startDate,
            endDate,
            connectedApps,
            skipScraping: skipScrape,
          },
          {
            headers: {
              "X-LLM-Provider": savedProvider,
              "X-LLM-Key": savedKey,
              "X-LLM-Local-Url": savedUrl,
              "X-LLM-Model": savedModel,
            },
          },
        );

        setData(res.data);
        return res.data;
      } catch (error) {
        console.error("Fetch & Analyze Error:", error);
        toast.error("Failed to fetch fresh data");
        return null;
      }
    },
    [startDate, endDate],
  );

  useEffect(() => {
    const savedTime = localStorage.getItem("lastFetchedTime");
    if (savedTime) {
      setLastFetchedTime(parseInt(savedTime, 10));
    }
  }, []);

  // On mount / page refresh: only load the cached snapshot — no LLM, no tokens burned
  useEffect(() => {
    loadCachedResult();
  }, [loadCachedResult]);

  const handleFetchData = async () => {
    setIsFetching(true);
    toast.loading("Fetching latest feedback data...", { id: "fetching" });

    try {
      const result = await runFetchAndAnalyze(false);
      const now = Date.now();
      setLastFetchedTime(now);
      localStorage.setItem("lastFetchedTime", now.toString());

      const savedApps = localStorage.getItem("connectedApps");
      if (savedApps) {
        const connectedApps = JSON.parse(savedApps);
        Object.keys(connectedApps).forEach((key) => {
          if (connectedApps[key].isConnected) {
            connectedApps[key].lastSync = now;
          }
        });
        localStorage.setItem("connectedApps", JSON.stringify(connectedApps));
      }
      toast.success("Feedback synced successfully!", { id: "fetching" });

      // Trigger dynamic real-time notifications from the fetch results!
      if (result && result.summary) {
        const { summary, metrics } = result;

        // 1. System sync success
        addNotification({
          title: "Feedback Ingest Completed",
          description: `Ingested new updates. Analyzed ${summary.totalFeedback} feedbacks total. Sentiment is ${summary.positiveSentiment}% positive.`,
          category: "system",
        });

        // 2. Trend alert based on satisfaction score
        if (metrics && typeof metrics.satisfactionScore === "number") {
          addNotification({
            title: `Satisfaction Trend Alert`,
            description: `Overall satisfaction is ${metrics.satisfactionScore.toFixed(1)} / 5.0 (${metrics.improvement > 0 ? "+" : ""}${metrics.improvement}% change).`,
            category: "trend",
          });
        }

        // 3. Highlight top insight
        if (summary.keyInsights && summary.keyInsights[0]) {
          addNotification({
            title: "Top Trend Insight",
            description: summary.keyInsights[0],
            category: "trend",
          });
        }

        // 4. Warning alert if negative sentiment is high
        if (summary.negativeSentiment > 35) {
          addNotification({
            title: "Critical Feedback Surge",
            description: `Friction alert: ${summary.negativeSentiment}% of reviews carry negative sentiments. Top issue: ${summary.improvements?.[0] || "Needs attention"}.`,
            category: "alert",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch fresh reviews", { id: "fetching" });
    } finally {
      setIsFetching(false);
    }
  };


  const handleDownloadPDF = () => {
    if (!data) {
      toast.error("No data to export. Please fetch data first.");
      return;
    }

    toast.loading("Generating PDF report...", { id: "pdf" });
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const W = 210;
      const H = 297;
      const margin = 18;
      const contentW = W - margin * 2;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      const reportId = `RPT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${Math.floor(Math.random()*9000+1000)}`;

      // ── Helpers ──────────────────────────────────────────────
      let y = 0;
      const checkPage = (needed = 10) => {
        if (y + needed > H - 20) {
          addFooter();
          pdf.addPage();
          y = margin;
        }
      };

      const addFooter = () => {
        const footerY = H - 12;
        pdf.setDrawColor(204, 255, 0);
        pdf.setLineWidth(0.3);
        pdf.line(margin, footerY - 3, W - margin, footerY - 3);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont("helvetica", "normal");
        pdf.text("Confidential — Generated by Prysm AI Analytics Platform", margin, footerY);
        pdf.text(`Page ${pdf.getCurrentPageInfo().pageNumber}`, W - margin, footerY, { align: "right" });
        pdf.text(reportId, W / 2, footerY, { align: "center" });
      };

      const sectionHeader = (title) => {
        checkPage(14);
        y += 4;
        pdf.setFillColor(204, 255, 0);
        pdf.rect(margin, y, 3, 6, "F");
        pdf.setFontSize(11);
        pdf.setTextColor(10, 10, 10);
        pdf.setFont("helvetica", "bold");
        pdf.text(title.toUpperCase(), margin + 6, y + 4.5);
        y += 10;
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.2);
        pdf.line(margin, y, W - margin, y);
        y += 4;
      };

      const metricBox = (label, value, x, bw, color) => {
        pdf.setFillColor(...color);
        pdf.roundedRect(x, y, bw, 16, 2, 2, "F");
        pdf.setFontSize(7);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont("helvetica", "normal");
        pdf.text(label, x + bw / 2, y + 5, { align: "center" });
        pdf.setFontSize(13);
        pdf.setTextColor(10, 10, 10);
        pdf.setFont("helvetica", "bold");
        pdf.text(String(value), x + bw / 2, y + 13, { align: "center" });
      };

      const bulletList = (items, prefix, prefixColor) => {
        items.forEach((item) => {
          checkPage(12);
          const lines = pdf.splitTextToSize(item, contentW - 8);
          pdf.setFillColor(...prefixColor);
          pdf.circle(margin + 2, y + 2, 1.2, "F");
          pdf.setFontSize(9);
          pdf.setTextColor(40, 40, 40);
          pdf.setFont("helvetica", "normal");
          pdf.text(lines, margin + 6, y + 3.5);
          y += lines.length * 5 + 3;
        });
      };

      // ── PAGE 1: COVER ────────────────────────────────────────
      // Dark header band
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, W, 80, "F");

      // Lime accent stripe
      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 76, W, 4, "F");

      // Logo / brand name
      pdf.setFontSize(36);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("Prysm", margin, 38);

      pdf.setFontSize(9);
      pdf.setTextColor(204, 255, 0);
      pdf.setFont("helvetica", "normal");
      pdf.text("AI-POWERED FEEDBACK INTELLIGENCE", margin, 48);

      // Report title block
      y = 96;
      pdf.setFontSize(20);
      pdf.setTextColor(10, 10, 10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Dashboard Analytics Report", margin, y);
      y += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(90, 90, 90);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Timeframe: ${startDate} → ${endDate}`, margin, y);
      y += 14;

      // Info table
      const infoRows = [
        ["Report ID", reportId],
        ["Generated On", `${dateStr} at ${timeStr}`],
        ["Account", authUser?.fullName || authUser?.name || "—"],
        ["Email", authUser?.email || "—"],
        ["Total Feedbacks Analysed", String(data.summary.totalFeedback)],
      ];
      infoRows.forEach(([label, value]) => {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(margin, y, contentW, 8, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, margin + 3, y + 5.5);
        pdf.setTextColor(20, 20, 20);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, margin + 65, y + 5.5);
        y += 9;
      });

      // Disclaimer
      y += 8;
      pdf.setFontSize(7.5);
      pdf.setTextColor(140, 140, 140);
      pdf.setFont("helvetica", "italic");
      const disclaimer = pdf.splitTextToSize(
        "This report is auto-generated by the Prysm AI Analytics Platform. All insights are derived from aggregated user feedback data across connected channels. Data accuracy depends on the quality and volume of ingested reviews.",
        contentW
      );
      pdf.text(disclaimer, margin, y);
      y = H - 60;

      // Cover bottom band
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, H - 32, W, 32, "F");
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 120);
      pdf.text("Confidential — For authorised recipients only", margin, H - 18);
      pdf.setTextColor(204, 255, 0);
      pdf.text("getprysm.vercel.app", W - margin, H - 18, { align: "right" });

      // ── PAGE 2: SENTIMENT OVERVIEW ───────────────────────────
      pdf.addPage();
      y = margin;

      // Page top accent
      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 0, W, 3, "F");
      y = 12;

      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Prysm Dashboard Report  ·  ${dateStr}  ·  ${reportId}`, margin, y);
      y = margin + 4;

      sectionHeader("Sentiment Overview");

      // Three metric boxes
      const bw = (contentW - 8) / 3;
      metricBox("POSITIVE", `${data.summary.positiveSentiment}%`, margin, bw, [230, 255, 210]);
      metricBox("NEGATIVE", `${data.summary.negativeSentiment}%`, margin + bw + 4, bw, [255, 220, 220]);
      metricBox("NEUTRAL", `${data.summary.neutralSentiment}%`, margin + (bw + 4) * 2, bw, [240, 240, 240]);
      y += 22;

      // Sentiment bar chart
      const barData = [
        { label: "Positive", pct: data.summary.positiveSentiment, r: 34, g: 197, b: 94 },
        { label: "Negative", pct: data.summary.negativeSentiment, r: 239, g: 68, b: 68 },
        { label: "Neutral", pct: data.summary.neutralSentiment, r: 160, g: 160, b: 160 },
      ];
      barData.forEach(({ label, pct, r, g, b }) => {
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(label, margin, y + 4);
        pdf.setFillColor(235, 235, 235);
        pdf.roundedRect(margin + 28, y, contentW - 28 - 14, 5, 1, 1, "F");
        pdf.setFillColor(r, g, b);
        pdf.roundedRect(margin + 28, y, ((contentW - 28 - 14) * pct) / 100, 5, 1, 1, "F");
        pdf.setFontSize(7.5);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${pct}%`, W - margin, y + 4, { align: "right" });
        y += 10;
      });

      // Performance Metrics
      sectionHeader("Performance Metrics");
      const perfRows = [
        ["Satisfaction Score", `${data.metrics?.satisfactionScore ?? "—"} / 5.0`],
        ["Previous Score", `${data.metrics?.previousScore ?? "—"} / 5.0`],
        ["Improvement", `+${data.metrics?.improvement ?? 0}%`],
        ["Avg. Response Time", data.metrics?.responseTime ?? "—"],
        ["Feedback Volume", String(data.metrics?.feedbackVolume ?? data.summary.totalFeedback)],
      ];
      perfRows.forEach(([label, value], i) => {
        pdf.setFillColor(i % 2 === 0 ? 250 : 244, i % 2 === 0 ? 250 : 244, i % 2 === 0 ? 250 : 244);
        pdf.rect(margin, y, contentW, 7, "F");
        pdf.setFontSize(8.5);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(label, margin + 3, y + 5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(10, 10, 10);
        pdf.text(value, W - margin - 3, y + 5, { align: "right" });
        y += 8;
      });

      // ── PAGE 3: AI INSIGHTS ──────────────────────────────────
      pdf.addPage();
      y = margin;
      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 0, W, 3, "F");
      y = 12;
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Prysm Dashboard Report  ·  ${dateStr}  ·  ${reportId}`, margin, y);
      y = margin + 4;

      sectionHeader("Key Insights");
      bulletList(data.summary.keyInsights || [], "✓", [34, 197, 94]);

      sectionHeader("Areas to Improve");
      bulletList(data.summary.improvements || [], "→", [239, 68, 68]);

      sectionHeader("What's Working Well");
      if (data.positivePoints && data.positivePoints.length > 0) {
        data.positivePoints.forEach(({ point, mentions }) => {
          checkPage(12);
          const lines = pdf.splitTextToSize(point, contentW - 20);
          pdf.setFillColor(34, 197, 94);
          pdf.circle(margin + 2, y + 2, 1.2, "F");
          pdf.setFontSize(9);
          pdf.setTextColor(40, 40, 40);
          pdf.setFont("helvetica", "normal");
          pdf.text(lines, margin + 6, y + 3.5);
          pdf.setFontSize(7.5);
          pdf.setTextColor(120, 120, 120);
          pdf.text(`${mentions} mentions`, W - margin, y + 3.5, { align: "right" });
          y += lines.length * 5 + 3;
        });
      }

      sectionHeader("Needs Attention");
      if (data.negativePoints && data.negativePoints.length > 0) {
        data.negativePoints.forEach(({ point, mentions }) => {
          checkPage(12);
          const lines = pdf.splitTextToSize(point, contentW - 20);
          pdf.setFillColor(239, 68, 68);
          pdf.circle(margin + 2, y + 2, 1.2, "F");
          pdf.setFontSize(9);
          pdf.setTextColor(40, 40, 40);
          pdf.setFont("helvetica", "normal");
          pdf.text(lines, margin + 6, y + 3.5);
          pdf.setFontSize(7.5);
          pdf.setTextColor(120, 120, 120);
          pdf.text(`${mentions} mentions`, W - margin, y + 3.5, { align: "right" });
          y += lines.length * 5 + 3;
        });
      }

      // ── LAST PAGE: SIGNATURE / CERTIFICATION ─────────────────
      checkPage(80);
      sectionHeader("Report Certification");
      y += 4;
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont("helvetica", "normal");
      const certText = pdf.splitTextToSize(
        `This report was generated automatically by the Prysm AI Analytics engine on ${dateStr} at ${timeStr}. The data reflects feedback collected across all connected channels within the timeframe ${startDate} to ${endDate}. The analysis was performed using natural language processing models and is intended for internal product decision-making.`,
        contentW
      );
      pdf.text(certText, margin, y);
      y += certText.length * 5 + 10;

      // Signature block
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, margin + 70, y);
      pdf.line(margin + 100, y, margin + 170, y);
      y += 5;
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Authorised Account", margin, y);
      pdf.text("Prysm Platform", margin + 100, y);
      y += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(authUser?.fullName || authUser?.name || "—", margin, y);
      pdf.text("Prysm AI Engine v1.0", margin + 100, y);
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 120, 120);
      pdf.text(authUser?.email || "", margin, y);
      pdf.text(dateStr, margin + 100, y);

      // Bottom brand block
      y = H - 50;
      pdf.setFillColor(10, 10, 10);
      pdf.roundedRect(margin, y, contentW, 32, 3, 3, "F");
      pdf.setFontSize(20);
      pdf.setTextColor(204, 255, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Prysm", W / 2, y + 14, { align: "center" });
      pdf.setFontSize(7.5);
      pdf.setTextColor(160, 160, 160);
      pdf.setFont("helvetica", "normal");
      pdf.text("AI-Powered Feedback Intelligence · getprysm.vercel.app", W / 2, y + 21, { align: "center" });
      pdf.setTextColor(80, 80, 80);
      pdf.text(`© ${now.getFullYear()} Prysm. All rights reserved.`, W / 2, y + 27, { align: "center" });

      // Add footers to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let p = 2; p <= totalPages; p++) {
        pdf.setPage(p);
        addFooter();
      }

      pdf.save(`prysm-report-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}.pdf`);
      toast.success("PDF report downloaded!", { id: "pdf" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Never";
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 min ago";
    return `${minutes} mins ago`;
  };

  // Skeleton loader component
  const SkeletonLoader = ({ className = "" }) => (
    <div className={`skeleton-loader ${className}`}>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );

  // Gauge skeleton loader component
  const GaugeSkeleton = () => (
    <div className="gauge-skeleton">
      <div className="skeleton-gauge-circle"></div>
      <div className="skeleton-gauge-legend">
        <div className="skeleton-legend-item"></div>
        <div className="skeleton-legend-item"></div>
        <div className="skeleton-legend-item"></div>
      </div>
    </div>
  );

  // Mini area chart component
  const MiniAreaChart = ({ data, color = "#8b5cf6" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 200;
    const height = 80;
    const padding = 5;

    // Create SVG path for the area chart
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    const areaPath = `M ${padding},${height} L ${points[0]} ${points.map((p) => `L ${p}`).join(" ")} L ${width - padding},${height} Z`;
    const linePath = `M ${points.join(" L ")}`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="mini-area-chart">
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#gradient-${color})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-main-section">
        {/* Main Summary Widget or Onboarding Card */}
        {hasNoData ? (
          <div className="dashboard-onboarding-widget">
            <div className="onboarding-header">
              <Sparkles className="onboarding-icon text-brand" size={24} style={{ color: "#CCFF00" }} />
              <h3 className="onboarding-title">No Feedback Data Found</h3>
              <p className="onboarding-subtitle">
                Prysm hasn't ingested any feedback records for this timeframe yet. To start generating AI-driven sentiment insights, please connect an integration or upload a CSV file.
              </p>
            </div>

            <div className="onboarding-cards">
              <div className="onboarding-card">
                <div className="onboarding-card-header">
                  <div className="onboarding-card-icon-container">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-brand" style={{ color: "#CCFF00" }} xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                    </svg>
                  </div>
                  <h4 className="onboarding-card-title">Connect Apps</h4>
                </div>
                <p className="onboarding-card-desc">
                  Link live channels including App Store, Play Store, X (Twitter), or Gmail to scrape reviews in real-time.
                </p>
                <Link to="/connect-apps" className="onboarding-card-link">
                  Go to Connect Apps &rarr;
                </Link>
              </div>

              <div className="onboarding-card">
                <div className="onboarding-card-header">
                  <div className="onboarding-card-icon-container">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-brand" style={{ color: "#CCFF00" }} xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
                    </svg>
                  </div>
                  <h4 className="onboarding-card-title">Upload Custom Data</h4>
                </div>
                <p className="onboarding-card-desc">
                  Import any spreadsheet of customer logs or feedback surveys. Drag and drop a CSV file to preview and insert.
                </p>
                <Link to="/custom-data" className="onboarding-card-link">
                  Go to Custom Data &rarr;
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-summary-widget">
            <div className="widget-header">
              <Sparkles className="widget-icon neutral" size={20} />
              <h3 className="widget-title">AI Summary</h3>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : data ? (
              <div className="summary-content">
                <div className="insights-section">
                  <h4 className="section-title">Key Insights</h4>
                  <ul className="insights-list">
                    {data.summary.keyInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="improvements-section">
                  <h4 className="section-title">Areas to Improve</h4>
                  <ul className="improvements-list">
                    {data.summary.improvements.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No data available. Click "Fetch Data" to load feedback.</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="dashboard-actions">
          <div className="timeframe-picker">
            <div className="date-input-wrapper">
              <label className="date-label">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-picker-input"
              />
            </div>
            <div className="date-input-wrapper">
              <label className="date-label">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-picker-input"
              />
            </div>
          </div>

          <LiquidButton
            onClick={handleFetchData}
            disabled={isFetching}
            className="action-button fetch-button text-black font-bold tracking-wide rounded-xl border-none"
            variant="default"
            size="lg"
          >
            <RefreshCw
              className={isFetching ? "spinning mr-2 h-4 w-4" : "mr-2 h-4 w-4"}
            />
            Fetch Data
          </LiquidButton>
          <div className="last-fetched">
            Last Fetched time → {getTimeAgo(lastFetchedTime)}
          </div>

          {/* Sentiment Distribution Matrix */}
          {isLoading ? (
            <GaugeSkeleton />
          ) : data && !hasNoData ? (
            <>
              <div className="sentiment-matrix">
                <div className="matrix-label">Feedback Distribution</div>
                <div className="gauge-container">
                  <svg viewBox="0 0 200 120" className="gauge-chart">
                    {/* Background arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />

                    {/* Positive segment */}
                    <path
                      d={`M 20 100 A 80 80 0 0 1 ${20 + (160 * data.summary.positiveSentiment) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * data.summary.positiveSentiment) / 100 - 80, 2))}`}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeLinecap="round"
                      className="gauge-segment"
                    />

                    {/* Negative segment */}
                    <path
                      d={`M ${20 + (160 * data.summary.positiveSentiment) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * data.summary.positiveSentiment) / 100 - 80, 2))} A 80 80 0 0 1 ${20 + (160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100 - 80, 2))}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeLinecap="round"
                      className="gauge-segment"
                    />

                    {/* Neutral segment */}
                    <path
                      d={`M ${20 + (160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100 - 80, 2))} A 80 80 0 0 1 180 100`}
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="20"
                      strokeLinecap="round"
                      className="gauge-segment"
                    />

                    {/* Center text */}
                    <text
                      x="100"
                      y="85"
                      textAnchor="middle"
                      className="gauge-center-number"
                    >
                      {data.summary.totalFeedback}
                    </text>
                    <text
                      x="100"
                      y="105"
                      textAnchor="middle"
                      className="gauge-center-label"
                    >
                      Total Feedbacks
                    </text>
                  </svg>

                  {/* Legend */}
                  <div className="gauge-legend">
                    <div className="legend-item">
                      <span className="legend-dot positive"></span>
                      <span className="legend-text">
                        {data.summary.positiveSentiment}% Positive
                      </span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot negative"></span>
                      <span className="legend-text">
                        {data.summary.negativeSentiment}% Negative
                      </span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot neutral"></span>
                      <span className="legend-text">
                        {data.summary.neutralSentiment}% Neutral
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <LiquidButton
            onClick={handleDownloadPDF}
            className="action-button download-button text-white font-semibold tracking-wide border border-white/10 rounded-xl"
            variant="outline"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Download as .pdf
          </LiquidButton>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      {!hasNoData && (
        <div className="dashboard-widgets-row">
          {/* Positive Points Widget */}
          <div className="dashboard-widget-card">
            <div className="widget-card-header">
              <Smile className="widget-icon positive" size={20} />
              <h4 className="widget-card-title">What's Working</h4>
            </div>
            {isLoading ? (
              <SkeletonLoader className="card-skeleton" />
            ) : data ? (
              <div className="widget-card-content">
                <div className="points-list">
                  {data.positivePoints.map((item, idx) => (
                    <div key={idx} className="point-item">
                      <div className="point-header">
                        <CheckCircle2 size={14} className="point-icon positive" />
                        <span className="point-text">{item.point}</span>
                      </div>
                      <span className="point-mentions">
                        {item.mentions} mentions
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state-small">No data available</div>
            )}
          </div>

          {/* Negative Points Widget */}
          <div className="dashboard-widget-card">
            <div className="widget-card-header">
              <Frown className="widget-icon negative" size={20} />
              <h4 className="widget-card-title">Needs Attention</h4>
            </div>
            {isLoading ? (
              <SkeletonLoader className="card-skeleton" />
            ) : data ? (
              <div className="widget-card-content">
                <div className="points-list">
                  {data.negativePoints.map((item, idx) => (
                    <div key={idx} className="point-item">
                      <div className="point-header">
                        <XCircle size={14} className="point-icon negative" />
                        <span className="point-text">{item.point}</span>
                      </div>
                      <span className="point-mentions">
                        {item.mentions} mentions
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state-small">No data available</div>
            )}
          </div>

          {/* Metrics Widget */}
          <div className="dashboard-widget-card">
            <div className="widget-card-header">
              <Activity className="widget-icon metrics" size={20} />
              <h4 className="widget-card-title">Performance Metrics</h4>
            </div>
            {isLoading ? (
              <SkeletonLoader className="card-skeleton" />
            ) : data ? (
              <div className="widget-card-content">
                {/* Metric Tabs */}
                <div className="metric-tabs">
                  <button
                    className={`metric-tab ${activeMetricTab === "satisfaction" ? "active" : ""}`}
                    onClick={() => setActiveMetricTab("satisfaction")}
                  >
                    Satisfaction
                  </button>
                  <button
                    className={`metric-tab ${activeMetricTab === "response" ? "active" : ""}`}
                    onClick={() => setActiveMetricTab("response")}
                  >
                    Response Time
                  </button>
                  <button
                    className={`metric-tab ${activeMetricTab === "volume" ? "active" : ""}`}
                    onClick={() => setActiveMetricTab("volume")}
                  >
                    Volume
                  </button>
                </div>

                {/* Metric Content */}
                <div className="metric-content">
                  {activeMetricTab === "satisfaction" && (
                    <div className="metric-detail">
                      <div className="metric-info">
                        <div className="metric-header">
                          <span className="metric-label">Satisfaction Score</span>
                          {data.metrics.trend === "up" ? (
                            <ArrowUp size={14} className="trend-icon up" />
                          ) : (
                            <ArrowDown size={14} className="trend-icon down" />
                          )}
                        </div>
                        <div className="metric-values">
                          <span className="metric-current">
                            {data.metrics.satisfactionScore}
                          </span>
                          <span className="metric-previous">
                            / {data.metrics.previousScore}
                          </span>
                          <span className="metric-improvement positive">
                            +{data.metrics.improvement}%
                          </span>
                        </div>
                      </div>
                      <div className="metric-chart">
                        <MiniAreaChart
                          data={data.metrics.history.satisfaction}
                          color="#8b5cf6"
                        />
                      </div>
                    </div>
                  )}

                  {activeMetricTab === "response" && (
                    <div className="metric-detail">
                      <div className="metric-info">
                        <div className="metric-header">
                          <span className="metric-label">Avg. Response Time</span>
                          <ArrowDown size={14} className="trend-icon up" />
                        </div>
                        <div className="metric-values">
                          <span className="metric-current">
                            {data.metrics.responseTime}
                          </span>
                          <span className="metric-previous">
                            / {data.metrics.previousResponseTime}
                          </span>
                          <span className="metric-improvement positive">
                            Improved
                          </span>
                        </div>
                      </div>
                      <div className="metric-chart">
                        <MiniAreaChart
                          data={data.metrics.history.responseTime}
                          color="#22c55e"
                        />
                      </div>
                    </div>
                  )}

                  {activeMetricTab === "volume" && (
                    <div className="metric-detail">
                      <div className="metric-info">
                        <div className="metric-header">
                          <span className="metric-label">Feedback Volume</span>
                          <ArrowUp size={14} className="trend-icon up" />
                        </div>
                        <div className="metric-values">
                          <span className="metric-current">
                            {data.metrics.feedbackVolume}
                          </span>
                          <span className="metric-previous">
                            / {data.metrics.previousVolume}
                          </span>
                          <span className="metric-improvement positive">
                            +
                            {Math.round(
                              ((data.metrics.feedbackVolume -
                                data.metrics.previousVolume) /
                                data.metrics.previousVolume) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="metric-chart">
                        <MiniAreaChart
                          data={data.metrics.history.volume}
                          color="#3b82f6"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state-small">No data available</div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Sources Line Chart */}
      {!hasNoData && (
        <div className="feedback-sources-chart">
          <div className="chart-header">
            <Layers className="widget-icon neutral" size={20} />
            <h3 className="chart-title">Source Breakdown</h3>
          </div>
          {isLoading ? (
            <SkeletonLoader className="chart-skeleton" />
          ) : data ? (
            <div className="chart-container">
              <LineChart
                xAxis={[
                  {
                    data: data.feedbackSources.months,
                    scaleType: "point",
                  },
                ]}
                series={[
                  {
                    data: data.feedbackSources.sources.twitter,
                    label: "Twitter (X)",
                    color: "#1DA1F2",
                    curve: "catmullRom",
                    showMark: false,
                  },
                  {
                    data: data.feedbackSources.sources.playstore,
                    label: "Play Store",
                    color: "#34A853",
                    curve: "catmullRom",
                    showMark: false,
                  },
                  {
                    data: data.feedbackSources.sources.appstore,
                    label: "App Store",
                    color: "#007AFF",
                    curve: "catmullRom",
                    showMark: false,
                  },
                  {
                    data: data.feedbackSources.sources.email,
                    label: "Email",
                    color: "#EA4335",
                    curve: "catmullRom",
                    showMark: false,
                  },
                  {
                    data: data.feedbackSources.sources.customData,
                    label: "Custom Data (.csv)",
                    color: "#FBBC04",
                    curve: "catmullRom",
                    showMark: false,
                  },
                ]}
                height={400}
                margin={{ top: 20, right: 20, bottom: 30, left: 60 }}
                sx={{
                  "& .MuiLineElement-root": {
                    strokeWidth: 3,
                  },
                  "& .MuiChartsAxis-root": {
                    "& .MuiChartsAxis-line": {
                      stroke: "rgba(255, 255, 255, 0.2)",
                    },
                    "& .MuiChartsAxis-tick": {
                      stroke: "rgba(255, 255, 255, 0.2)",
                    },
                    "& .MuiChartsAxis-tickLabel": {
                      fill: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  "& .MuiChartsLegend-root": {
                    "& .MuiChartsLegend-label": {
                      fill: "rgba(255, 255, 255, 0.8)",
                    },
                  },
                  "& .MuiChartsGrid-line": {
                    stroke: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
          ) : (
            <div className="empty-state">No data available</div>
          )}
        </div>
      )}
    </div>
  );
}
