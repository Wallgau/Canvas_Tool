import React from 'react';
import Button from '../Button/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

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
  variant = 'destructive',
}): React.JSX.Element | null => {
  return (
    <Dialog open={isVisible} onOpenChange={onCancel}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel} description='Cancel' />
          <Button
            variant={variant}
            onClick={onConfirm}
            description={confirmButtonText}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
