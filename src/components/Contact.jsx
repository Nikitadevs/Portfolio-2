import { useState } from 'react';
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
    if (!formData.name) {
      setError((prev) => ({ ...prev, name: 'Please enter your name.' }));
      hasError = true;
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: 'Please enter your email.' }));
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      setError((prev) => ({
        ...prev,
        email: 'Please enter a valid email address.',
      }));
      hasError = true;
    }
    if (!formData.message) {
      setError((prev) => ({ ...prev, message: 'Please enter your message.' }));
      hasError = true;
    }

    if (hasError) {
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
          form:
            result.error || 'Form submission error. Please try again later.',
        }));
      }
    } catch (error) {
      console.error(error);
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
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                <div className="flex flex-col">
                  <label
                    className="text-left text-sm font-semibold mb-2 flex items-center"
                    htmlFor="name"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-lg" />
                    Name
                  </label>
                  <input
                    className={`shadow-sm border ${
                      error.name ? 'border-red-500' : 'border-gray-300'
                    } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
                      error.name
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    } ${
                      darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    aria-required="true"
                    aria-invalid={error.name ? 'true' : 'false'}
                    aria-describedby="name-error"
                  />
                  {error.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="mr-1"
                      />
                      {error.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-left text-sm font-semibold mb-2 flex items-center"
                    htmlFor="email"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="mr-2 text-lg"
                    />
                    Email
                  </label>
                  <input
                    className={`shadow-sm border ${
                      error.email ? 'border-red-500' : 'border-gray-300'
                    } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
                      error.email
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    } ${
                      darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    aria-required="true"
                    aria-invalid={error.email ? 'true' : 'false'}
                    aria-describedby="email-error"
                  />
                  {error.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="mr-1"
                      />
                      {error.email}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-left text-sm font-semibold mb-2 flex items-center"
                    htmlFor="message"
                  >
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      className="mr-2 text-lg"
                    />
                    Message
                  </label>
                  <textarea
                    className={`shadow-sm border ${
                      error.message ? 'border-red-500' : 'border-gray-300'
                    } rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 ${
                      error.message
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    } ${
                      darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="6"
                    aria-required="true"
                    aria-invalid={error.message ? 'true' : 'false'}
                    aria-describedby="message-error"
                  ></textarea>
                  {error.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="mr-1"
                      />
                      {error.message}
                    </p>
                  )}
                </div>
                {error.form && (
                  <p className="text-red-500 text-sm mb-2">
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                    {error.form}
                  </p>
                )}
                <div className="flex items-center justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
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
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          className="mr-2"
                        />
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
              nikita.development@gmail.com
            </p>
            <button
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
