// src/components/ErrorBoundary.jsx

import React, { Component, memo, createRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedo,
  faHome,
  faBug,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * **ActionButton Component**
 * A memoized button component with advanced hover and active animations.
 */
const ActionButton = memo(
  ({
    onClick,
    icon,
    label,
    bgColor,
    hoverBgColor,
    ariaLabel,
    disabled,
    isLoading,
  }) => {
    // Ripple effect state
    const [rippleArray, setRippleArray] = React.useState([]);

    const addRipple = (event) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(button.clientWidth, button.clientHeight);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      const newRipple = { x, y, size };
      setRippleArray((prev) => [...prev, newRipple]);

      // Remove the ripple after animation
      setTimeout(() => {
        setRippleArray((prev) => prev.slice(1));
      }, 600);
    };

    return (
      <motion.button
        onClick={(e) => {
          if (!disabled) {
            addRipple(e);
            onClick();
          }
        }}
        className={`relative overflow-hidden ${bgColor} text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow flex items-center shadow-lg ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        whileHover={
          !disabled
            ? {
                scale: 1.05,
                boxShadow: '0px 20px 30px rgba(0, 0, 0, 0.3)',
                transition: { duration: 0.3 },
              }
            : {}
        }
        whileTap={
          !disabled
            ? {
                scale: 0.95,
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.2 },
              }
            : {}
        }
        disabled={disabled}
      >
        {/* Ripple Effect */}
        {rippleArray.map((ripple, index) => (
          <span
            key={index}
            className="absolute bg-white opacity-25 rounded-full animate-ripple"
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
            }}
          ></span>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}

        {/* Icon with Dynamic Animations */}
        {icon && !isLoading && (
          <motion.div
            className="mr-3 text-lg"
            whileHover={{ rotate: 15, scale: 1.2 }}
            whileTap={{ rotate: -15, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FontAwesomeIcon icon={icon} aria-hidden="true" />
          </motion.div>
        )}

        {/* Button Label */}
        <span className="text-base">{label}</span>
      </motion.button>
    );
  }
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.object,
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  hoverBgColor: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

ActionButton.defaultProps = {
  icon: null,
  disabled: false,
  isLoading: false,
};

/**
 * **ThemeToggle Component**
 * A button to toggle between dark and light modes with smooth icon morphing and background pulse.
 */
const ThemeToggle = ({ darkMode, toggleDarkMode }) => (
  <motion.button
    onClick={toggleDarkMode}
    className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
    aria-label="Toggle Dark Mode"
    whileTap={{ scale: 0.85 }}
  >
    <motion.div
      animate={{ rotate: darkMode ? 0 : 180 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background Pulse */}
      <motion.span
        className={`absolute inset-0 rounded-full ${
          darkMode ? 'bg-gray-700' : 'bg-yellow-400'
        } opacity-50`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      ></motion.span>

      {/* Icon */}
      <FontAwesomeIcon
        icon={darkMode ? faSun : faMoon}
        className="relative text-xl text-yellow-500 dark:text-gray-200"
      />
    </motion.div>
  </motion.button>
);

ThemeToggle.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

/**
 * **ErrorIllustration Component**
 * An inline SVG illustration representing an error with responsive sizing.
 */
const ErrorIllustration = ({ className, ariaHidden }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    aria-hidden={ariaHidden}
    role={ariaHidden ? 'presentation' : 'img'}
  >
    {!ariaHidden && <title>Error Illustration</title>}
    <path
      fill="currentColor"
      d="M320 32C132.3 32 0 164.3 0 352s132.3 320 320 320 320-132.3 320-320S507.7 32 320 32zm0 528c-132.3 0-240-107.7-240-240S187.7 80 320 80s240 107.7 240 240-107.7 240-240 240zm96-304c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32v-32c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v32zm0 96c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32v-160c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v160z"
    />
  </svg>
);

ErrorIllustration.propTypes = {
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
};

ErrorIllustration.defaultProps = {
  className: '',
  ariaHidden: true,
};

/**
 * **FallbackUI Component**
 * The UI displayed when an error is caught by the ErrorBoundary with enhanced UI/UX.
 */
const FallbackUI = forwardRef(
  (
    {
      darkMode,
      toggleDarkMode,
      handleReload,
      handleGoHome,
      handleReport,
      isReporting,
      error,
      errorInfo,
    },
    ref
  ) => {
    const { t } = useTranslation();

    return (
      <AnimatePresence>
        <motion.div
          className={`min-h-screen flex flex-col justify-center items-center px-6 relative ${
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
          tabIndex="-1"
          ref={ref}
        >
          {/* Theme Toggle Button */}
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Error Illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6"
          >
            <ErrorIllustration className="w-32 h-32 mb-4" ariaHidden />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            id="error-title"
            className="text-4xl font-extrabold mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            {t('errorTitle', 'Oops! Something Went Wrong.')}
          </motion.h1>

          {/* Error Description */}
          <motion.p
            id="error-description"
            className="text-lg mb-8 text-center max-w-lg px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            {t(
              'errorDescription',
              "We're sorry for the inconvenience. Please try reloading the page or contact support if the problem persists."
            )}
          </motion.p>

          {/* Action Buttons */}
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
              label={t('reloadPage', 'Reload Page')}
              bgColor="bg-red-600"
              hoverBgColor="bg-red-700"
              ariaLabel={t('reloadPage', 'Reload the page')}
            />
            <ActionButton
              onClick={handleGoHome}
              icon={faHome}
              label={t('goHome', 'Go Home')}
              bgColor="bg-green-600"
              hoverBgColor="bg-green-700"
              ariaLabel={t('goHome', 'Navigate to home page')}
            />
            <ActionButton
              onClick={handleReport}
              icon={faBug}
              label={t('reportIssue', 'Report Issue')}
              bgColor="bg-purple-600"
              hoverBgColor="bg-purple-700"
              ariaLabel={t('reportIssue', 'Report this issue')}
              disabled={isReporting}
              isLoading={isReporting}
            />
          </motion.div>

          {/* Contact Support and Additional Links */}
          <motion.div
            className="mt-8 flex flex-col items-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
          >
            <a
              href="mailto:support@example.com?subject=App%20Error%20Report"
              className={`text-sm underline ${
                darkMode
                  ? 'text-red-300 hover:text-red-200'
                  : 'text-red-700 hover:text-red-500'
              }`}
            >
              {t('contactSupport', 'Contact Support')}
            </a>
            <a
              href="/faq"
              className={`text-sm underline ${
                darkMode
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-blue-700 hover:text-blue-500'
              }`}
            >
              {t('viewFAQs', 'View FAQs')}
            </a>
            <a
              href="/documentation"
              className={`text-sm underline ${
                darkMode
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-blue-700 hover:text-blue-500'
              }`}
            >
              {t('readDocumentation', 'Read Documentation')}
            </a>
          </motion.div>

          {/* Error Details (Development Mode) */}
          {process.env.NODE_ENV === 'development' && error && errorInfo && (
            <AnimatePresence>
              <motion.details
                style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
                className={`${
                  darkMode ? 'text-red-300' : 'text-red-700'
                } bg-opacity-50 p-4 rounded-md w-full max-w-2xl`}
              >
                <summary className="cursor-pointer underline">
                  {t('clickForDetails', 'Click for error details')}
                </summary>
                <p>{error.toString()}</p>
                <br />
                <p>{errorInfo.componentStack}</p>
              </motion.details>
            </AnimatePresence>
          )}

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? 'dark' : 'light'}
          />
        </motion.div>
      </AnimatePresence>
    );
  }
);

FallbackUI.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  handleReload: PropTypes.func.isRequired,
  handleGoHome: PropTypes.func.isRequired,
  handleReport: PropTypes.func.isRequired,
  isReporting: PropTypes.bool.isRequired,
  error: PropTypes.object,
  errorInfo: PropTypes.object,
};

FallbackUI.defaultProps = {
  error: null,
  errorInfo: null,
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    const storedTheme = localStorage.getItem('darkMode') === 'true';
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      darkMode: storedTheme,
      isReporting: false,
    };
    this.errorRef = createRef();
  }

  /**
   * Updates the state so the next render shows the fallback UI.
   * @param {Error} error The error that was thrown.
   * @returns {Object} Updated state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs the error information and captures it using Sentry.
   * @param {Error} error The error that was thrown.
   * @param {Object} errorInfo Additional error information.
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    Sentry.captureException(error, { extra: errorInfo });
    // Additional logging can be done here
  }

  /**
   * Shifts focus to the error message when an error is caught.
   * @param {Object} prevProps Previous props.
   * @param {Object} prevState Previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasError && this.state.hasError) {
      // Shift focus to the error message
      this.errorRef.current?.focus();
    }
  }

  /**
   * Reloads the current page.
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigates the user to the home page.
   */
  handleGoHome = () => {
    const { homePath } = this.props;
    window.location.href = homePath;
  };

  /**
   * Handles the reporting of the error by the user.
   */
  handleReport = () => {
    this.setState({ isReporting: true });
    try {
      const { error, errorInfo } = this.state;
      const userAgent = navigator.userAgent;
      const appState = {}; // Include relevant state if available

      const report = {
        error: error.toString(),
        componentStack: errorInfo?.componentStack,
        userAgent,
        appState,
        timestamp: new Date().toISOString(),
      };

      // Send the report to Sentry or your preferred backend
      Sentry.captureException(error, { extra: report });

      toast.success('Error reported successfully!');
    } catch (err) {
      toast.error('Failed to report error.');
    } finally {
      this.setState({ isReporting: false });
    }
  };

  /**
   * Toggles between dark and light modes.
   */
  toggleDarkMode = () => {
    this.setState(
      (prevState) => ({ darkMode: !prevState.darkMode }),
      () => {
        localStorage.setItem('darkMode', this.state.darkMode);
      }
    );
  };

  render() {
    const { hasError, darkMode, isReporting, error, errorInfo } = this.state;
    const { customFallback, customFallbackProps } = this.props;

    if (hasError) {
      if (customFallback) {
        return React.cloneElement(customFallback, { ...customFallbackProps });
      }

      return (
        <FallbackUI
          ref={this.errorRef}
          darkMode={darkMode}
          toggleDarkMode={this.toggleDarkMode}
          handleReload={this.handleReload}
          handleGoHome={this.handleGoHome}
          handleReport={this.handleReport}
          isReporting={isReporting}
          error={error}
          errorInfo={errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  customFallback: PropTypes.element,
  customFallbackProps: PropTypes.object,
  homePath: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  customFallback: null,
  customFallbackProps: {},
  homePath: '/',
};

export default ErrorBoundary;
