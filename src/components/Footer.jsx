import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={`py-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      } border-t border-gray-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="footer-heading"
    >
      <div className="container mx-auto text-center px-6">
        <p id="footer-heading" className="sr-only">
          Footer
        </p>
        <p className="text-lg font-semibold mb-2">
          <span className="font-bold">© {currentYear}</span> Your Name. All
          rights reserved.
        </p>
        <p
          className={`text-sm mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Designed and built with{' '}
          <span role="img" aria-label="love">
            ❤️
          </span>{' '}
          by Nikita Veretenko.
        </p>
      </div>
    </motion.footer>
  );
};

// Prop types validation
Footer.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Footer;
