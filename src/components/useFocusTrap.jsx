// useFocusTrap.js
import { useEffect } from 'react';

const useFocusTrap = (ref, isOpen) => {
  useEffect(() => {
    if (isOpen && ref.current) {
      const focusableElements = ref.current.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1] || firstElement;

      const trapFocus = (event) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', trapFocus);
      firstElement.focus();

      return () => {
        document.removeEventListener('keydown', trapFocus);
      };
    }
  }, [isOpen, ref]);
};

export default useFocusTrap;
