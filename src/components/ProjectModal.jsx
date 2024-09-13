// ProjectModal.jsx
import { useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExternalLinkAlt, faCode } from '@fortawesome/free-solid-svg-icons';
import useFocusTrap from './useFocusTrap';
import ImageCarousel from './ImageCarousel';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-100vh", opacity: 0, scale: 0.8 },
  visible: { y: "0", opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { y: "100vh", opacity: 0, scale: 0.8, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

const ProjectModal = ({ isOpen, onClose, project, darkMode }) => {
  const modalRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      const onEscKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onEscKeyDown);
      return () => document.removeEventListener('keydown', onEscKeyDown);
    } else if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 sm:p-0"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            className={`relative max-w-3xl w-full mx-auto p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh] ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="document"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 text-2xl p-2 rounded-full focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-gray-500 focus:ring-gray-500'
                  : 'text-gray-700 hover:text-gray-900 focus:ring-gray-300'
              }`}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Modal Content */}
            <div className="modal-content mt-6">
              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              >
                {project.title}
              </h2>

              {/* Image or Carousel */}
              {project.images && project.images.length > 0 ? (
                <ImageCarousel images={project.images} />
              ) : project.image ? (
                <div className="mb-6">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-md"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* Description */}
              <p className="text-base sm:text-lg mb-6 leading-relaxed text-justify">
                {project.description}
              </p>

              {/* Technologies Used */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Technologies Used:</h3>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <li
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 ${
                      darkMode
                        ? 'focus:ring-blue-300'
                        : 'focus:ring-blue-500'
                    }`}
                    aria-label={`View ${project.title} live`}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                    View Live
                  </a>
                )}
                {project.codeLink && (
                  <a
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full sm:w-auto bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-4 ${
                      darkMode
                        ? 'focus:ring-green-300'
                        : 'focus:ring-green-500'
                    }`}
                    aria-label={`View ${project.title} code`}
                  >
                    <FontAwesomeIcon icon={faCode} className="mr-2" />
                    View Code
                  </a>
                )}
                <button
                  onClick={onClose}
                  className={`flex items-center justify-center w-full sm:w-auto bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-4 ${
                    darkMode
                      ? 'focus:ring-gray-300'
                      : 'focus:ring-gray-500'
                  }`}
                  aria-label="Close modal"
                >
                  Close
                </button>
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
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
    codeLink: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default memo(ProjectModal);
