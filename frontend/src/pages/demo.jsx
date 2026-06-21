import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";
import toast from "react-hot-toast";
import { LineChart } from "@mui/x-charts/LineChart";
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
  Target,
} from "lucide-react";

const FETCH_STATUSES = [
  "Initializing feedback connectors...",
  "Contacting App Store & Play Store APIs...",
  "Ingesting reviews and feedback streams...",
  "Aggregating recent feedback data...",
  "Engaging AI Sentiment Analytics Engine...",
  "Processing sentiment classification...",
  "Extracting key positive insights...",
  "Identifying areas that need improvement...",
  "Finalizing dashboard analysis report...",
];

const MOCK_DATA = {
  summary: {
    totalFeedback: 248,
    positiveSentiment: 68,
    negativeSentiment: 18,
    neutralSentiment: 14,
    keyInsights: [
      "Users highly praise the new offline mode reliability and speed.",
      "Dark theme enhancements have improved readability in low-light environments.",
      "Minor styling inconsistencies were reported on the Settings page."
    ],
    improvements: [
      "Optimize battery consumption during high-frequency real-time updates.",
      "Address app-crashing issues reported by users on older Android versions.",
      "Refine transition animations to prevent occasional interface flickering."
    ]
  },
  metrics: {
    satisfactionScore: 4.3,
    previousScore: 3.9,
    improvement: 10.2,
    responseTime: "1.8h",
    previousResponseTime: "2.5h",
    feedbackVolume: 248,
    previousVolume: 210,
    trend: "up",
    history: {
      satisfaction: [3.9, 4.0, 4.1, 4.2, 4.3],
      responseTime: [2.5, 2.3, 2.1, 1.9, 1.8],
      volume: [210, 220, 230, 240, 248]
    }
  },
  positivePoints: [
    { point: "Seamless synchronization across multi-platform desktop client.", mentions: 45 },
    { point: "Extremely responsive custom charts and visualization tools.", mentions: 32 },
    { point: "Intuitive App Store integration setup and configuration wizard.", mentions: 28 }
  ],
  negativePoints: [
    { point: "Intermittent connection dropouts when authenticating with Gmail API.", mentions: 12 },
    { point: "Slow load times when querying extensive history datasets.", mentions: 9 },
    { point: "Missing sorting filter options on custom data upload screen.", mentions: 6 }
  ],
  feedbackSources: {
    months: ["Feb", "Mar", "Apr", "May", "Jun"],
    sources: {
      twitter: [45, 52, 60, 58, 65],
      playstore: [30, 35, 42, 48, 55],
      appstore: [55, 62, 70, 72, 80],
      email: [25, 30, 32, 40, 48]
    }
  }
};

export default function DemoDashboardPage() {
  const [lastFetchedTime, setLastFetchedTime] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data] = useState(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetricTab, setActiveMetricTab] = useState("satisfaction");
  const { addNotification } = useNotificationStore();
  const { authUser } = useAuthStore();
  
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchStatusIndex, setFetchStatusIndex] = useState(0);

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync last fetched time with local storage
  useEffect(() => {
    const savedTime = localStorage.getItem("demo_lastFetchedTime");
    if (savedTime) {
      setLastFetchedTime(parseInt(savedTime, 10));
    } else {
      const defaultTime = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
      setLastFetchedTime(defaultTime);
    }
  }, []);

  // Fetch progress bar interval
  useEffect(() => {
    let interval;
    if (isFetching) {
      setFetchProgress(0);
      setFetchStatusIndex(0);
      interval = setInterval(() => {
        setFetchProgress((prev) => {
          if (prev >= 99) return 99;

          let increment = 1;
          if (prev < 35) increment = 12;
          else if (prev < 65) increment = 8;
          else if (prev < 85) increment = 5;
          else if (prev < 95) increment = 3;

          const nextVal = prev + increment;

          const statusStep = Math.floor(
            (nextVal / 100) * FETCH_STATUSES.length
          );
          setFetchStatusIndex(Math.min(statusStep, FETCH_STATUSES.length - 1));

          return Math.min(nextVal, 99);
        });
      }, 300); // Shorter duration for smoother demo fetch
    } else {
      setFetchProgress(0);
      setFetchStatusIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFetching]);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const handleFetchData = async () => {
    setIsFetching(true);
    toast.loading("Fetching latest feedback data...", { id: "fetching" });

    // Simulate async network request
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const now = Date.now();
      setLastFetchedTime(now);
      localStorage.setItem("demo_lastFetchedTime", now.toString());

      toast.success("Feedback synced successfully! (DEMO)", { id: "fetching" });

      // Trigger demo real-time notifications
      addNotification({
        title: "Feedback Ingest Completed (DEMO)",
        description: `Ingested new updates. Analyzed ${data.summary.totalFeedback} feedbacks total. Sentiment is ${data.summary.positiveSentiment}% positive.`,
        category: "system",
      });

      addNotification({
        title: `Satisfaction Trend Alert (DEMO)`,
        description: `Overall satisfaction is ${data.metrics.satisfactionScore.toFixed(1)} / 5.0 (+${data.metrics.improvement}% change).`,
        category: "trend",
      });

      if (data.summary.keyInsights && data.summary.keyInsights[0]) {
        addNotification({
          title: "Top Trend Insight (DEMO)",
          description: data.summary.keyInsights[0],
          category: "trend",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch fresh reviews", { id: "fetching" });
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownloadPDF = () => {
    toast.loading("Generating PDF report...", { id: "pdf" });
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const W = 210;
      const H = 297;
      const margin = 18;
      const contentW = W - margin * 2;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const reportId = `DEMO-RPT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

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
        pdf.text(
          "Confidential — Generated by Prysm AI Analytics Platform (Demo Mode)",
          margin,
          footerY
        );
        pdf.text(
          `Page ${pdf.getCurrentPageInfo().pageNumber}`,
          W - margin,
          footerY,
          { align: "right" }
        );
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

      // PAGE 1: COVER
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, W, 80, "F");

      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 76, W, 4, "F");

      pdf.setFontSize(36);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("Prysm", margin, 38);

      pdf.setFontSize(9);
      pdf.setTextColor(204, 255, 0);
      pdf.setFont("helvetica", "normal");
      pdf.text("AI-POWERED FEEDBACK INTELLIGENCE (DEMO)", margin, 48);

      y = 96;
      pdf.setFontSize(20);
      pdf.setTextColor(10, 10, 10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Dashboard Analytics Report (Demo)", margin, y);
      y += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(90, 90, 90);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Timeframe: ${startDate} → ${endDate}`, margin, y);
      y += 14;

      const currentUser = {
        fullName: authUser?.fullName || "Demo Guest",
        email: authUser?.email || "guest@prysm.demo",
      };

      const infoRows = [
        ["Report ID", reportId],
        ["Generated On", `${dateStr} at ${timeStr}`],
        ["Account", currentUser.fullName],
        ["Email", currentUser.email],
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

      y += 8;
      pdf.setFontSize(7.5);
      pdf.setTextColor(140, 140, 140);
      pdf.setFont("helvetica", "italic");
      const disclaimer = pdf.splitTextToSize(
        "This report is generated inside the Prysm Demo Mode. Data shown is synthesized for preview purposes and does not represent real-time integration analysis.",
        contentW
      );
      pdf.text(disclaimer, margin, y);
      y = H - 60;

      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, H - 32, W, 32, "F");
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 120);
      pdf.text("Confidential — For demo evaluation only", margin, H - 18);
      pdf.setTextColor(204, 255, 0);
      pdf.text("getprysm.vercel.app", W - margin, H - 18, { align: "right" });

      // PAGE 2: SENTIMENT OVERVIEW
      pdf.addPage();
      y = margin;
      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 0, W, 3, "F");
      y = 12;

      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Prysm Dashboard Report  ·  ${dateStr}  ·  ${reportId}`,
        margin,
        y
      );
      y = margin + 4;

      sectionHeader("Sentiment Overview");

      const bw = (contentW - 8) / 3;
      metricBox(
        "POSITIVE",
        `${data.summary.positiveSentiment}%`,
        margin,
        bw,
        [230, 255, 210]
      );
      metricBox(
        "NEGATIVE",
        `${data.summary.negativeSentiment}%`,
        margin + bw + 4,
        bw,
        [255, 220, 220]
      );
      metricBox(
        "NEUTRAL",
        `${data.summary.neutralSentiment}%`,
        margin + (bw + 4) * 2,
        bw,
        [240, 240, 240]
      );
      y += 22;

      const barData = [
        { label: "Positive", pct: data.summary.positiveSentiment, r: 34, g: 197, b: 94 },
        { label: "Negative", pct: data.summary.negativeSentiment, r: 239, g: 68, b: 68 },
        { label: "Neutral", pct: data.summary.neutralSentiment, r: 160, g: 160, b: 160 }
      ];
      barData.forEach(({ label, pct, r, g, b }) => {
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(label, margin, y + 4);
        pdf.setFillColor(235, 235, 235);
        pdf.roundedRect(margin + 28, y, contentW - 28 - 14, 5, 1, 1, "F");
        pdf.setFillColor(r, g, b);
        pdf.roundedRect(
          margin + 28,
          y,
          ((contentW - 28 - 14) * pct) / 100,
          5,
          1,
          1,
          "F"
        );
        pdf.setFontSize(7.5);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${pct}%`, W - margin, y + 4, { align: "right" });
        y += 10;
      });

      sectionHeader("Performance Metrics");
      const perfRows = [
        ["Satisfaction Score", `${data.metrics.satisfactionScore} / 5.0`],
        ["Previous Score", `${data.metrics.previousScore} / 5.0`],
        ["Improvement", `+${data.metrics.improvement}%`],
        ["Avg. Response Time", data.metrics.responseTime],
        ["Feedback Volume", String(data.metrics.feedbackVolume)],
      ];
      perfRows.forEach(([label, value], i) => {
        pdf.setFillColor(
          i % 2 === 0 ? 250 : 244,
          i % 2 === 0 ? 250 : 244,
          i % 2 === 0 ? 250 : 244
        );
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

      checkPage(55);
      sectionHeader("Connection & Sync Matrix");

      const sumArray = (arr) =>
        Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0;

      const matrixRows = [
        {
          source: "Gmail (Demo)",
          account: currentUser.email,
          volume: sumArray(data.feedbackSources.sources.email),
        },
        {
          source: "Play Store (Demo)",
          account: "com.nexus.app.demo",
          volume: sumArray(data.feedbackSources.sources.playstore),
        },
        {
          source: "App Store (Demo)",
          account: "id123456789 (Prysm Pro)",
          volume: sumArray(data.feedbackSources.sources.appstore),
        },
        {
          source: "Twitter / X (Demo)",
          account: "@nexus_insights",
          volume: sumArray(data.feedbackSources.sources.twitter),
        },
      ];

      pdf.setFillColor(10, 10, 10);
      pdf.rect(margin, y, contentW, 8, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("SOURCE / CHANNEL", margin + 3, y + 5.5);
      pdf.text("CONNECTED ACCOUNT / IDENTIFIER", margin + 43, y + 5.5);
      pdf.text("VOLUME", margin + 137, y + 5.5);
      y += 9;

      matrixRows.forEach((row, i) => {
        pdf.setFillColor(
          i % 2 === 0 ? 250 : 244,
          i % 2 === 0 ? 250 : 244,
          i % 2 === 0 ? 250 : 244
        );
        pdf.rect(margin, y, contentW, 8, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(row.source, margin + 3, y + 5.5);
        pdf.text(row.account, margin + 43, y + 5.5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(10, 10, 10);
        pdf.text(String(row.volume), margin + 137, y + 5.5);
        y += 9;
      });
      y += 5;

      // PAGE 3: AI INSIGHTS
      pdf.addPage();
      y = margin;
      pdf.setFillColor(204, 255, 0);
      pdf.rect(0, 0, W, 3, "F");
      y = 12;
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Prysm Dashboard Report  ·  ${dateStr}  ·  ${reportId}`,
        margin,
        y
      );
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

      // STRATEGIC PRIORITY MATRIX
      checkPage(80);
      sectionHeader("Strategic Priority Matrix");

      const quadrants = [
        {
          label: "Immediate Fix",
          labelColor: [239, 68, 68],
          bgColor: [255, 240, 240],
          text: data.negativePoints?.[0]?.point
            ? `Resolve issues with: ${data.negativePoints[0].point}`
            : "No critical negative friction points detected.",
          meta: `High Urgency · ${data.negativePoints?.[0]?.mentions || 0} Mentions`,
        },
        {
          label: "Growth Lever",
          labelColor: [120, 170, 0],
          bgColor: [245, 255, 220],
          text: data.positivePoints?.[0]?.point
            ? `Promote and enhance: ${data.positivePoints[0].point}`
            : "Build customer advocacy around recent updates.",
          meta: `High Impact · ${data.positivePoints?.[0]?.mentions || 0} Mentions`,
        },
        {
          label: "Quick Win",
          labelColor: [37, 99, 235],
          bgColor: [235, 245, 255],
          text: data.summary.improvements?.[0]
            ? `Address: ${data.summary.improvements[0]}`
            : "Conduct lightweight UI polishing and performance tune-ups.",
          meta: "Medium Urgency · Low Effort",
        },
        {
          label: "Strategic Monitor",
          labelColor: [80, 80, 80],
          bgColor: [245, 245, 245],
          text: "Demo evaluation: capture user feature queries and reviews.",
          meta: "Continuous Assessment",
        },
      ];

      const qW = (contentW - 6) / 2;
      const qH = 36;

      for (let row = 0; row < 2; row++) {
        checkPage(qH + 6);
        for (let col = 0; col < 2; col++) {
          const q = quadrants[row * 2 + col];
          const qX = margin + col * (qW + 6);
          const qY = y;

          pdf.setFillColor(...q.bgColor);
          pdf.roundedRect(qX, qY, qW, qH, 2, 2, "F");

          pdf.setFillColor(...q.labelColor);
          pdf.rect(qX, qY, 2.5, qH, "F");

          pdf.setFontSize(7);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...q.labelColor);
          pdf.text(q.label.toUpperCase(), qX + 6, qY + 7);

          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(30, 30, 30);
          const bodyLines = pdf.splitTextToSize(q.text, qW - 10);
          pdf.text(bodyLines.slice(0, 2), qX + 6, qY + 14);

          pdf.setFontSize(6.5);
          pdf.setTextColor(100, 100, 100);
          pdf.text(q.meta, qX + 6, qY + qH - 5);
        }
        y += qH + 5;
      }
      y += 4;

      // LAST PAGE: CERTIFICATION
      checkPage(80);
      sectionHeader("Report Certification");
      y += 4;
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont("helvetica", "normal");
      const certText = pdf.splitTextToSize(
        `This report was generated in DEMO mode by the Prysm feedback visualizer system on ${dateStr} at ${timeStr}. The analysis contains synthetic evaluation values.`,
        contentW
      );
      pdf.text(certText, margin, y);
      y += certText.length * 5 + 10;

      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, margin + 70, y);
      pdf.line(margin + 100, y, margin + 170, y);
      y += 5;
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Demo User", margin, y);
      pdf.text("Prysm Platform", margin + 100, y);
      y += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(currentUser.fullName, margin, y);
      pdf.text("Prysm AI Engine v1.0 (Demo)", margin + 100, y);
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 120, 120);
      pdf.text(currentUser.email, margin, y);
      pdf.text(dateStr, margin + 100, y);

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
      pdf.text(
        "AI-Powered Feedback Intelligence (Demo Mode) · getprysm.vercel.app",
        W / 2,
        y + 21,
        { align: "center" }
      );
      pdf.setTextColor(80, 80, 80);
      pdf.text(
        `© ${now.getFullYear()} Prysm. All rights reserved.`,
        W / 2,
        y + 27,
        { align: "center" }
      );

      const totalPages = pdf.getNumberOfPages();
      for (let p = 2; p <= totalPages; p++) {
        pdf.setPage(p);
        addFooter();
      }

      pdf.save(
        `prysm-demo-report-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.pdf`
      );
      toast.success("PDF report downloaded! (DEMO)", { id: "pdf" });
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

  const SkeletonLoader = ({ className = "" }) => (
    <div className={`skeleton-loader ${className}`}>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );

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

  const MiniAreaChart = ({ data, color = "#8b5cf6" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 80;
    const padding = 5;

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
      {isFetching && (
        <div className="fetch-overlay-container">
          <div className="fetch-overlay-content">
            <div
              aria-label="Orange and tan hamster running in a metal wheel"
              role="img"
              className="wheel-and-hamster"
            >
              <div className="wheel"></div>
              <div className="hamster">
                <div className="hamster__body">
                  <div className="hamster__head">
                    <div className="hamster__ear"></div>
                    <div className="hamster__eye"></div>
                    <div className="hamster__nose"></div>
                  </div>
                  <div className="hamster__limb hamster__limb--fr"></div>
                  <div className="hamster__limb hamster__limb--fl"></div>
                  <div className="hamster__limb hamster__limb--br"></div>
                  <div className="hamster__limb hamster__limb--bl"></div>
                  <div className="hamster__tail"></div>
                </div>
              </div>
              <div className="spoke"></div>
            </div>
            <div className="fetch-overlay-text-wrapper">
              <div className="fetch-status-text">
                {FETCH_STATUSES[fetchStatusIndex]}
              </div>
              <div className="fetch-progress-wrap">
                <div className="fetch-progress-bar">
                  <div
                    className="fetch-progress-fill"
                    style={{ width: `${fetchProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-section">
        <div className="dashboard-left-column">
          <div className="dashboard-summary-widget">
            <div className="widget-header">
              <Sparkles className="widget-icon neutral" size={20} />
              <h3 className="widget-title">AI Summary (Demo)</h3>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : (
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
            )}
          </div>

          {/* Strategic Priority & Action Matrix Widget */}
          <div className="dashboard-action-matrix-widget">
            <div className="widget-header">
              <Target
                className="widget-icon positive"
                size={20}
                style={{ color: "#CCFF00" }}
              />
              <h3 className="widget-title">Strategic Priority Matrix</h3>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="matrix-quadrants">
                <div className="matrix-quadrant critical">
                  <div className="quadrant-badge">Immediate Fix</div>
                  <p className="quadrant-text">
                    Resolve issues with: {data.negativePoints[0].point}
                  </p>
                  <div className="quadrant-meta">
                    High Urgency · {data.negativePoints[0].mentions} Mentions
                  </div>
                </div>

                <div className="matrix-quadrant leverage">
                  <div className="quadrant-badge">Growth Lever</div>
                  <p className="quadrant-text">
                    Promote and enhance: {data.positivePoints[0].point}
                  </p>
                  <div className="quadrant-meta">
                    High Impact · {data.positivePoints[0].mentions} Mentions
                  </div>
                </div>

                <div className="matrix-quadrant quick-win">
                  <div className="quadrant-badge">Quick Win</div>
                  <p className="quadrant-text">
                    Address recommendation: {data.summary.improvements[0]}
                  </p>
                  <div className="quadrant-meta">
                    Medium Urgency · Low Effort
                  </div>
                </div>

                <div className="matrix-quadrant monitor">
                  <div className="quadrant-badge">Strategic Monitor</div>
                  <p className="quadrant-text">
                    Sentiment is healthy. Capture long-tail feature requests for the roadmap.
                  </p>
                  <div className="quadrant-meta">Continuous Assessment</div>
                </div>
              </div>
            )}
          </div>
        </div>

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
          ) : (
            <div className="sentiment-matrix">
              <div className="matrix-label">Feedback Distribution</div>
              <div className="gauge-container">
                <svg viewBox="0 0 200 120" className="gauge-chart">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />

                  <path
                    d={`M 20 100 A 80 80 0 0 1 ${20 + (160 * data.summary.positiveSentiment) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * data.summary.positiveSentiment) / 100 - 80, 2))}`}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="gauge-segment"
                  />

                  <path
                    d={`M ${20 + (160 * data.summary.positiveSentiment) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * data.summary.positiveSentiment) / 100 - 80, 2))} A 80 80 0 0 1 ${20 + (160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100 - 80, 2))}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="gauge-segment"
                  />

                  <path
                    d={`M ${20 + (160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100} ${100 - Math.sqrt(6400 - Math.pow((160 * (data.summary.positiveSentiment + data.summary.negativeSentiment)) / 100 - 80, 2))} A 80 80 0 0 1 180 100`}
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="gauge-segment"
                  />

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
          )}

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
      <div className="dashboard-widgets-row">
        {/* Positive Points Widget */}
        <div className="dashboard-widget-card">
          <div className="widget-card-header">
            <Smile className="widget-icon positive" size={20} />
            <h4 className="widget-card-title">What's Working</h4>
          </div>
          {isLoading ? (
            <SkeletonLoader className="card-skeleton" />
          ) : (
            <div className="widget-card-content">
              <div className="points-list">
                {data.positivePoints.map((item, idx) => (
                  <div key={idx} className="point-item">
                    <div className="point-header">
                      <CheckCircle2
                        size={14}
                        className="point-icon positive"
                      />
                      <span className="point-text">{item.point}</span>
                    </div>
                    <span className="point-mentions">
                      {item.mentions} mentions
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
          ) : (
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
          ) : (
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
                        <span className="metric-label">
                          Satisfaction Score
                        </span>
                        <ArrowUp size={14} className="trend-icon up" />
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
                        <span className="metric-label">
                          Avg. Response Time
                        </span>
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
                              100
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
          )}
        </div>
      </div>

      {/* Feedback Sources Line Chart */}
      <div className="feedback-sources-chart">
        <div className="chart-header">
          <Layers className="widget-icon neutral" size={20} />
          <h3 className="chart-title">Source Breakdown (Demo)</h3>
        </div>
        {isLoading ? (
          <SkeletonLoader className="chart-skeleton" />
        ) : (
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
                "& .MuiChartsLegend-root text": {
                  fill: "#ffffff !important",
                },
                "& .MuiChartsLegend-label": {
                  fill: "#ffffff !important",
                },
                "& .MuiChartsGrid-line": {
                  stroke: "rgba(255, 255, 255, 0.1)",
                },
              }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
