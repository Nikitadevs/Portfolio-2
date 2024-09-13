/* eslint-disable react/prop-types */
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faUser,
  faCommentDots,
  faCheckCircle,
  faTimesCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

// Reusable Input Field Component
// eslint-disable-next-line react/display-name
const InputField = memo(
  ({
    label,
    icon,
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    darkMode,
  }) => (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-left text-sm font-semibold mb-2 flex items-center"
      >
        <FontAwesomeIcon icon={icon} className="mr-2 text-lg" />
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${
          darkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-white text-gray-800 placeholder-gray-500'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1 flex items-center">
          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
);

// Reusable TextArea Field Component
// eslint-disable-next-line react/display-name
const TextAreaField = memo(
  ({
    label,
    icon,
    id,
    name,
    value,
    onChange,
    placeholder,
    // eslint-disable-next-line react/prop-types
    error,
    // eslint-disable-next-line react/prop-types
    darkMode,
  }) => (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-left text-sm font-semibold mb-2 flex items-center"
      >
        <FontAwesomeIcon icon={icon} className="mr-2 text-lg" />
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="6"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${
          darkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-white text-gray-800 placeholder-gray-500'
        }`}
      ></textarea>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1 flex items-center">
          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
);

const Contact = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({
    name: '',
    email: '',
    message: '',
    form: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({ name: '', email: '', message: '', form: '' });

    // Client-side validation
    let hasError = false;
    const newError = { name: '', email: '', message: '', form: '' };

    if (!formData.name.trim()) {
      newError.name = 'Please enter your name.';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newError.email = 'Please enter your email.';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newError.email = 'Please enter a valid email address.';
      hasError = true;
    }

    if (!formData.message.trim()) {
      newError.message = 'Please enter your message.';
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xvgpavpe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const result = await response.json();
        setError((prev) => ({
          ...prev,
          form: result.error || 'Form submission error. Please try again later.',
        }));
      }
    } catch (networkError) {
      console.error(networkError);
      setError((prev) => ({
        ...prev,
        form: 'Network error. Please try again later.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`p-6 sm:p-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto text-center">
        <h2
          id="contact-heading"
          className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8"
        >
          Contact Me
        </h2>
        <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto">
          {/* Contact Form */}
          <motion.div
            className={`rounded-lg shadow-lg p-6 w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {isSent ? (
              <div className="flex flex-col items-center text-green-500 text-lg font-semibold">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-4xl mb-4"
                  aria-hidden="true"
                />
                <p>Your message has been sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6" noValidate>
                <InputField
                  label="Name"
                  icon={faUser}
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  error={error.name}
                  darkMode={darkMode}
                />
                <InputField
                  label="Email"
                  icon={faEnvelope}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  error={error.email}
                  darkMode={darkMode}
                />
                <TextAreaField
                  label="Message"
                  icon={faCommentDots}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  error={error.message}
                  darkMode={darkMode}
                />
                {error.form && (
                  <p className="text-red-500 text-sm mb-2 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                    {error.form}
                  </p>
                )}
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center ${
                      isSubmitting ? 'cursor-not-allowed opacity-75' : ''
                    }`}
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
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
                            d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className={`rounded-lg shadow-lg p-6 w-full text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-4xl text-blue-500 mb-4"
              aria-hidden="true"
            />
            <p className="text-lg sm:text-xl mb-2">nikita.development@gmail.com</p>
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              onClick={() =>
                (window.location.href = 'mailto:nikita.development@gmail.com')
              }
            >
              Email Me
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
