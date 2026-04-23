import React, { useState, useEffect } from "react";
import "./dashboard.css";
// import { useAuthStore } from "../store/useAuthStore";
// import { useNavigate } from "react-router-dom";
import ConnectGmailButton from "../components/ConnectGmailButton";
import FetchEmailsButton from "../components/FetchEmailsButton";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  RefreshCw,
  Download,
  List,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Sample data
const sampleData = {
  summary: {
    totalFeedback: 1247,
    positiveSentiment: 62,
    negativeSentiment: 28,
    neutralSentiment: 10,
    keyInsights: [
      "Customer satisfaction increased by 15% compared to last month",
      "Login issues have been reduced by 40% after recent update",
      "Payment processing concerns decreased significantly",
      "Feature requests for dark mode increased by 25%",
    ],
    improvements: [
      "Enhance mobile app performance based on 234 feedback entries",
      "Improve customer support response time (mentioned in 156 reviews)",
      "Add more payment gateway options (requested by 89 users)",
    ],
  },
  positivePoints: [
    { point: "Excellent user interface and smooth navigation", mentions: 342 },
    { point: "Fast loading times and responsive design", mentions: 289 },
    { point: "Helpful customer support team", mentions: 198 },
    { point: "Regular feature updates", mentions: 167 },
    { point: "Seamless integration with other tools", mentions: 152 },
  ],
  negativePoints: [
    { point: "Mobile app crashes occasionally", mentions: 145 },
    { point: "Payment gateway issues during checkout", mentions: 98 },
    { point: "Slow response time from support", mentions: 87 },
    { point: "Limited customization options", mentions: 64 },
    { point: "Lack of advanced reporting features", mentions: 56 },
  ],
  metrics: {
    satisfactionScore: 4.2,
    previousScore: 3.9,
    improvement: 7.7,
    responseTime: "2.4 hrs",
    previousResponseTime: "3.8 hrs",
    feedbackVolume: 1247,
    previousVolume: 986,
    trend: "up",
    history: {
      satisfaction: [3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2],
      responseTime: [4.2, 4.0, 3.8, 3.6, 3.4, 3.2, 2.8, 2.4],
      volume: [850, 900, 920, 950, 986, 1050, 1150, 1247],
    },
  },
  feedbackSources: {
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    sources: {
      twitter: [45, 52, 48, 61, 58, 67, 72, 68, 75, 82, 78, 85],
      playstore: [120, 135, 142, 156, 168, 175, 182, 195, 205, 218, 225, 235],
      appstore: [85, 92, 98, 105, 112, 118, 125, 132, 138, 145, 152, 160],
      email: [35, 42, 38, 45, 48, 52, 55, 58, 62, 65, 68, 72],
      customData: [28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65],
    },
  },
};

export default function DashboardPage() {
  const [lastFetchedTime, setLastFetchedTime] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetricTab, setActiveMetricTab] = useState("satisfaction");

  useEffect(() => {
    // Get last fetched time from localStorage or set initial time
    const savedTime = localStorage.getItem("lastFetchedTime");
    if (savedTime) {
      setLastFetchedTime(parseInt(savedTime, 10));
    }
    // Simulate initial data load
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setData(sampleData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleFetchData = async () => {
    setIsFetching(true);
    setIsLoading(true);

    // Check for connected apps
    const savedApps = localStorage.getItem("connectedApps");
    const connectedApps = savedApps ? JSON.parse(savedApps) : {};
    const connectedAppNames = Object.values(connectedApps)
      .filter((app) => app.isConnected)
      .map((app) => app.appName);

    if (connectedAppNames.length > 0) {
      toast.loading(`Fetching data...`);
    } else {
      toast.loading("Fetching latest feedback data...", { id: "fetching" });
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update with fresh data (in real app, this would come from API)
    setData(sampleData);
    const now = Date.now();
    setLastFetchedTime(now);
    localStorage.setItem("lastFetchedTime", now.toString());

    // Update sync time for connected apps
    if (Object.keys(connectedApps).length > 0) {
      const updatedApps = { ...connectedApps };
      Object.keys(updatedApps).forEach((key) => {
        if (updatedApps[key].isConnected) {
          updatedApps[key].lastSync = now;
        }
      });
      localStorage.setItem("connectedApps", JSON.stringify(updatedApps));
    }

    setIsFetching(false);
    setIsLoading(false);
    toast.success("Data fetched successfully!", { id: "fetching" });
  };

  const handleDownloadPDF = () => {
    toast.loading("Generating PDF report...", { id: "pdf" });
    // Simulate PDF generation
    setTimeout(() => {
      toast.success("PDF downloaded successfully!", { id: "pdf" });
    }, 2000);
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
        {/* Main Summary Widget */}
        <div className="dashboard-summary-widget">
          <div className="widget-header">
            <List className="widget-icon" />
            <div className="widget-title-section">
              <h3 className="widget-title">Summary</h3>
              <p className="widget-subtitle">
                Shows things to improve and overall feedback insights
              </p>
            </div>
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

        {/* Action Buttons Section */}
        <div className="dashboard-actions">
          <Button
            onClick={handleFetchData}
            disabled={isFetching}
            className="action-button fetch-button"
            variant="default"
          >
            <RefreshCw className={isFetching ? "spinning" : ""} />
            Fetch Data
          </Button>
          <div className="last-fetched">
            Last Fetched time → {getTimeAgo(lastFetchedTime)}
          </div>

          {/* Sentiment Distribution Matrix */}
          {isLoading ? (
            <GaugeSkeleton />
          ) : data ? (
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

          <Button
            onClick={handleDownloadPDF}
            className="action-button download-button"
            variant="outline"
          >
            <Download />
            Download as .pdf
          </Button>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="dashboard-widgets-row">
        {/* Positive Points Widget */}
        <div className="dashboard-widget-card">
          <div className="widget-card-header">
            <div className="widget-card-icon positive">
              <TrendingUp />
            </div>
            <div>
              <h4 className="widget-card-title">Positive Points</h4>
              <p className="widget-card-subtitle">as per feedback</p>
            </div>
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
            <div className="widget-card-icon negative">
              <TrendingDown />
            </div>
            <div>
              <h4 className="widget-card-title">Negative Points</h4>
              <p className="widget-card-subtitle">as per feedback</p>
            </div>
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
            <div className="widget-card-icon metrics">
              <BarChart3 />
            </div>
            <div>
              <h4 className="widget-card-title">Improvement Metrics</h4>
              <p className="widget-card-subtitle">
                metrics to visualize improvement from the last time
              </p>
            </div>
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

      {/* Feedback Sources Line Chart */}
      <div className="feedback-sources-chart">
        <div className="chart-header">
          <BarChart3 className="chart-icon" />
          <div>
            <h3 className="chart-title">Feedback Source Comparison</h3>
            <p className="chart-subtitle">Monthly feedback volume by source</p>
          </div>
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
    </div>
  );
}
