import React from "react";
import { X, BellOff, Trash2, CheckSquare, TrendingUp, AlertTriangle, Cpu } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";
import "./notification-modal.css";

export function NotificationModal() {
  const { 
    notifications, 
    isModalOpen, 
    setModalOpen, 
    clearNotification, 
    clearAll, 
    markAsRead 
  } = useNotificationStore();

  if (!isModalOpen) return null;

  const handleClose = () => setModalOpen(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "trend":
        return <TrendingUp className="notif-category-icon trend" size={16} />;
      case "alert":
        return <AlertTriangle className="notif-category-icon alert" size={16} />;
      case "system":
        return <Cpu className="notif-category-icon system" size={16} />;
      default:
        return <TrendingUp className="notif-category-icon" size={16} />;
    }
  };

  return (
    <div className="notif-modal-overlay" onClick={handleClose}>
      <div className="notif-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="notif-modal-header">
          <div className="notif-title-group">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <span className="notif-unread-tag">
                {notifications.filter((n) => !n.read).length} Unread
              </span>
            )}
          </div>
          <button className="notif-close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="notif-modal-actions">
          {notifications.length > 0 && (
            <>
              <button 
                className="notif-action-btn"
                onClick={() => notifications.forEach((n) => markAsRead(n.id))}
              >
                <CheckSquare size={14} />
                <span>Mark all read</span>
              </button>
              <button className="notif-action-btn clear-all" onClick={clearAll}>
                <Trash2 size={14} />
                <span>Clear all</span>
              </button>
            </>
          )}
        </div>

        <div className="notif-modal-body">
          {notifications.length === 0 ? (
            <div className="notif-empty-state">
              <BellOff className="notif-empty-icon" size={40} />
              <p className="notif-empty-title">All caught up!</p>
              <p className="notif-empty-desc">You have no new notifications or feedback trend updates.</p>
            </div>
          ) : (
            <div className="notif-list">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notif-item ${n.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="notif-item-header">
                    {getCategoryIcon(n.category)}
                    <span className="notif-item-title">{n.title}</span>
                    <span className="notif-item-time">{n.time}</span>
                  </div>
                  <p className="notif-item-desc">{n.description}</p>
                  <div className="notif-item-actions">
                    <button 
                      className="notif-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(n.id);
                      }}
                      title="Clear Notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
