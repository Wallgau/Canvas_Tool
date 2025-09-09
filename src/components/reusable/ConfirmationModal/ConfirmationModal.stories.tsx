import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import '../../../index.css';

export const Default: Story = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setIsVisible(false);
  };

  const handleCancel = () => {
    console.log('Cancelled!');
    setIsVisible(false);
  };

  return (
    <div className='p-8'>
      <button
        onClick={() => setIsVisible(true)}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Show Confirmation Modal
      </button>

      <ConfirmationModal
        isVisible={isVisible}
        description='Are you sure you want to delete this item? This action cannot be undone.'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export const AlwaysVisible: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className='p-8'>
      <ConfirmationModal
        isVisible={isVisible}
        description='Delete item?'
        onConfirm={() => {
          console.log('Confirmed!');
          setIsVisible(false);
        }}
        onCancel={() => {
          console.log('Cancelled!');
          setIsVisible(false);
        }}
      />
    </div>
  );
};

export const LongDescription: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className='p-8'>
      <ConfirmationModal
        isVisible={isVisible}
        description='Are you absolutely sure you want to permanently delete this item and all of its associated data? This action cannot be undone and will affect all users who have access to this item. Please confirm that you understand the consequences of this action.'
        onConfirm={() => {
          console.log('Confirmed!');
          setIsVisible(false);
        }}
        onCancel={() => {
          console.log('Cancelled!');
          setIsVisible(false);
        }}
      />
    </div>
  );
};

export const MultipleModals: Story = () => {
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);

  return (
    <div className='p-8 space-x-4'>
      <button
        onClick={() => setModal1(true)}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Delete Item
      </button>

      <button
        onClick={() => setModal2(true)}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Clear All
      </button>

      <ConfirmationModal
        isVisible={modal1}
        description='Are you sure you want to delete this item?'
        onConfirm={() => {
          console.log('Item deleted!');
          setModal1(false);
        }}
        onCancel={() => setModal1(false)}
      />

      <ConfirmationModal
        isVisible={modal2}
        description='Are you sure you want to clear all items? This action cannot be undone.'
        onConfirm={() => {
          console.log('All items cleared!');
          setModal2(false);
        }}
        onCancel={() => setModal2(false)}
      />
    </div>
  );
};
