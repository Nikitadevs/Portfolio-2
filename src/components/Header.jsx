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

const MotionFontAwesomeIcon = motion(FontAwesomeIcon);

const Header = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showModeMessage, setShowModeMessage] = useState(false);
  const [modeMessage, setModeMessage] = useState('');
  const [activeSection, setActiveSection] = useState('about');

  const sections = ['about', 'projects', 'skills', 'contact'];
  const sectionIcons = {
    about: faInfoCircle,
    projects: faProjectDiagram,
    skills: faTools,
    contact: faEnvelope,
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'about';
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          currentSection = section;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSocialLinksToggle = () => setShowSocialLinks((prev) => !prev);
  const handleModeToggle = () => {
    toggleDarkMode();
    const newMode = !darkMode;
    setModeMessage(newMode ? 'Dark Mode' : 'Light Mode');
    setShowModeMessage(true);
    setTimeout(() => setShowModeMessage(false), 2000);
  };

  const commonHover = { scale: 1.1, transition: { type: 'spring', stiffness: 300 } };
  const navLinkVariants = { initial: { opacity: 1, scale: 1, y: 0 }, hover: { ...commonHover } };
  const underlineVariants = {
    initial: { scaleX: 0, transition: { duration: 0.3, ease: 'linear' } },
    hover: { scaleX: 1, transition: { duration: 0.3, ease: 'linear' } },
  };
  const iconVariants = {
    initial: { color: 'inherit', scale: 1 },
    hover: { scale: 1.3, color: '#F59E0B', transition: { duration: 0.3 } },
    active: { scale: 1.4, color: '#F59E0B', transition: { duration: 0.3 } },
  };
  const sidebarLinkVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, delay: 0.2 } },
    hover: { scale: 1.05, x: 5, transition: { type: 'spring', stiffness: 300 } },
    active: {
      scale: 1.1,
      backgroundColor: darkMode
        ? 'rgba(234, 179, 8, 0.2)'
        : 'rgba(251, 191, 36, 0.2)',
      transition: { duration: 0.3 },
    },
  };
  const sidebarIconVariants = {
    initial: { y: 0 },
    hover: { y: -5, transition: { yoyo: Infinity, duration: 0.3 } },
    active: { scale: 1.4, color: '#F59E0B', transition: { duration: 0.3 } },
  };
  const socialLinksVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };
  const individualSocialVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    exit: {
      opacity: 0, y: 20, scale: 0.8,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
    hover: { scale: 1.4, color: '#F59E0B', transition: { duration: 0.3 } },
    active: { scale: 1.4, color: '#F59E0B', transition: { duration: 0.3 } },
  };
  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { x: '100%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };
  const modeMessageVariants = {
    hidden: { opacity: 0, y: 20, visibility: 'hidden' },
    visible: { opacity: 1, y: 0, visibility: 'visible', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 20, visibility: 'hidden', transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const socialLinksData = [
    { href: 'https://github.com/your-profile', aria: 'GitHub', icon: faGithub },
    { href: 'https://www.instagram.com/veretenko_06/', aria: 'Instagram', icon: faInstagram },
    { href: 'https://linkedin.com', aria: 'LinkedIn', icon: faLinkedin },
  ];

  const SocialLinks = ({
    containerClassName,
    linkClassName,
    iconClassName,
    showLabel,
    showSocialLinks,
  }) => (
    <AnimatePresence>
      {showSocialLinks && (
        <motion.div
          className={containerClassName}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={socialLinksVariants}
        >
          {socialLinksData.map((item) => (
            <motion.a
              key={item.aria}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
              variants={individualSocialVariant}
              aria-label={item.aria}
            >
              <MotionFontAwesomeIcon
                icon={item.icon}
                className={iconClassName}
                variants={iconVariants}
                animate="initial"
                whileHover="hover"
              />
              {showLabel && <span className="text-base md:text-lg">{item.aria}</span>}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.header
      initial={{ y: -250 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      className={classNames(
        'p-4 fixed w-full top-0 z-50 shadow-lg transition-colors duration-500',
        darkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-200'
          : 'bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-800'
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
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
              className="relative flex flex-col items-center group"
              variants={navLinkVariants}
              initial="initial"
              whileHover="hover"
              animate="initial"
              aria-label={`Navigate to ${section}`}
            >
              <motion.div className={classNames('flex items-center', { 'font-semibold': activeSection === section })}>
                <MotionFontAwesomeIcon
                  icon={sectionIcons[section] || faEnvelope}
                  className="mr-2"
                  variants={iconVariants}
                  animate={activeSection === section ? 'active' : 'initial'}
                  whileHover="hover"
                />
                <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              </motion.div>
              <motion.div
                className="h-0.5 bg-yellow-400 mt-1 w-full origin-left"
                variants={underlineVariants}
                initial="initial"
                animate="initial"
                whileHover="hover"
              />
            </motion.a>
          ))}

          {/* Desktop Social Links */}
          <SocialLinks
            showSocialLinks={showSocialLinks}
            containerClassName="flex items-center space-x-4 ml-6"
            linkClassName="flex items-center"
            iconClassName="text-2xl md:text-4xl"
            showLabel={false}
          />

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
            className="hidden lg:flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black font-bold transition-colors duration-300 hover:bg-yellow-500 space-x-2"
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
            className="hamburger"
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`line line1 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 8 } }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className={`line line2 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className={`line line3 ${darkMode ? 'bg-white' : 'bg-black'}`}
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className={classNames(
                'fixed top-0 right-0 h-full w-80 p-6 overflow-y-auto z-50 shadow-2xl rounded-l-lg backdrop-blur-lg transition-colors duration-500',
                darkMode
                  ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200'
                  : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'
              )}
            >
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

              <div className="space-y-4">
                {sections.map((section, index) => (
                  <motion.a
                    key={index}
                    href={`#${section}`}
                    className="flex items-center py-3 px-4 rounded transition-colors"
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
                      animate={activeSection === section ? 'active' : 'initial'}
                      whileHover="hover"
                    />
                    <span className={classNames('text-lg', { 'font-semibold': activeSection === section })}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </span>
                  </motion.a>
                ))}
              </div>

              <div className="my-6 border-t border-gray-500"></div>

              <div className="mt-4 flex flex-col items-start space-y-4">
                <motion.button
                  onClick={() => {
                    handleToggle();
                    handleModeToggle();
                  }}
                  className="flex items-center px-4 py-2 rounded-full bg-yellow-400 text-black font-bold transition-colors duration-300 hover:bg-yellow-500 space-x-2"
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

                <motion.button
                  className="flex items-center px-4 py-2 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition duration-300"
                  onClick={handleSocialLinksToggle}
                  whileHover={{ scale: 1.05 }}
                  aria-label="Toggle Social Links"
                >
                  <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                  {showSocialLinks ? 'Close Social' : 'Social'}
                </motion.button>

                {/* Sidebar Social Links */}
                <SocialLinks
                  showSocialLinks={showSocialLinks}
                  containerClassName="mt-4 flex items-center space-x-4"
                  linkClassName="flex items-center space-x-2"
                  iconClassName="text-2xl md:text-4xl"
                  showLabel={true}
                />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Header;
