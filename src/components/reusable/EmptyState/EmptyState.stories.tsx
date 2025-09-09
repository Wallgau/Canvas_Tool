import type { Story } from '@ladle/react';
import { Plus, Search, Wrench } from 'lucide-react';
import { EmptyState } from './EmptyState';
import '../../../index.css';

export const Default: Story = () => (
  <div className='min-h-96 flex items-center justify-center'>
    <EmptyState
      title='No tools have been added'
      description='Get started by adding your first tool to the canvas. You can drag and drop tools from the sidebar or use the add button.'
    />
  </div>
);

export const WithAction: Story = () => (
  <div className='min-h-96 flex items-center justify-center'>
    <EmptyState
      title='No tools have been added'
      description='Get started by adding your first tool to the canvas. You can drag and drop tools from the sidebar or use the add button.'
      actionText='Add First Tool'
      onAction={() => console.log('Add tool clicked')}
    />
  </div>
);

export const CustomIcon: Story = () => (
  <div className='min-h-96 flex items-center justify-center'>
    <EmptyState
      title='No tools have been added'
      description='Get started by adding your first tool to the canvas. You can drag and drop tools from the sidebar or use the add button.'
      actionText='Add First Tool'
      onAction={() => console.log('Add tool clicked')}
      icon={
        <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100'>
          <Wrench className='h-12 w-12 text-blue-600' />
        </div>
      }
    />
  </div>
);

export const Compact: Story = () => (
  <div className='min-h-64 flex items-center justify-center'>
    <EmptyState
      title='No data'
      description="There's nothing to show here yet."
      className='py-8'
    />
  </div>
);

export const WithCustomStyling: Story = () => (
  <div className='min-h-96 flex items-center justify-center bg-gray-50'>
    <EmptyState
      title='No tools have been added'
      description='Get started by adding your first tool to the canvas. You can drag and drop tools from the sidebar or use the add button.'
      actionText='Get Started'
      onAction={() => console.log('Get started clicked')}
      className='bg-white rounded-lg shadow-sm p-8 border border-gray-200'
    />
  </div>
);
