import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import MoodTracking from './pages/mood-tracking';
import AIChatInterface from './pages/ai-chat-interface';
import MoodAnalytics from './pages/mood-analytics';
import Register from './pages/register';
import InteractiveJournal from './pages/interactive-journal';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIChatInterface />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/mood-tracking" element={<MoodTracking />} />
        <Route path="/ai-chat-interface" element={<AIChatInterface />} />
        <Route path="/mood-analytics" element={<MoodAnalytics />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interactive-journal" element={<InteractiveJournal />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
