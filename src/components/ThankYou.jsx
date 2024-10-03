// src/components/ThankYou.jsx

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Updated import
import PropTypes from 'prop-types';

const ThankYou = ({ darkMode = false }) => {
  const navigate = useNavigate(); // Updated hook

  const handleBack = () => {
    navigate('/'); // Redirect to Home or adjust as needed
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
      aria-labelledby="thank-you-heading"
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-6xl text-green-500 mb-6"
        aria-hidden="true"
      />
      <h2
        id="thank-you-heading"
        className="text-3xl sm:text-4xl font-bold mb-4"
      >
        Thank You!
      </h2>
      <p className="text-lg sm:text-xl mb-8">
        Your message has been sent successfully. I'll get back to you soon.
      </p>
      <button
        onClick={handleBack}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      >
        Back to Home
      </button>
    </motion.div>
  );
};

ThankYou.propTypes = {
  darkMode: PropTypes.bool,
};

export default ThankYou;
