// ProjectModal.jsx
import React, { useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import useFocusTrap from './useFocusTrap';
import ImageCarousel from './ImageCarousel';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalVariants = {
  hidden: { y: '-50vh', opacity: 0, scale: 0.9 },
  visible: { y: '0', opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { y: '50vh', opacity: 0, scale: 0.9, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

const TechTag = memo(({ tech, darkMode }) => (
  <li
    className={`px-4 py-1 rounded-full text-sm font-medium border transition-colors 
      ${darkMode
        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
        : 'bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300'}`}
  >
    {tech}
  </li>
));

TechTag.propTypes = {
  tech: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

const ActionButton = memo(({ href, onClick, icon, label, darkMode, isLink }) => {
  const baseClasses = `flex items-center justify-center w-full sm:w-auto font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform focus:outline-none focus:ring-4`;
  const colorClasses = isLink
    ? darkMode
      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white focus:ring-blue-300'
      : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white focus:ring-green-300'
    : darkMode
      ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-400'
      : 'bg-gray-300 hover:bg-gray-400 text-gray-900 focus:ring-gray-500';
  const hoverTransform = 'hover:scale-105';

  return isLink ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${colorClasses} ${hoverTransform}`}
      aria-label={label}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${hoverTransform}`}
      aria-label={label}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </button>
  );
});

ActionButton.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object,
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

const ProjectModal = ({ isOpen, onClose, project, darkMode = false }) => {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      const onEscKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', onEscKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', onEscKeyDown);
        document.body.style.overflow = 'auto';
      };
    } else if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  const { title, image, images, description, technologies = [], codeLink } = project;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 sm:p-0"
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
            className={`relative max-w-3xl w-full mx-auto p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border transition-colors duration-300 
              ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="document"
            aria-describedby="modal-description"
          >
            <div className="modal-content mt-6 space-y-8">
              <h2
                id="modal-title"
                className="text-3xl sm:text-4xl font-extrabold mb-6 text-center border-b pb-4"
              >
                {title}
              </h2>

              {images?.length > 0 ? (
                <ImageCarousel images={images} />
              ) : image ? (
                <div className="mb-6 overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={image}
                    alt={`Screenshot of ${title}`}
                    className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <p
                id="modal-description"
                className="text-lg sm:text-xl leading-relaxed text-justify"
              >
                {description}
              </p>

              {technologies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Technologies Used:</h3>
                  <ul className="flex flex-wrap gap-3">
                    {technologies.map((tech, index) => (
                      <TechTag key={index} tech={tech} darkMode={darkMode} />
                    ))}
                  </ul>
                </div>
              )}

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
