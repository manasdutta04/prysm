import { create } from "zustand";
import toast from "react-hot-toast";
import React from "react";
import axios from "../lib/axios";

export const useNotificationStore = create((set) => ({
  notifications: [],
  isModalOpen: false,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  
  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  
  clearAll: () => set({ notifications: [] }),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  addNotification: (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      read: false,
      time: "Just now",
      ...notif
    };
    
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
    
    // Display a toast notification using React.createElement to avoid Vite JSX parse errors in .js files
    toast((t) => 
      React.createElement('div', {
        className: "cursor-pointer flex flex-col gap-1 text-left",
        style: { display: "flex", flexDirection: "column", gap: "2px" },
        onClick: () => {
          toast.dismiss(t.id);
          set({ isModalOpen: true });
        }
      }, [
        React.createElement('span', { 
          key: 'title', 
          style: { fontWeight: "600", fontSize: "13px", color: "#CCFF00" }
        }, newNotif.title),
        React.createElement('span', { 
          key: 'desc', 
          style: { fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }
        }, newNotif.description)
      ]),
      {
        duration: 6000,
        icon: "📢",
      }
    );
  },

  loadNotifications: async () => {
    try {
      const resp = await axios.get("/dashboard/history");
      const items = resp.data.items || [];
      const generated = [];

      items.forEach((item) => {
        const timeFormatted = new Date(item.timestamp).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        // 1. Overall execution notification
        generated.push({
          id: `hist-run-${item._id}`,
          title: "Feedback Analysis Run",
          description: `Processed ${item.totalFeedback} items. Sentiment breakdown: ${item.positiveSentiment}% positive, ${item.negativeSentiment}% negative, ${item.neutralSentiment}% neutral.`,
          category: "system",
          time: timeFormatted,
          read: true,
        });

        // 2. Trend satisfaction notification
        generated.push({
          id: `hist-trend-${item._id}`,
          title: "Satisfaction Score Alert",
          description: `Average satisfaction score for the timeframe reached ${item.satisfactionScore.toFixed(1)} / 5.0.`,
          category: "trend",
          time: timeFormatted,
          read: true,
        });

        // 3. Highlight top insight
        if (item.keyInsights && item.keyInsights[0]) {
          generated.push({
            id: `hist-insight-${item._id}`,
            title: "Trend Insight",
            description: item.keyInsights[0],
            category: "trend",
            time: timeFormatted,
            read: true,
          });
        }

        // 4. Alert negative sentiment if high
        if (item.negativeSentiment > 35) {
          generated.push({
            id: `hist-alert-${item._id}`,
            title: "Critical Feedback Warning",
            description: `High negative sentiment detected (${item.negativeSentiment}%). Key improvements requested: ${item.improvements?.[0] || 'N/A'}.`,
            category: "alert",
            time: timeFormatted,
            read: true,
          });
        }
      });

      set((state) => {
        // Keep any active "live" notifications (not generated from history)
        const liveNotifs = state.notifications.filter(n => !n.id.startsWith("hist-"));
        return { 
          notifications: [...liveNotifs, ...generated].slice(0, 50)
        };
      });
    } catch (err) {
      console.warn("Failed to load notifications from history:", err.message);
    }
  }
}));
