// Contact.jsx
import React, {
  useReducer,
  memo,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
  Suspense,
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
import emailjs from 'emailjs-com';

const Confetti = React.lazy(() => import('react-confetti'));

const ACTION_TYPES = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_ERRORS: 'SET_ERRORS',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_FAILURE: 'SUBMIT_FAILURE',
  RESET_SENT: 'RESET_SENT',
};

const initialState = {
  formData: {
    name: '',
    email: '',
    message: '',
    honeypot: '',
  },
  sentData: null,
  errors: {
    name: '',
    email: '',
    message: '',
    form: '',
  },
  isSubmitting: false,
  isSent: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FIELD:
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case ACTION_TYPES.SET_ERRORS:
      return { ...state, errors: action.errors };
    case ACTION_TYPES.SUBMIT_START:
      return { ...state, isSubmitting: true, errors: initialState.errors };
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
        errors: { ...state.errors, form: action.error },
      };
    case ACTION_TYPES.RESET_SENT:
      return { ...state, isSent: false, sentData: null };
    default:
      return state;
  }
}

const baseInputClasses =
  'shadow-sm border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 transition-colors duration-200';

const InputField = memo(({ label, icon, id, name, type = 'text', value, onChange, placeholder, error, darkMode, innerRef }) => {
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';
  const themeClasses = darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500';

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-left text-sm font-semibold mb-2 flex items-center">
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
        className={`${baseInputClasses} ${errorClasses} ${themeClasses}`}
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
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

const TextAreaField = memo(({ label, icon, id, name, value, onChange, placeholder, error, darkMode }) => {
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';
  const themeClasses = darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500';

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-left text-sm font-semibold mb-2 flex items-center">
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
        className={`${baseInputClasses} ${errorClasses} ${themeClasses}`}
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

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    if (!name.trim()) { newErrors.name = 'Please enter your name.'; isValid = false; }
    if (!email.trim()) { newErrors.email = 'Please enter your email.'; isValid = false; }
    else if (!validateEmail(email)) { newErrors.email = 'Enter a valid email.'; isValid = false; }
    if (!message.trim()) { newErrors.message = 'Please enter your message.'; isValid = false; }
    else if (message.trim().length < 10) { newErrors.message = 'Message must be at least 10 characters.'; isValid = false; }
    if (honeypot) { newErrors.form = 'Spam detected.'; isValid = false; }

    return { isValid, newErrors };
  }, [formData]);

  return { handleChange, validateForm };
};

const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  hover: { scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)', transition: { duration: 0.3, ease: 'easeInOut' } },
  tap: { scale: 0.98, boxShadow: '0px 5px 15px rgba(0,0,0,0.1)', transition: { duration: 0.1, ease: 'easeInOut' } },
};

const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: '#2563eb', boxShadow: '0px 8px 15px rgba(37,99,235,0.3)', transition: { duration: 0.3, ease: 'easeInOut' } },
  tap: { scale: 0.95, backgroundColor: '#1d4ed8', boxShadow: '0px 4px 10px rgba(29,78,216,0.2)', transition: { duration: 0.1, ease: 'easeInOut' } },
};

const ContactForm = memo(({ darkMode, state, dispatch, handleChange, validateForm, refs, confettiActive, setConfettiActive }) => {
  const { formData, errors, isSubmitting, isSent, sentData } = state;
  const { nameRef, emailRef, messageRef, formRef, successRef } = refs;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !process.env.REACT_APP_EMAILJS_SERVICE_ID ||
      !process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
      !process.env.REACT_APP_EMAILJS_USER_ID
    ) {
      console.error("EmailJS configuration missing.");
      dispatch({
        type: ACTION_TYPES.SUBMIT_FAILURE,
        error: 'Configuration error. Please try again later.',
      });
      return;
    }

    dispatch({ type: ACTION_TYPES.SUBMIT_START });
    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      dispatch({ type: ACTION_TYPES.SET_ERRORS, errors: newErrors });
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.message) messageRef.current?.focus();
      dispatch({ type: ACTION_TYPES.SUBMIT_FAILURE, error: 'Please fix the errors above.' });
      return;
    }

    try {
      const result = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
        process.env.REACT_APP_EMAILJS_USER_ID
      );

      if (result.status === 200) {
        dispatch({ type: ACTION_TYPES.SUBMIT_SUCCESS });
        setConfettiActive(true);
      } else {
        dispatch({ type: ACTION_TYPES.SUBMIT_FAILURE, error: result.text || 'Submission error. Try later.' });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      dispatch({ type: ACTION_TYPES.SUBMIT_FAILURE, error: 'Network error. Try again.' });
    }
  };

  const handleReset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_SENT });
    formRef.current?.focus();
    setConfettiActive(false);
  }, [dispatch, formRef, setConfettiActive]);

  useEffect(() => {
    if (isSent && successRef.current) successRef.current.focus();
  }, [isSent, successRef]);

  return (
    <motion.div
      className={`rounded-lg shadow-lg p-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
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
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-4" aria-hidden="true" />
            <p>Thank you, {sentData?.name || 'Guest'}!</p>
            <p>Your message has been sent. I'll get back to you soon.</p>
            <motion.button
              onClick={handleReset}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Send Another Message
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6" noValidate ref={formRef}>
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
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center ${
                  isSubmitting ? 'cursor-not-allowed opacity-75' : ''
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
              </motion.button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ContactForm.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  refs: PropTypes.object.isRequired,
  confettiActive: PropTypes.bool.isRequired,
  setConfettiActive: PropTypes.func.isRequired,
};

const ContactInfo = memo(({ darkMode }) => (
  <motion.div
    className={`rounded-lg shadow-lg p-6 w-full text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    variants={cardVariants}
    whileHover="hover"
    whileTap="tap"
  >
    <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-blue-500 mb-4" aria-hidden="true" />
    <p className="text-lg sm:text-xl mb-2">n.verk06@gmai.com</p>
    <motion.button
      type="button"
      className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      onClick={() =>
        window.open(
          'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=CllgCJlKFcBWWjjqQSwZTKTwCKHJxKjHcCcCWWbNHKnxJRNzCcBRqphztfqRxCvnDMjFPmPMMHL'
        )
      }
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      aria-label="Send an email"
    >
      Email Me
    </motion.button>
  </motion.div>
));

ContactInfo.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

const Contact = ({ darkMode = false }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData } = state;
  const { handleChange, validateForm } = useContactForm(dispatch, formData);
  const [confettiActive, setConfettiActive] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const refs = { nameRef, emailRef, messageRef, formRef, successRef };

  const themeClasses = useMemo(() => ({
    container: darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black',
  }), [darkMode]);

  return (
    <motion.section
      id="contact"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`p-6 sm:p-8 ${themeClasses.container}`}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto text-center">
        <h2 id="contact-heading" className="text-4xl sm:text-5xl font-extrabold mb-10 border-b pb-4">
          Contact Me
        </h2>
        <div className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto">
          <ContactForm
            darkMode={darkMode}
            state={state}
            dispatch={dispatch}
            handleChange={handleChange}
            validateForm={validateForm}
            refs={refs}
            confettiActive={confettiActive}
            setConfettiActive={setConfettiActive}
          />
          <ContactInfo darkMode={darkMode} />
        </div>
        {confettiActive && (
          <Suspense fallback={null}>
            <Confetti
              numberOfPieces={500}
              recycle={false}
              onConfettiComplete={() => setConfettiActive(false)}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </Suspense>
        )}
      </div>
    </motion.section>
  );
};

Contact.propTypes = {
  darkMode: PropTypes.bool,
};

export default Contact;
