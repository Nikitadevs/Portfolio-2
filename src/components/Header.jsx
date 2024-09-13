import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faInfoCircle,
  faProjectDiagram,
  faTools,
  faEnvelope,
  faSun,
  faMoon,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

const Header = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showModeMessage, setShowModeMessage] = useState(false);
  const [modeMessage, setModeMessage] = useState('');
  const [activeSection, setActiveSection] = useState('about');

  const sections = ['about', 'projects', 'skills', 'contact'];

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null && JSON.parse(savedMode) !== darkMode) {
      toggleDarkMode();
    }
    setLoaded(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let active = 'about';
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          active = section;
        }
      });
      setActiveSection(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [darkMode, toggleDarkMode, sections]);

  useEffect(() => {
    // Prevent scrolling when sidebar is open
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSocialLinksToggle = () => {
    setShowSocialLinks(!showSocialLinks);
  };

  const handleModeToggle = () => {
    toggleDarkMode();
    const newMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    const message = newMode ? 'Dark Mode Enabled' : 'Light Mode Enabled';
    setModeMessage(message);
    setShowModeMessage(true);
    setTimeout(() => setShowModeMessage(false), 2000);
  };

  const hoverAnimation = {
    scale: 1.1,
    transition: { duration: 0.2 },
  };

  const modeMessageVariants = {
    hidden: { opacity: 0, y: 20, visibility: 'hidden' },
    visible: {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: 20,
      visibility: 'hidden',
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  const socialLinksVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const individualSocialVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { x: '100%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <motion.header
      initial={{ y: -250 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      className={`p-4 fixed w-full top-0 z-50 shadow-lg ${
        darkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-200'
          : 'bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-800'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Header Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight cursor-default"
          whileHover={hoverAnimation}
        >
          My Portfolio
        </motion.h1>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 text-base md:text-lg font-medium items-center">
          {sections.map((section, index) => (
            <motion.a
              key={index}
              href={`#${section}`}
              className={`relative flex items-center group ${
                activeSection === section ? 'text-yellow-400' : ''
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon
                icon={
                  section === 'about'
                    ? faInfoCircle
                    : section === 'projects'
                    ? faProjectDiagram
                    : section === 'skills'
                    ? faTools
                    : faEnvelope
                }
                className="mr-2"
              />
              {section.charAt(0).toUpperCase() + section.slice(1)}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </motion.a>
          ))}

          {/* Social Links */}
          <AnimatePresence>
            {showSocialLinks && (
              <motion.div
                className="flex items-center space-x-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={socialLinksVariants}
              >
                {/* GitHub */}
                <motion.a
                  href="https://github.com/your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  variants={individualSocialVariant}
                  whileHover={hoverAnimation}
                >
                  <FontAwesomeIcon icon={faGithub} className="text-2xl md:text-3xl" />
                  {/* Tooltip */}
                  <motion.span
                    className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    GitHub
                  </motion.span>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/veretenko_06/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  variants={individualSocialVariant}
                  whileHover={hoverAnimation}
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-2xl md:text-3xl" />
                  {/* Tooltip */}
                  <motion.span
                    className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Instagram
                  </motion.span>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  variants={individualSocialVariant}
                  whileHover={hoverAnimation}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-2xl md:text-3xl" />
                  {/* Tooltip */}
                  <motion.span
                    className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    LinkedIn
                  </motion.span>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Toggle Button */}
          <motion.button
            className="hover:underline flex items-center px-4 py-2 bg-yellow-400 text-black font-bold rounded-full transition duration-300 hover:bg-yellow-500"
            onClick={handleSocialLinksToggle}
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
            {showSocialLinks ? 'Close' : 'Social'}
          </motion.button>
        </nav>

        {/* Desktop Dark Mode Toggle */}
        <div className="relative flex items-center">
          <motion.button
            onClick={handleModeToggle}
            className="hidden lg:flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black font-bold transition duration-300 hover:bg-yellow-500 space-x-2"
            whileHover={{ scale: 1.05 }}
            aria-label="Toggle Dark Mode"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            <AnimatePresence>
              {showModeMessage && (
                <motion.span
                  className="ml-2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modeMessageVariants}
                >
                  {modeMessage}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden ml-auto" onClick={handleToggle}>
          <motion.div className={`hamburger ${loaded ? 'loaded' : ''}`}>
            <div className={`line line1 ${darkMode ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`line line2 ${darkMode ? 'bg-white' : 'bg-black'}`}></div>
            <div className={`line line3 ${darkMode ? 'bg-white' : 'bg-black'}`}></div>
          </motion.div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Sidebar Navigation */}
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className={`fixed top-0 right-0 h-full w-80 ${
                darkMode
                  ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200'
                  : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'
              } p-6 overflow-y-auto z-50 shadow-lg rounded-l-lg`}
            >
              {/* Sidebar Header */}
              <div className="flex justify-between items-center mb-6">
                <motion.h1
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Menu
                </motion.h1>
                <motion.button
                  onClick={handleToggle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl focus:outline-none"
                  aria-label="Close Menu"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              </div>

              {/* Sidebar Navigation Links */}
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <motion.a
                    key={index}
                    href={`#${section}`}
                    className={`flex items-center py-3 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                      activeSection === section
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : ''
                    }`}
                    onClick={handleToggle}
                    variants={individualSocialVariant}
                    whileHover={{ scale: 1.05 }}
                  >
                    <FontAwesomeIcon
                      icon={
                        section === 'about'
                          ? faInfoCircle
                          : section === 'projects'
                          ? faProjectDiagram
                          : section === 'skills'
                          ? faTools
                          : faEnvelope
                      }
                      className="mr-3 text-lg"
                    />
                    <span className="text-lg">
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-500"></div>

              {/* Sidebar Dark Mode and Social Toggles */}
              <div className="mt-4 flex flex-col items-start space-y-4">
                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={handleModeToggle}
                  className="flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black font-bold transition duration-300 hover:bg-yellow-500 space-x-2"
                  whileHover={{ scale: 1.05 }}
                  aria-label="Toggle Dark Mode"
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                  <AnimatePresence>
                    {showModeMessage && (
                      <motion.span
                        className="ml-2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modeMessageVariants}
                      >
                        {modeMessage}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Social Toggle Button */}
                <motion.button
                  className="flex items-center px-4 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition duration-300"
                  onClick={handleSocialLinksToggle}
                  whileHover={{ scale: 1.05 }}
                  aria-label="Toggle Social Links"
                >
                  <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                  {showSocialLinks ? 'Close Social' : 'Social'}
                </motion.button>

                {/* Enhanced Social Links in Sidebar */}
                <AnimatePresence>
                  {showSocialLinks && (
                    <motion.div
                      className="mt-4 flex space-x-4 justify-center w-full"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={socialLinksVariants}
                      transition={{ duration: 0.5 }}
                    >
                      {/* GitHub */}
                      <motion.a
                        href="https://github.com/your-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-lg hover:text-yellow-400 transition-colors"
                        variants={individualSocialVariant}
                        whileHover={hoverAnimation}
                        aria-label="GitHub"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                        <span>GitHub</span>
                      </motion.a>

                      {/* Instagram */}
                      <motion.a
                        href="https://www.instagram.com/veretenko_06/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-lg hover:text-yellow-400 transition-colors"
                        variants={individualSocialVariant}
                        whileHover={hoverAnimation}
                        aria-label="Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                        <span>Instagram</span>
                      </motion.a>

                      {/* LinkedIn */}
                      <motion.a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-lg hover:text-yellow-400 transition-colors"
                        variants={individualSocialVariant}
                        whileHover={hoverAnimation}
                        aria-label="LinkedIn"
                      >
                        <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
                        <span>LinkedIn</span>
                      </motion.a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Prop types validation
Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Header;
