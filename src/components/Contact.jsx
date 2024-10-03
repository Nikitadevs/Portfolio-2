// Contact.jsx
import React, {
  useReducer,
  memo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faUser,
  faCommentDots,
  faCheckCircle,
  faTimesCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

// Initial State for useReducer
const initialState = {
  formData: {
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for spam prevention
  },
  errors: {
    name: '',
    email: '',
    message: '',
    form: '',
  },
  isSubmitting: false,
  isSent: false,
};

// Reducer Function
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: initialState.errors,
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        isSent: true,
        formData: initialState.formData,
      };
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmitting: false,
        errors: {
          ...state.errors,
          form: action.error,
        },
      };
    case 'RESET_SENT':
      return {
        ...state,
        isSent: false,
      };
    default:
      return state;
  }
}

// Reusable Input Field Component
const InputField = memo(function InputField({
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
  innerRef,
}) {
  return (
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
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        ref={innerRef}
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${
          darkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-white text-gray-800 placeholder-gray-500'
        } transition-colors duration-200`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="text-red-500 text-sm mt-1 flex items-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  darkMode: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

// Reusable TextArea Field Component
const TextAreaField = memo(function TextAreaField({
  label,
  icon,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  darkMode,
}) {
  return (
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
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${
          darkMode
            ? 'bg-gray-700 text-white placeholder-gray-400'
            : 'bg-white text-gray-800 placeholder-gray-500'
        } transition-colors duration-200`}
      ></textarea>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="text-red-500 text-sm mt-1 flex items-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  darkMode: PropTypes.bool,
};

// Email Validation Function
const validateEmail = (email) => {
  // Improved email validation regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Main Contact Component
const Contact = ({ darkMode = false }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, errors, isSubmitting, isSent } = state;

  // Refs for focus management
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  // Focus on the first input field when the component mounts
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  // Handler for input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
  }, []);

  // Form Validation
  const validateForm = useCallback(() => {
    const { name, email, message } = formData;
    const newErrors = { name: '', email: '', message: '', form: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter your message.';
      isValid = false;
    }

    // Honeypot field check (should be empty)
    if (formData.honeypot) {
      isValid = false;
      newErrors.form = 'Spam detected.';
    }

    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return isValid;
  }, [formData]);

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    dispatch({ type: 'SUBMIT_START' });

    if (!validateForm()) {
      // Focus on the first error field
      if (errors.name) {
        nameRef.current?.focus();
      } else if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.message) {
        messageRef.current?.focus();
      }
      dispatch({
        type: 'SUBMIT_FAILURE',
        error: 'Please fix the errors above.',
      });
      return;
    }

    try {
      const backendURL =
        process.env.REACT_APP_BACKEND_URL || 'https://nikitadev.netlify.app/';

      const response = await fetch(`${backendURL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else {
        dispatch({
          type: 'SUBMIT_FAILURE',
          error: result.error || 'Form submission error. Please try again later.',
        });
      }
    } catch (networkError) {
      console.error(networkError);
      dispatch({
        type: 'SUBMIT_FAILURE',
        error: 'Network error. Please try again later.',
      });
    }
  };

  // Handler to reset the sent state
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_SENT' });
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
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
            <AnimatePresence>
              {isSent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-green-500 text-lg font-semibold"
                  aria-live="polite"
                  tabIndex="-1"
                  ref={successRef}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-4xl mb-4"
                    aria-hidden="true"
                  />
                  <p>Thank you, {formData.name || 'Guest'}!</p>
                  <p>Your message has been sent successfully. I'll get back to you soon.</p>
                  <button
                    onClick={handleReset}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-6"
                  noValidate
                  ref={formRef}
                >
                  {/* Honeypot Field (Hidden) */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <InputField
                    label="Name"
                    icon={faUser}
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    error={errors.name}
                    darkMode={darkMode}
                    innerRef={nameRef}
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
                    error={errors.email}
                    darkMode={darkMode}
                    innerRef={emailRef}
                  />
                  <TextAreaField
                    label="Message"
                    icon={faCommentDots}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    error={errors.message}
                    darkMode={darkMode}
                  />
                  {errors.form && (
                    <p className="text-red-500 text-sm mb-2 flex items-center justify-center">
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                      {errors.form}
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
            </AnimatePresence>
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
                window.open('mailto:nikita.development@gmail.com', '_blank')
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

Contact.propTypes = {
  darkMode: PropTypes.bool,
};

export default Contact;
