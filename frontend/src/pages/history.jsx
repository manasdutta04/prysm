import React, { useEffect, useState } from "react";
import "./history.css";
import axios from "../lib/axios";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await axios.get("/custom-data/history");
        setItems(resp.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topCounts = {
    total: items.length,
    sources: [...new Set(items.map(i => i.source))].length,
    recent: items[0]?.timestamp ? new Date(items[0].timestamp).toLocaleString() : "-",
  };

  return (
    <div className="history-page">
      <h2 className="page-title">History</h2>

      <div className="history-grid">
        <div className="cards-row">
          <div className="stat-card">Total: <strong>{topCounts.total}</strong></div>
          <div className="stat-card">Sources: <strong>{topCounts.sources}</strong></div>
          <div className="stat-card">Most recent: <strong>{topCounts.recent}</strong></div>
        </div>

        <div className="history-list">
          {loading && <div className="skeleton">Loading...</div>}
          {!loading && items.length === 0 && <div className="empty">No history found</div>}
          {!loading && items.map((it, idx) => (
            <div key={idx} className="history-item">
              <div className="hi-left">
                <div className="hi-source">{it.source}</div>
                <div className="hi-time">{new Date(it.timestamp).toLocaleString()}</div>
              </div>
              <div className="hi-content">{it.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
