import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      name: "HIPAA Compliant",
      icon: "Shield",
      description: "Healthcare data protection certified"
    },
    {
      id: 2,
      name: "SSL Secured",
      icon: "Lock",
      description: "256-bit encryption for all data"
    },
    {
      id: 3,
      name: "Research Backed",
      icon: "Award",
      description: "Evidence-based therapeutic approaches"
    },
    {
      id: 4,
      name: "Privacy First",
      icon: "Eye",
      description: "Your data never leaves our secure servers"
    }
  ];

  const endorsements = [
    {
      id: 1,
      institution: "Stanford Psychology Research Lab",
      logo: "GraduationCap",
      endorsement: "Validated emotion recognition accuracy"
    },
    {
      id: 2,
      institution: "Mental Health America",
      logo: "Heart",
      endorsement: "Recommended digital wellness tool"
    },
    {
      id: 3,
      institution: "American Psychological Association",
      logo: "Brain",
      endorsement: "Ethical AI practices certified"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Your Privacy & Security
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {trustBadges?.map((badge) => (
            <div
              key={badge?.id}
              className="flex flex-col items-center text-center p-4 bg-card border border-border rounded-lg shadow-soft"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Icon 
                  name={badge?.icon} 
                  size={24} 
                  color="var(--color-primary)" 
                />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                {badge?.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {badge?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Research Endorsements */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Trusted by Leading Institutions
        </h3>
        <div className="space-y-3">
          {endorsements?.map((endorsement) => (
            <div
              key={endorsement?.id}
              className="flex items-center space-x-3 p-3 bg-surface rounded-lg border border-border"
            >
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={endorsement?.logo} 
                  size={20} 
                  color="var(--color-secondary)" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {endorsement?.institution}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {endorsement?.endorsement}
                </p>
              </div>
              <Icon 
                name="CheckCircle" 
                size={16} 
                color="var(--color-success)" 
                className="flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Security Features */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheck" size={20} color="var(--color-primary)" className="mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">
              Advanced Security Features
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• End-to-end encryption for all conversations</li>
              <li>• Secure biometric data processing</li>
              <li>• Regular security audits and compliance checks</li>
              <li>• Anonymous data aggregation for research</li>
              <li>• Right to data deletion and portability</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Questions about privacy or security?
        </p>
        <button className="text-xs text-primary hover:text-primary/80 font-medium therapeutic-transition">
          Contact our Privacy Team
        </button>
      </div>
    </div>
  );
};

export default TrustSignals;