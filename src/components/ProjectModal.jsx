import { useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useFocusTrap from './useFocusTrap';
import ImageCarousel from './ImageCarousel';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: '-50%', opacity: 0 },
  visible: { y: '0%', opacity: 1 },
};

const ProjectModal = ({ isOpen, onClose, project, darkMode }) => {
  const modalRef = useRef(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      const onEscKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onEscKeyDown);
      return () => document.removeEventListener('keydown', onEscKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
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
            className={`relative max-w-lg w-full mx-2 sm:mx-4 p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${
              darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="document"
          >
            <button
              onClick={onClose}
              className={`absolute top-3 right-3 text-xl p-2 rounded-full focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'text-gray-300 hover:text-gray-500 focus:ring-gray-500'
                  : 'text-gray-700 hover:text-gray-900 focus:ring-gray-300'
              }`}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="modal-content">
              <h2
                id="modal-title"
                className="text-xl sm:text-2xl font-bold mb-4 text-center"
              >
                {project.title}
              </h2>
              {project.images ? (
                <ImageCarousel images={project.images} />
              ) : (
                <div className="mb-4 sm:mb-6">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    className="w-full h-40 sm:h-60 object-cover rounded-lg shadow-md"
                    loading="lazy"
                  />
                </div>
              )}
              <p className="text-sm sm:text-base mb-4 leading-relaxed">
                {project.description}
              </p>
              {project.technologies && (
                <div className="text-sm mb-4 text-center">
                  <strong>Technologies Used:</strong>{' '}
                  {project.technologies.join(', ')}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                      darkMode
                        ? 'hover:bg-blue-700 focus:ring-blue-300'
                        : 'hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                    aria-label={`View ${project.title} live`}
                  >
                    View Live
                  </a>
                )}
                {project.codeLink && (
                  <a
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                      darkMode
                        ? 'hover:bg-green-700 focus:ring-green-300'
                        : 'hover:bg-green-700 focus:ring-green-500'
                    }`}
                    aria-label={`View ${project.title} code`}
                  >
                    View Code
                  </a>
                )}
                <button
                  onClick={onClose}
                  className={`w-full sm:w-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                    darkMode
                      ? 'hover:bg-gray-700 focus:ring-gray-300'
                      : 'hover:bg-gray-700 focus:ring-gray-500'
                  }`}
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
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
    codeLink: PropTypes.string,
  }).isRequired,
  darkMode: PropTypes.bool,
};

ProjectModal.defaultProps = {
  darkMode: false,
};

export default memo(ProjectModal);
