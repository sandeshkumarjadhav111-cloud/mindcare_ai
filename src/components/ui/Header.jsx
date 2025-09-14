import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ currentUser, emotionState, onNavigate }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/main-dashboard', 
      icon: 'LayoutDashboard',
      tooltip: 'View your mental health overview and insights'
    },
    { 
      label: 'Chat', 
      path: '/ai-chat-interface', 
      icon: 'MessageCircle',
      tooltip: 'Talk with your AI therapeutic companion'
    },
    { 
      label: 'Journal', 
      path: '/interactive-journal', 
      icon: 'BookOpen',
      tooltip: 'Express your thoughts in a safe space'
    },
    { 
      label: 'Mood', 
      path: '/mood-tracking', 
      icon: 'Heart',
      tooltip: 'Track and understand your emotional patterns'
    },
    { 
      label: 'Analytics', 
      path: '/mood-analytics', 
      icon: 'TrendingUp',
      tooltip: 'Explore your emotional journey over time'
    }
  ];

  const getEmotionColor = () => {
    if (!emotionState) return 'var(--color-muted)';
    
    const emotionColors = {
      calm: 'var(--color-primary)',
      happy: 'var(--color-success)',
      anxious: 'var(--color-warning)',
      sad: 'var(--color-secondary)',
      stressed: 'var(--color-error)',
      neutral: 'var(--color-muted-foreground)'
    };
    
    return emotionColors?.[emotionState?.type] || 'var(--color-muted)';
  };

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('/register');
    }
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Icon 
              name="Brain" 
              size={24} 
              color="var(--color-primary)" 
              className="therapeutic-transition"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-heading font-semibold text-foreground">
              MindCare AI
            </h1>
            <span className="text-xs font-caption text-muted-foreground">
              Your Therapeutic Companion
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                  therapeutic-transition breathing-hover
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                title={item?.tooltip}
                onClick={() => onNavigate && onNavigate(item?.path)}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className="therapeutic-transition"
                />
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Emotion Status Display */}
          {emotionState && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface">
              <div 
                className="w-2 h-2 rounded-full therapeutic-transition"
                style={{ backgroundColor: getEmotionColor() }}
              />
              <span className="text-xs font-caption text-muted-foreground capitalize">
                {emotionState?.type || 'Detecting...'}
              </span>
            </div>
          )}

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-primary)" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {currentUser?.name || 'User'}
              </span>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`therapeutic-transition ${isUserMenuOpen ? 'rotate-180' : ''}`}
              />
            </Button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-moderate z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email || 'user@mindcare.ai'}
                    </p>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md therapeutic-transition">
                      <Icon name="Settings" size={16} />
                      <span>Settings</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md therapeutic-transition">
                      <Icon name="HelpCircle" size={16} />
                      <span>Help & Support</span>
                    </button>
                    
                    <div className="border-t border-border my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md therapeutic-transition"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <nav className="flex items-center justify-around py-2">
          {navigationItems?.slice(0, 5)?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg
                  therapeutic-transition
                  ${isActive 
                    ? 'text-primary' :'text-muted-foreground'
                  }
                `}
                onClick={() => onNavigate && onNavigate(item?.path)}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="therapeutic-transition"
                />
                <span className="text-xs font-caption">{item?.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Overlay for mobile menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;