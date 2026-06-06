import React, { useEffect, useState } from "react";
import "./history.css";
import axios from "../lib/axios";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  FileText
} from "lucide-react";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await axios.get("/dashboard/history");
        setItems(resp.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCard(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDateRange = (start, end) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${new Date(start).toLocaleDateString(undefined, options)} - ${new Date(end).toLocaleDateString(undefined, options)}`;
  };

  const topCounts = {
    sessions: items.length,
    totalFeedback: items.reduce((acc, it) => acc + (it.totalFeedback || 0), 0),
    avgSatisfaction: items.length > 0 
      ? (items.reduce((acc, it) => acc + (it.satisfactionScore || 0), 0) / items.length).toFixed(1)
      : "0.0"
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1 className="page-title">Analysis History</h1>
        <p className="page-subtitle">Historical records of your feedback processing runs and AI analysis summaries.</p>
      </div>

      <div className="history-grid">
        <div className="cards-row">
          <div className="stat-card">Runs Saved: <strong>{topCounts.sessions}</strong></div>
          <div className="stat-card">Total Feedbacks Analyzed: <strong>{topCounts.totalFeedback}</strong></div>
          <div className="stat-card">Average Satisfaction: <strong>{topCounts.avgSatisfaction} / 5.0</strong></div>
        </div>

        <div className="history-list">
          {loading && (
            <div className="skeleton-container">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          )}
          
          {!loading && items.length === 0 && (
            <div className="empty-state-card">
              <FileText className="empty-icon" size={48} />
              <p className="empty-title">No Analysis History Found</p>
              <p className="empty-desc">Run a fetch on the Dashboard page to save your first feedback summary run.</p>
            </div>
          )}

          {!loading && items.map((it) => {
            const isExpanded = !!expandedCard[it._id];
            
            return (
              <div key={it._id} className={`history-card-item ${isExpanded ? 'expanded' : ''}`}>
                <div className="card-main-header" onClick={() => toggleExpand(it._id)}>
                  <div className="header-left">
                    <Calendar className="calendar-icon" size={20} />
                    <div className="timeframe-info">
                      <span className="timeframe-dates">{formatDateRange(it.startDate, it.endDate)}</span>
                      <span className="run-timestamp">Analyzed on: {new Date(it.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="header-right">
                    <div className="mini-stat-group">
                      <div className="mini-stat">
                        <span className="mini-val">{it.totalFeedback}</span>
                        <span className="mini-lbl">Volume</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-val text-primary">{it.satisfactionScore.toFixed(1)}</span>
                        <span className="mini-lbl">Satisfaction</span>
                      </div>
                    </div>

                    <div className="sentiment-bar-mini">
                      <div className="seg pos" style={{ width: `${it.positiveSentiment}%` }} title={`Positive: ${it.positiveSentiment}%`}></div>
                      <div className="seg neg" style={{ width: `${it.negativeSentiment}%` }} title={`Negative: ${it.negativeSentiment}%`}></div>
                      <div className="seg neu" style={{ width: `${it.neutralSentiment}%` }} title={`Neutral: ${it.neutralSentiment}%`}></div>
                    </div>

                    <button className="expand-toggle-btn">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="card-expanded-content">
                    <div className="expanded-grid">
                      
                      <div className="expanded-section">
                        <h4 className="section-title flex-align">
                          <CheckCircle className="title-icon positive" size={16} />
                          Key Insights
                        </h4>
                        <ul className="insights-list">
                          {it.keyInsights && it.keyInsights.length > 0 ? (
                            it.keyInsights.map((insight, idx) => <li key={idx}>{insight}</li>)
                          ) : (
                            <li>No specific insights recorded for this session.</li>
                          )}
                        </ul>
                      </div>

                      <div className="expanded-section">
                        <h4 className="section-title flex-align">
                          <AlertTriangle className="title-icon warning" size={16} />
                          Areas to Improve
                        </h4>
                        <ul className="improvements-list">
                          {it.improvements && it.improvements.length > 0 ? (
                            it.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)
                          ) : (
                            <li>No improvements needed for this session.</li>
                          )}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
