import { useState, useEffect, useCallback } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ScrollToTopBottom = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTop, setIsTop] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update visibility based on scroll distance
    setIsVisible(scrollTop > 300);
    
    // Calculate scroll progress
    const progress = (scrollTop / docHeight) * 100;
    setScrollProgress(progress);
    
    // Determine if closer to top half of page or bottom half
    setIsTop(scrollTop < docHeight / 2);
  }, []);

  const scrollTo = () => {
    window.scrollTo({
      top: isTop ? document.documentElement.scrollHeight : 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check on mount
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="scroll-to-top-bottom">
      {isVisible && (
        <div 
          className="scroll-to-top-bottom-button cursor-pointer" 
          onClick={scrollTo}
          aria-label="Scroll"
        >
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
