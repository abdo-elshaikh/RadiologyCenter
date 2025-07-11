import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ open, onClose, title, children, actions }) => {
  const modalRef = useRef(null);

  // Focus trap and close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Trap focus
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus modal on open
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabIndex={-1}
    >
      <div
        className="bg-base-100 rounded-xl shadow-lg w-full max-w-lg p-6 relative outline-none"
        ref={modalRef}
        tabIndex={0}
      >
        <button
          className="btn btn-sm btn-circle absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        {title && <h3 id="modal-title" className="text-xl font-bold mb-4">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
};

export default Modal; 