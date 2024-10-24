// src/App.jsx

import React, { useState, useEffect } from 'react';
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
  // Initialize darkMode state based on localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved mode
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    } else {
      // Optional: Default to system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Function to toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Apply or remove the 'dark' class on the root element based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Optional: Listen to system preference changes and update darkMode state
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
      localStorage.setItem('darkMode', JSON.stringify(e.matches));
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    // The 'dark' class is applied based on the darkMode state
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
