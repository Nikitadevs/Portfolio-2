// src/App.jsx

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ThankYou from './components/ThankYou';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode state
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    // Apply dark mode class to the root div
    <div className={darkMode ? 'dark' : ''}>
      {/* Wrap the application with Router */}
      <Router>
        {/* ErrorBoundary wraps the main content to catch any errors in child components */}
        <ErrorBoundary darkMode={darkMode}>
          {/* Header with dark mode toggle */}
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

          {/* ScrollToTop ensures the page scrolls to top on navigation */}
          <ScrollToTop />

          {/* Define Routes */}
          <Routes>
            {/* Main Home Route */}
            <Route
              path="/"
              element={
                <>
                  {/* Main Sections */}
                  <Hero darkMode={darkMode} />
                  <About darkMode={darkMode} />
                  <Projects darkMode={darkMode} />
                  <Skills darkMode={darkMode} />
                  <Contact darkMode={darkMode} />
                  {/* Footer */}
                  <Footer darkMode={darkMode} />
                </>
              }
            />

            {/* Thank You Route */}
            <Route path="/thank-you" element={<ThankYou darkMode={darkMode} />} />

            {/* Catch-All Route: Redirect any unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </div>
  );
};

export default App;
