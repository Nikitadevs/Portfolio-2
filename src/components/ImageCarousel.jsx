// ImageCarousel.js
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden rounded-lg h-60">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Project screenshot ${index + 1}`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous image"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next image"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageCarousel;
