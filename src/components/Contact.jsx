// Contact.jsx
import React, {
  useReducer,
  memo,
  useCallback,
  useRef,
  useEffect,
  useMemo,
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
import emailjs from 'emailjs-com'; // <-- Import EmailJS

// Action Types
const ACTION_TYPES = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_ERRORS: 'SET_ERRORS',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_FAILURE: 'SUBMIT_FAILURE',
  RESET_SENT: 'RESET_SENT',
};

// Initial State for useReducer
const initialState = {
  formData: {
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for spam prevention
  },
  sentData: null, // To store data for success message
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
    case ACTION_TYPES.UPDATE_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case ACTION_TYPES.SET_ERRORS:
      return {
        ...state,
        errors: action.errors,
      };
    case ACTION_TYPES.SUBMIT_START:
      return {
        ...state,
        isSubmitting: true,
        errors: initialState.errors,
      };
    case ACTION_TYPES.SUBMIT_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        isSent: true,
        sentData: { name: state.formData.name },
        formData: initialState.formData,
      };
    case ACTION_TYPES.SUBMIT_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        errors: {
          ...state.errors,
          form: action.error,
        },
      };
    case ACTION_TYPES.RESET_SENT:
      return {
        ...state,
        isSent: false,
        sentData: null,
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

// Custom Hook for Form Handling
const useContactForm = (dispatch, formData) => {
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch({ type: ACTION_TYPES.UPDATE_FIELD, field: name, value });
    },
    [dispatch]
  );

  const validateForm = useCallback(() => {
    const { name, email, message, honeypot } = formData;
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
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    // Honeypot field check (should be empty)
    if (honeypot) {
      isValid = false;
      newErrors.form = 'Spam detected.';
    }

    return { isValid, newErrors };
  }, [formData]);

  return { handleChange, validateForm };
};

// Main Contact Component
const Contact = ({ darkMode = false }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, sentData, errors, isSubmitting, isSent } = state;

  // Refs for focus management
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  // Utilize the custom hook
  const { handleChange, validateForm } = useContactForm(dispatch, formData);

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    dispatch({ type: ACTION_TYPES.SUBMIT_START });

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      dispatch({ type: ACTION_TYPES.SET_ERRORS, errors: newErrors });

      // Focus on the first error field
      if (newErrors.name) {
        nameRef.current?.focus();
      } else if (newErrors.email) {
        emailRef.current?.focus();
      } else if (newErrors.message) {
        messageRef.current?.focus();
      }

      dispatch({
        type: ACTION_TYPES.SUBMIT_FAILURE,
        error: 'Please fix the errors above.',
      });
      return;
    }

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
        process.env.REACT_APP_EMAILJS_USER_ID // Public Key
      );

      if (result.status === 200) {
        dispatch({ type: ACTION_TYPES.SUBMIT_SUCCESS });
      } else {
        dispatch({
          type: ACTION_TYPES.SUBMIT_FAILURE,
          error: result.text || 'Form submission error. Please try again later.',
        });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      dispatch({
        type: ACTION_TYPES.SUBMIT_FAILURE,
        error: 'Network error. Please try again later.',
      });
    }
  };

  // Handler to reset the sent state
  const handleReset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_SENT });
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  // Effect to focus on success message when sent
  useEffect(() => {
    if (isSent && successRef.current) {
      successRef.current.focus();
    }
  }, [isSent]);

  // Memoize the theme classes to prevent unnecessary recalculations
  const themeClasses = useMemo(
    () => ({
      container: darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black',
      formBackground: darkMode ? 'bg-gray-800' : 'bg-white',
      infoBackground: darkMode ? 'bg-gray-800' : 'bg-white',
    }),
    [darkMode]
  );

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`p-6 sm:p-8 ${themeClasses.container}`}
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
            className={`rounded-lg shadow-lg p-6 w-full ${themeClasses.formBackground}`}
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
                  <p>Thank you, {sentData?.name || 'Guest'}!</p>
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
                    aria-hidden="true"
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
                    <motion.p
                      className="text-red-500 text-sm mb-2 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                      {errors.form}
                    </motion.p>
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
            className={`rounded-lg shadow-lg p-6 w-full text-center ${themeClasses.infoBackground}`}
            whileHover={{ scale: 1.02 }}
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-4xl text-blue-500 mb-4"
              aria-hidden="true"
            />
            <p className="text-lg sm:text-xl mb-2">n.verk06@gmai.com</p>
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              onClick={() =>
                window.open('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=CllgCJlKFcBWWjjqQSwZTKTwCKHJxKjHcCcCWWbNHKnxJRNzCcBRqphztfqRxCvnDMjFPmPMMHL')
              }
              aria-label="Send an email to n.verk06@gmai.com"
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
