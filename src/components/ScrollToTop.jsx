import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollToTopBottom = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTop, setIsTop] = useState(true);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const calculateScrollProgress = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = (scrollTop / windowHeight) * 100;
    setScrollProgress(scroll);

    // Determine if at top or bottom
    setIsTop(scrollTop < windowHeight / 2);
  };

  const scrollTo = () => {
    if (isTop) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('scroll', calculateScrollProgress);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('scroll', calculateScrollProgress);
    };
  }, []);

  return (
    <div className="scroll-to-top-bottom">
      {isVisible && (
        <div className="scroll-to-top-bottom-button" onClick={scrollTo}>
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${scrollProgress}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          {isTop ? <FaArrowDown /> : <FaArrowUp />}
        </div>
      )}
    </div>
  );
};

export default ScrollToTopBottom;
