import React, { useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCode } from '@fortawesome/free-solid-svg-icons';
import useFocusTrap from './useFocusTrap';
import ImageCarousel from './ImageCarousel';

// Animation variants for backdrop and modal
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: '-50vh', opacity: 0, scale: 0.9 },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    y: '50vh',
    opacity: 0,
    scale: 0.9,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
};

// Reusable Close Button Component
const CloseButton = ({ onClose, darkMode }) => (
  <button
    onClick={onClose}
    className={`absolute top-4 right-4 text-2xl p-2 rounded-full focus:outline-none focus:ring-2 transition-colors ${
      darkMode
        ? 'text-gray-300 hover:text-gray-500 focus:ring-gray-500'
        : 'text-gray-700 hover:text-gray-900 focus:ring-gray-300'
    }`}
    aria-label="Close modal"
  >
    <FontAwesomeIcon icon={faTimes} />
  </button>
);

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

// Reusable Technology Tag Component
const TechTag = ({ tech, darkMode }) => (
  <li
    className={`px-4 py-1 rounded-full text-sm font-medium ${
      darkMode
        ? 'bg-gray-700 text-gray-300'
        : 'bg-gray-200 text-gray-800'
    }`}
  >
    {tech}
  </li>
);

TechTag.propTypes = {
  tech: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

// Reusable Action Button Component
const ActionButton = ({ href, onClick, icon, label, darkMode, isLink }) => {
  const baseClasses = `flex items-center justify-center w-full sm:w-auto font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform focus:outline-none focus:ring-4 ${
    isLink
      ? darkMode
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-green-600 hover:bg-green-700 text-white'
      : darkMode
      ? 'bg-gray-600 hover:bg-gray-700 text-white'
      : 'bg-gray-600 hover:bg-gray-700 text-white'
  }`;

  const hoverTransform = 'hover:scale-105';

  return isLink ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${hoverTransform}`}
      aria-label={label}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={`${baseClasses} ${hoverTransform}`}
      aria-label={label}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </button>
  );
};

ActionButton.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object, // FontAwesome icon object
  label: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
  isLink: PropTypes.bool,
};

ActionButton.defaultProps = {
  isLink: false,
  href: '#',
  onClick: () => {},
  icon: null,
};

// Main ProjectModal Component
const ProjectModal = ({ isOpen, onClose, project, darkMode = false }) => {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  // Trap focus within the modal when open
  useFocusTrap(modalRef, isOpen);

  // Handle Escape key and focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      triggerRef.current = document.activeElement;

      const onEscKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', onEscKeyDown);

      // Prevent body from scrolling when modal is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', onEscKeyDown);
        document.body.style.overflow = 'auto';
      };
    } else if (triggerRef.current) {
      // Return focus to the previously focused element
      triggerRef.current.focus();
    }
  }, [isOpen, onClose]);

  // Close modal when clicking on backdrop
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Destructure project properties for cleaner code
  const {
    title,
    image,
    images,
    description,
    technologies = [],
    codeLink,
  } = project;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 sm:p-0"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className={`relative max-w-3xl w-full mx-auto p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] ${
              darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="document"
            aria-describedby="modal-description"
          >
            {/* Close Button */}
            <CloseButton onClose={onClose} darkMode={darkMode} />

            {/* Modal Content */}
            <div className="modal-content mt-6">
              {/* Project Title */}
              <h2
                id="modal-title"
                className="text-3xl sm:text-4xl font-extrabold mb-6 text-center"
              >
                {title}
              </h2>

              {/* Image or Carousel */}
              {images?.length > 0 ? (
                <ImageCarousel images={images} />
              ) : image ? (
                <div className="mb-6">
                  <img
                    src={image}
                    alt={`Screenshot of ${title}`}
                    className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg transition-transform transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* Description */}
              <p
                id="modal-description"
                className="text-lg sm:text-xl mb-6 leading-relaxed text-justify"
              >
                {description}
              </p>

              {/* Technologies Used */}
              {technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Technologies Used:</h3>
                  <ul className="flex flex-wrap gap-3">
                    {technologies.map((tech, index) => (
                      <TechTag key={index} tech={tech} darkMode={darkMode} />
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {codeLink && (
                  <ActionButton
                    href={codeLink}
                    icon={faCode}
                    label={`View ${title} Code`}
                    darkMode={darkMode}
                    isLink
                  />
                )}
                <ActionButton
                  onClick={onClose}
                  icon={null}
                  label="Close"
                  darkMode={darkMode}
                  isLink={false}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    codeLink: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool,
};

export default memo(ProjectModal);
