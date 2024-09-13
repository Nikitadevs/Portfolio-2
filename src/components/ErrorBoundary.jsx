import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          className="h-screen flex flex-col justify-center items-center bg-red-100 dark:bg-gray-800 text-red-600 dark:text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">Oops! Something went wrong.</h1>
          <p className="mt-4 text-lg">We're working on it and will get it fixed as soon as we can.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Reload Page
          </button>
        </motion.div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
