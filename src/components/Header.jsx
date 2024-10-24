// src/components/Header.jsx

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
import classNames from 'classnames';

// Define a motion-enhanced version of FontAwesomeIcon
const MotionFontAwesomeIcon = motion(FontAwesomeIcon);

const Header = ({ toggleDarkMode, darkMode }) => {
  // State to handle mobile sidebar visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State to handle visibility of social links
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  
  // States to handle dark mode toggle messages
  const [showModeMessage, setShowModeMessage] = useState(false);
  const [modeMessage, setModeMessage] = useState('');
  
  // State to track the currently active section based on scroll
  const [activeSection, setActiveSection] = useState('about');

  // Array of section IDs corresponding to portfolio sections
  const sections = ['about', 'projects', 'skills', 'contact'];

  // Mapping object for section icons
  const sectionIcons = {
    about: faInfoCircle,
    projects: faProjectDiagram,
    skills: faTools,
    contact: faEnvelope,
  };

  // Handle scroll to set active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'about'; // Default section

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          currentSection = section;
        }
      });

      setActiveSection(currentSection);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Cleanup function to remove the listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

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

  // Function to toggle mobile sidebar
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Function to toggle visibility of social links
  const handleSocialLinksToggle = () => {
    setShowSocialLinks(!showSocialLinks);
  };

  // Function to toggle dark mode and display a temporary message
  const handleModeToggle = () => {
    toggleDarkMode();
    const newMode = !darkMode;
    const message = newMode ? 'Dark Mode' : 'Light Mode';
    setModeMessage(message);
    setShowModeMessage(true);
    setTimeout(() => setShowModeMessage(false), 2000);
  };

  // Common variants for hover states
  const commonHover = {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 300 },
  };

  // Variants for navigation links
  const navLinkVariants = {
    initial: { opacity: 1, scale: 1, y: 0 },
    hover: { ...commonHover },
  };

  // Underline animation variants without 'active' state
  const underlineVariants = {
    initial: { 
      scaleX: 0,
      transition: { duration: 0.3, ease: 'linear' }, // Linear transition
    },
    hover: { 
      scaleX: 1,
      transition: { duration: 0.3, ease: 'linear' }, // Linear transition
    },
  };

  // Updated iconVariants with 'active' state
  const iconVariants = {
    initial: { color: 'inherit', scale: 1 },
    hover: {
      scale: 1.3,
      color: '#F59E0B',
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.4,
      color: '#F59E0B',
      transition: { duration: 0.3 },
    },
  };

  // Variants for sidebar navigation links
  const sidebarLinkVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, delay: 0.2 },
    },
    hover: {
      scale: 1.05,
      x: 5,
      transition: { type: 'spring', stiffness: 300 },
    },
    active: {
      scale: 1.1,
      backgroundColor: darkMode
        ? 'rgba(234, 179, 8, 0.2)'
        : 'rgba(251, 191, 36, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  // Variants for sidebar icons
  const sidebarIconVariants = {
    initial: { y: 0 },
    hover: {
      y: -5,
      transition: {
        yoyo: Infinity,
        duration: 0.3,
      },
    },
    active: {
      scale: 1.4,
      color: '#F59E0B',
      transition: { duration: 0.3 },
    },
  };

  // Variants for social links animations
  const socialLinksVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Variants for individual social link animations
  const individualSocialVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    hover: {
      scale: 1.4,
      color: '#F59E0B',
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.4,
      color: '#F59E0B',
      transition: { duration: 0.3 },
    },
  };

  // Variants for mobile sidebar animations
  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  // Variants for mode toggle message animations
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

  return (
    <motion.header
      initial={{ y: -250 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      className={classNames(
        'p-4 fixed w-full top-0 z-50 shadow-lg',
        darkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-200'
          : 'bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-800'
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Header Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight cursor-default"
          whileHover={{ scale: 1.05 }}
        >
          My Portfolio
        </motion.h1>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 text-base md:text-lg font-medium items-center">
          {sections.map((section, index) => (
            <motion.a
              key={index}
              href={`#${section}`}
              className={`relative flex flex-col items-center group`}
              variants={navLinkVariants}
              initial="initial"
              whileHover="hover"
              animate="initial"
              aria-label={`Navigate to ${section}`}
            >
              <motion.div
                className={classNames('flex items-center', {
                  'font-semibold': activeSection === section, // Bold text for active section
                })}
              >
                <MotionFontAwesomeIcon
                  icon={sectionIcons[section] || faEnvelope}
                  className="mr-2"
                  variants={iconVariants}
                  animate={activeSection === section ? 'active' : 'initial'} // Apply 'active' variant if active
                  whileHover="hover"
                />
                <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              </motion.div>
              {/* Underline remains only on hover */}
              <motion.div
                className="h-0.5 bg-yellow-400 mt-1 w-full origin-left"
                variants={underlineVariants}
                initial="initial"
                animate="initial"
                whileHover="hover"
              />
            </motion.a>
          ))}

          {/* Social Links */}
          <AnimatePresence>
            {showSocialLinks && (
              <motion.div
                className="flex items-center space-x-4 ml-6"
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
                  className="flex items-center"
                  variants={individualSocialVariant}
                  aria-label="GitHub"
                >
                  <MotionFontAwesomeIcon
                    icon={faGithub}
                    className="text-2xl md:text-4xl"
                    variants={iconVariants}
                    animate="initial"
                    whileHover="hover"
                  />
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/veretenko_06/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  variants={individualSocialVariant}
                  aria-label="Instagram"
                >
                  <MotionFontAwesomeIcon
                    icon={faInstagram}
                    className="text-2xl md:text-4xl"
                    variants={iconVariants}
                    animate="initial"
                    whileHover="hover"
                  />
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  variants={individualSocialVariant}
                  aria-label="LinkedIn"
                >
                  <MotionFontAwesomeIcon
                    icon={faLinkedin}
                    className="text-2xl md:text-4xl"
                    variants={iconVariants}
                    animate="initial"
                    whileHover="hover"
                  />
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Toggle Button */}
          <motion.button
            className="hover:underline flex items-center px-4 py-2 bg-yellow-400 text-black font-bold rounded-full transition duration-300 hover:bg-yellow-500"
            onClick={handleSocialLinksToggle}
            whileHover={{ scale: 1.05 }}
            aria-label="Toggle Social Links"
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
          <motion.div
            className={`hamburger ${/* loaded ? 'loaded' : '' */ ''}`} // Removed 'loaded' as it's not set in the code
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`line line1 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className={`line line2 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className={`line line3 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
              transition={{ duration: 0.5 }}
            />
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
              className={classNames(
                'fixed top-0 right-0 h-full w-80 p-6 overflow-y-auto z-50 shadow-lg rounded-l-lg',
                darkMode
                  ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200'
                  : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'
              )}
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
                    className={`flex items-center py-3 px-4 rounded transition-colors`}
                    onClick={handleToggle}
                    variants={sidebarLinkVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    aria-label={`Navigate to ${section}`}
                  >
                    <MotionFontAwesomeIcon
                      icon={sectionIcons[section] || faEnvelope}
                      className="mr-3 text-lg"
                      variants={sidebarIconVariants}
                      animate={activeSection === section ? 'active' : 'initial'} // Apply 'active' variant if active
                      whileHover="hover"
                    />
                    <span
                      className={classNames('text-lg', {
                        'font-semibold': activeSection === section, // Bold text for active section
                      })}
                    >
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
                  onClick={() => {
                    handleToggle();
                    handleModeToggle();
                  }}
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
                      className="mt-4 flex items-center space-x-4"
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
                        className="flex items-center space-x-2"
                        variants={individualSocialVariant}
                        aria-label="GitHub"
                      >
                        <MotionFontAwesomeIcon
                          icon={faGithub}
                          className="text-2xl md:text-4xl"
                          variants={iconVariants}
                          animate="initial"
                          whileHover="hover"
                        />
                        <span className="text-base md:text-lg">GitHub</span>
                      </motion.a>

                      {/* Instagram */}
                      <motion.a
                        href="https://www.instagram.com/veretenko_06/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                        variants={individualSocialVariant}
                        aria-label="Instagram"
                      >
                        <MotionFontAwesomeIcon
                          icon={faInstagram}
                          className="text-2xl md:text-4xl"
                          variants={iconVariants}
                          animate="initial"
                          whileHover="hover"
                        />
                        <span className="text-base md:text-lg">Instagram</span>
                      </motion.a>

                      {/* LinkedIn */}
                      <motion.a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                        variants={individualSocialVariant}
                        aria-label="LinkedIn"
                      >
                        <MotionFontAwesomeIcon
                          icon={faLinkedin}
                          className="text-2xl md:text-4xl"
                          variants={iconVariants}
                          animate="initial"
                          whileHover="hover"
                        />
                        <span className="text-base md:text-lg">LinkedIn</span>
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
