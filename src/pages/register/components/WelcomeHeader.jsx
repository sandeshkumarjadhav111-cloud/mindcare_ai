import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="text-center space-y-6">
      {/* Logo and Branding */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-moderate">
            <Icon 
              name="Brain" 
              size={32} 
              color="white" 
              className="therapeutic-transition"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={12} color="white" />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Welcome to MindCare AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Your Personal Therapeutic Companion
          </p>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Start Your Mental Wellness Journey
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Join thousands of users who trust MindCare AI for personalized mental health support. 
          Our advanced emotion recognition technology and AI-powered conversations provide 
          24/7 therapeutic assistance tailored to your unique needs.
        </p>
        
        {/* Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={16} color="var(--color-primary)" />
            </div>
            <span className="text-sm text-foreground">AI-Powered Conversations</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
              <Icon name="Camera" size={16} color="var(--color-secondary)" />
            </div>
            <span className="text-sm text-foreground">Emotion Recognition</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={16} color="var(--color-warning)" />
            </div>
            <span className="text-sm text-foreground">Mood Analytics</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="BookOpen" size={16} color="var(--color-success)" />
            </div>
            <span className="text-sm text-foreground">Interactive Journaling</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-primary">50K+</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-secondary">95%</div>
          <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-success">24/7</div>
          <div className="text-xs text-muted-foreground">AI Support</div>
        </div>
      </div>

      {/* Research Note */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Microscope" size={20} color="var(--color-secondary)" className="mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-foreground mb-1">
              Contributing to Mental Health Research
            </h4>
            <p className="text-xs text-muted-foreground">
              By joining MindCare AI, you're contributing to groundbreaking research in 
              digital mental health. Your anonymized data helps improve AI therapeutic 
              techniques for everyone. © {currentYear} MindCare AI Research Initiative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;