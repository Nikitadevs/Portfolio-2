import { useReducer } from 'react';
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

// Environment Variable for Formspree Endpoint
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xvgpavpe';

// Initial state for the reducer
const initialState = {
  formData: {
    name: '',
    email: '',
    message: '',
  },
  isSent: false,
  isSubmitting: false,
  error: {
    name: '',
    email: '',
    message: '',
    form: '',
  },
};

// Reducer function to manage form state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FIELD_CHANGE':
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
        error: { ...state.error, ...action.errors },
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: { name: '', email: '', message: '', form: '' } };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        isSent: true,
        formData: { name: '', email: '', message: '' },
      };
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmitting: false,
        error: { ...state.error, form: action.error },
      };
    default:
      return state;
  }
};

// Custom hook for managing contact form
const useContactForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'FIELD_CHANGE', field: name, value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });

    const { name, email, message } = state.formData;
    const errors = {};

    // Client-side validation
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!email.trim()) {
      errors.email = 'Please enter your email.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) errors.message = 'Please enter your message.';

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      dispatch({ type: 'SUBMIT_FAILURE', error: 'Please fix the errors above.' });
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.formData),
      });

      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' });
      } else {
        const result = await response.json();
        dispatch({
          type: 'SUBMIT_FAILURE',
          error: result.error || 'Form submission error. Please try again later.',
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'SUBMIT_FAILURE',
        error: 'Network error. Please try again later.',
      });
    }
  };

  return { state, handleChange, handleSubmit };
};

// Sub-component for form fields
const FormField = ({
  id,
  label,
  icon,
  type = 'text',
  name,
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
    {type !== 'textarea' ? (
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    ) : (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="6"
        className={`shadow-sm border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      ></textarea>
    )}
    {error && (
      <p id={`${id}-error`} className="text-red-500 text-sm mt-1 flex items-center">
        <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
        {error}
      </p>
    )}
  </div>
);

// Main Contact Component
const Contact = ({ darkMode }) => {
  const { state, handleChange, handleSubmit } = useContactForm();
  const { formData, isSent, isSubmitting, error } = state;

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`p-6 sm:p-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
          Contact Me
        </h2>
        <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto">
          <motion.div
            className={`rounded-lg shadow-lg p-6 w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {isSent ? (
              <div className="flex flex-col items-center text-green-500 text-lg font-semibold">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-4" />
                <p>Your message has been sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6" noValidate>
                <FormField
                  id="name"
                  label="Name"
                  icon={faUser}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  error={error.name}
                  darkMode={darkMode}
                />
                <FormField
                  id="email"
                  label="Email"
                  icon={faEnvelope}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  error={error.email}
                  darkMode={darkMode}
                />
                <FormField
                  id="message"
                  label="Message"
                  icon={faCommentDots}
                  type="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  error={error.message}
                  darkMode={darkMode}
                />
                {error.form && (
                  <p className="text-red-500 text-sm mb-2 flex items-center">
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
          <motion.div
            className={`rounded-lg shadow-lg p-6 w-full text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-4xl text-blue-500 mb-4"
            />
            <p className="text-lg sm:text-xl mb-2">
              <a href="mailto:nikita.development@gmail.com" className="hover:underline">
                nikita.development@gmail.com
              </a>
            </p>
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
