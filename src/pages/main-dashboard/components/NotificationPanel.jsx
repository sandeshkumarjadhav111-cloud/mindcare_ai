import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ emotionState }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'mood-reminder',
      title: 'Mood Check-in Reminder',
      message: 'It\'s been 4 hours since your last mood check-in. How are you feeling now?',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      priority: 'medium',
      icon: 'Heart',
      color: 'var(--color-primary)',
      actionText: 'Check In Now',
      isRead: false
    },
    {
      id: 2,
      type: 'ai-insight',
      title: 'New AI Insight Available',
      message: 'Based on your recent patterns, we\'ve identified some positive trends in your emotional wellness.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      priority: 'low',
      icon: 'Brain',
      color: 'var(--color-secondary)',
      actionText: 'View Insight',
      isRead: false
    },
    {
      id: 3,
      type: 'journal-streak',
      title: 'Journal Streak Achievement',
      message: 'Congratulations! You\'ve maintained a 12-day journaling streak. Keep up the great work!',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      priority: 'high',
      icon: 'Award',
      color: 'var(--color-success)',
      actionText: 'Continue Streak',
      isRead: true
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Personalized Recommendation',
      message: 'Your mood tends to improve after morning meditation. Consider scheduling a session for tomorrow.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      priority: 'medium',
      icon: 'Lightbulb',
      color: 'var(--color-warning)',
      actionText: 'Schedule',
      isRead: true
    }
  ]);

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'var(--color-success)',
      medium: 'var(--color-warning)',
      low: 'var(--color-muted-foreground)'
    };
    return colors?.[priority] || 'var(--color-muted-foreground)';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== notificationId));
  };

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
            <Icon name="Bell" size={20} color="var(--color-warning)" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setNotifications(prev => prev?.map(n => ({ ...n, isRead: true })))}
          >
            Mark All Read
          </Button>
        )}
      </div>
      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications at the moment</p>
            <p className="text-xs text-muted-foreground mt-1">We'll notify you of important updates</p>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div 
              key={notification?.id}
              className={`
                relative border rounded-lg p-4 therapeutic-transition breathing-hover cursor-pointer
                ${notification?.isRead 
                  ? 'border-border bg-surface/50' :'border-primary/20 bg-primary/5'
                }
              `}
              onClick={() => markAsRead(notification?.id)}
            >
              {/* Unread Indicator */}
              {!notification?.isRead && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              )}

              {/* Notification Content */}
              <div className="flex items-start space-x-3">
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${notification?.color}20` }}
                >
                  <Icon 
                    name={notification?.icon} 
                    size={18} 
                    color={notification?.color}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`text-sm font-medium ${notification?.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification?.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getPriorityColor(notification?.priority) }}
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(notification?.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed mb-3 ${notification?.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification?.message}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      {notification?.actionText}
                    </Button>

                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        dismissNotification(notification?.id);
                      }}
                      className="text-muted-foreground hover:text-foreground therapeutic-transition"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Notification Settings */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth iconName="Settings" iconPosition="left">
          Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationPanel;