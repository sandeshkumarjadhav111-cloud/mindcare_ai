import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const existingUser = localStorage.getItem('mindcare_user');
    if (existingUser) {
      navigate('/main-dashboard');
      return;
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRegistrationSuccess = (userData) => {
    setRegistrationSuccess(true);
    
    // Show success message briefly before navigation
    setTimeout(() => {
      navigate('/main-dashboard');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading MindCare AI...</p>
        </div>
      </div>
    );
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Welcome to MindCare AI!
          </h2>
          <p className="text-muted-foreground">
            Your account has been created successfully. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Welcome & Trust Signals */}
            <div className="space-y-8">
              <WelcomeHeader />
              <div className="hidden lg:block">
                <TrustSignals />
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-card border border-border rounded-2xl shadow-moderate p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-muted-foreground">
                    Start your personalized mental wellness journey today
                  </p>
                </div>

                <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
              </div>

              {/* Mobile Trust Signals */}
              <div className="lg:hidden mt-8">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground therapeutic-transition">
                Privacy Policy
              </button>
              <button className="hover:text-foreground therapeutic-transition">
                Terms of Service
              </button>
              <button className="hover:text-foreground therapeutic-transition">
                Healthcare Compliance
              </button>
              <button className="hover:text-foreground therapeutic-transition">
                Contact Support
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} MindCare AI. All rights reserved. 
              Healthcare data protected under HIPAA compliance.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;