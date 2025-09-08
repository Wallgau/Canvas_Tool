/**
 * ConfirmationModal - Reusable confirmation dialog with React Portal
 * Provides a better UX than window.confirm
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';
import styles from './ConfirmationModal.module.css';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
}): React.JSX.Element | null => {
  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus the modal when it opens
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal) {
        modal.focus();
      }
    }

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = (): void => {
    onConfirm();
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        aria-describedby='modal-message'
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id='modal-title' className={styles.title}>
            {title}
          </h2>
        </div>

        <div className={styles.content}>
          <p id='modal-message' className={styles.message}>
            {message}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant='outline'
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'primary'}
            onClick={handleConfirm}
            className={styles.confirmButton}
            autoFocus
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render modal using React Portal
  return createPortal(modalContent, document.body);
};
