import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef, isOpen, onClose) {
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus first focusable element
    const firstFocusable = container.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableEls = container.querySelectorAll(FOCUSABLE);
      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, [isOpen, containerRef, onClose]);
}
