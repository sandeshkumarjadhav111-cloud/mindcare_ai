import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    mentalHealthGoals: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const mockCredentials = {
    email: "sarah.johnson@mindcare.ai",
    password: "MindCare2024!",
    fullName: "Sarah Johnson",
    age: "28"
  };

  const validatePasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password?.length >= 8) {
      score += 1;
    } else {
      feedback?.push("At least 8 characters");
    }

    if (/[A-Z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push("One uppercase letter");
    }

    if (/[a-z]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push("One lowercase letter");
    }

    if (/\d/?.test(password)) {
      score += 1;
    } else {
      feedback?.push("One number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
      score += 1;
    } else {
      feedback?.push("One special character");
    }

    return { score, feedback };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear specific field error
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time password strength validation
    if (name === 'password') {
      const strength = validatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength?.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Age validation
    if (!formData?.age) {
      newErrors.age = 'Age is required for healthcare compliance';
    } else if (parseInt(formData?.age) < 13) {
      newErrors.age = 'Must be at least 13 years old';
    } else if (parseInt(formData?.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    // Terms and privacy validation
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms of service';
    }

    if (!formData?.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock registration success
      const userData = {
        id: Date.now(),
        name: formData?.fullName,
        email: formData?.email,
        age: parseInt(formData?.age),
        gender: formData?.gender,
        mentalHealthGoals: formData?.mentalHealthGoals,
        registeredAt: new Date()?.toISOString(),
        isVerified: false
      };

      // Store user data in localStorage for demo
      localStorage.setItem('mindcare_user', JSON.stringify(userData));
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess(userData);
      }

      // Navigate to dashboard
      navigate('/main-dashboard');

    } catch (error) {
      setErrors({
        submit: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength?.score <= 1) return 'bg-error';
    if (passwordStrength?.score <= 2) return 'bg-warning';
    if (passwordStrength?.score <= 3) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength?.score <= 1) return 'Weak';
    if (passwordStrength?.score <= 2) return 'Fair';
    if (passwordStrength?.score <= 3) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Credentials Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">Demo Credentials</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Email:</strong> {mockCredentials?.email}</p>
              <p><strong>Password:</strong> {mockCredentials?.password}</p>
              <p><strong>Name:</strong> {mockCredentials?.fullName}</p>
              <p><strong>Age:</strong> {mockCredentials?.age}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Personal Information</h3>
        
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          description="We'll use this for account verification and important updates"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />

        <Input
          label="Age"
          type="number"
          name="age"
          placeholder="Enter your age"
          description="Required for healthcare compliance and age-appropriate content"
          value={formData?.age}
          onChange={handleInputChange}
          error={errors?.age}
          min="13"
          max="120"
          required
        />
      </div>
      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Security</h3>
        
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
          />
          
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Password Strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength?.score <= 1 ? 'text-error' :
                  passwordStrength?.score <= 2 ? 'text-warning' :
                  passwordStrength?.score <= 3 ? 'text-accent' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full therapeutic-transition ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                />
              </div>
              {passwordStrength?.feedback?.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">Missing:</p>
                  <ul className="text-xs text-muted-foreground ml-2">
                    {passwordStrength?.feedback?.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Optional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Optional Information</h3>
        
        <Input
          label="Gender (Optional)"
          type="text"
          name="gender"
          placeholder="e.g., Male, Female, Non-binary, Prefer not to say"
          description="Helps personalize your experience"
          value={formData?.gender}
          onChange={handleInputChange}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mental Health Goals (Optional)
          </label>
          <textarea
            name="mentalHealthGoals"
            placeholder="What would you like to achieve with MindCare AI? (e.g., manage anxiety, improve mood, develop coping strategies)"
            value={formData?.mentalHealthGoals}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This helps our AI provide more personalized support
          </p>
        </div>
      </div>
      {/* Agreements */}
      <div className="space-y-3">
        <Checkbox
          label="I agree to the Terms of Service"
          name="agreeToTerms"
          checked={formData?.agreeToTerms}
          onChange={handleInputChange}
          error={errors?.agreeToTerms}
          required
        />

        <Checkbox
          label="I agree to the Privacy Policy and Healthcare Data Handling"
          name="agreeToPrivacy"
          checked={formData?.agreeToPrivacy}
          onChange={handleInputChange}
          error={errors?.agreeToPrivacy}
          required
        />

        <Checkbox
          label="Subscribe to wellness tips and research updates (Optional)"
          name="subscribeNewsletter"
          checked={formData?.subscribeNewsletter}
          onChange={handleInputChange}
        />
      </div>
      {/* Submit Error */}
      {errors?.submit && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" />
            <span className="text-sm text-error">{errors?.submit}</span>
          </div>
        </div>
      )}
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-primary hover:text-primary/80 font-medium therapeutic-transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;