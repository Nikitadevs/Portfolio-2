// src/components/ErrorBoundary.jsx

import React, { Component, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faRedo,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/react';

// Memoized ActionButton to prevent unnecessary re-renders
const ActionButton = memo(
  ({ onClick, icon, label, bgColor, hoverColor, ariaLabel }) => (
    <motion.button
      onClick={onClick}
      className={`${bgColor} text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition flex items-center shadow-lg`}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="mr-3 text-lg" aria-hidden="true" />
      )}
      <span className="text-base">{label}</span>
    </motion.button>
  )
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.object, // FontAwesomeIcon expects an icon object
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

const FallbackUI = ({
  darkMode,
  handleReload,
  handleRetry,
  handleGoHome,
}) => (
  <AnimatePresence>
    <motion.div
      className={`min-h-screen flex flex-col justify-center items-center px-6 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-red-400'
          : 'bg-gradient-to-b from-red-100 to-red-200 text-red-600'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-6"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-7xl mb-4 animate-pulse"
          aria-hidden="true"
        />
      </motion.div>
      <motion.h1
        id="error-title"
        className="text-4xl font-extrabold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      >
        Oops! Something went wrong.
      </motion.h1>
      <motion.p
        id="error-description"
        className="text-lg mb-8 text-center max-w-lg px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      >
        We're sorry for the inconvenience. Please try reloading the page or
        contact support if the problem persists.
      </motion.p>
      <motion.div
        className="flex flex-wrap justify-center gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <ActionButton
          onClick={handleReload}
          icon={faRedo}
          label="Reload Page"
          bgColor="bg-red-600"
          hoverColor="bg-red-700"
          ariaLabel="Reload the page"
        />
        <ActionButton
          onClick={handleRetry}
          label="Try Again"
          bgColor="bg-blue-600"
          hoverColor="bg-blue-700"
          ariaLabel="Retry loading content"
        />
        <ActionButton
          onClick={handleGoHome}
          icon={faHome}
          label="Go Home"
          bgColor="bg-green-600"
          hoverColor="bg-green-700"
          ariaLabel="Navigate to home page"
        />
      </motion.div>
      <motion.a
        href="mailto:support@example.com"
        className={`mt-8 text-sm underline ${
          darkMode
            ? 'text-red-300 hover:text-red-200'
            : 'text-red-700 hover:text-red-500'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
      >
        Contact Support
      </motion.a>
    </motion.div>
  </AnimatePresence>
);

FallbackUI.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  handleReload: PropTypes.func.isRequired,
  handleRetry: PropTypes.func.isRequired,
  handleGoHome: PropTypes.func.isRequired,
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Lifecycle method to update state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Capture error details
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    Sentry.captureException(error, { extra: errorInfo });
    // Additional logging can be done here
  }

  // Handler to reload the page
  handleReload = () => {
    window.location.reload();
  };

  // Handler to retry rendering children
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  // Handler to navigate to the home page
  handleGoHome = () => {
    const { homePath } = this.props;
    window.location.href = homePath;
  };

  // Optionally render error details in development mode
  renderErrorDetails() {
    const { error, errorInfo } = this.state;
    if (process.env.NODE_ENV === 'development' && error && errorInfo) {
      return (
        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          <summary>Click for error details</summary>
          {error && error.toString()}
          <br />
          {errorInfo.componentStack}
        </details>
      );
    }
    return null;
  }

  render() {
    const { hasError } = this.state;
    const { darkMode, customFallback, customFallbackProps } = this.props;

    if (hasError) {
      if (customFallback) {
        return React.cloneElement(customFallback, { ...customFallbackProps });
      }

      return (
        <FallbackUI
          darkMode={darkMode}
          handleReload={this.handleReload}
          handleRetry={this.handleRetry}
          handleGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool,
  customFallback: PropTypes.element,
  customFallbackProps: PropTypes.object,
  homePath: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  darkMode: false,
  customFallback: null,
  customFallbackProps: {},
  homePath: '/',
};

export default ErrorBoundary;
