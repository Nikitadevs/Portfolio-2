// ImageCarousel.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const transition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

const ImageCarousel = ({ images }) => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const imageCount = images.length;
  const carouselRef = useRef(null);

  const paginate = useCallback(
    (newDirection) => {
      setCurrent(([prevCurrent]) => [
        (prevCurrent + newDirection + imageCount) % imageCount,
        newDirection,
      ]);
    },
    [imageCount]
  );

  // Keyboard navigation
  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    return () => {
      node.removeEventListener('keydown', handleKeyDown);
    };
  }, [paginate]);

  return (
    <div
      ref={carouselRef}
      className="relative"
      tabIndex="0"
      role="region"
      aria-label="Image Carousel"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={current}
          src={images[current]}
          alt={`Screenshot ${current + 1} of ${images.length}`}
          className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-md"
          loading="lazy"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
        />
      </AnimatePresence>
      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous image"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next image"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageCarousel;
