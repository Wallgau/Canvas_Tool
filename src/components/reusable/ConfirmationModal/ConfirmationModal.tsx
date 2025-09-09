import React from 'react';
import Button from '../Button/Button';

export interface ConfirmationModalProps {
  isVisible: boolean;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
  variant?: 'destructive' | 'primary' | 'success';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  description,
  onCancel,
  onConfirm,
  confirmButtonText,
  variant = 'destructive'
}): React.JSX.Element | null => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4'>
      <div
        className='bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-description'
      >
        <div className='p-6'>
          <div className='text-center'>
            <p id='modal-description' className='text-base text-gray-900 mb-6'>
              {description}
            </p>
          </div>
          <div className='flex gap-3 justify-center'>
            <Button variant='outline' onClick={onCancel} description="Cancel"/>
            <Button
              variant={variant}
              onClick={onConfirm}
              description={confirmButtonText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
