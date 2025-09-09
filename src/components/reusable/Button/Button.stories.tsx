import type { Story } from '@ladle/react';
import Button from './Button';
import '../../../index.css';

export const Default: Story = () => (
  <Button description='Default Button' variant='primary' />
);

export const AllVariants: Story = () => (
  <div className='flex flex-wrap gap-4'>
    <Button description='Primary' variant='primary' />
    <Button description='Secondary' variant='secondary' />
    <Button description='Destructive' variant='destructive' />
    <Button description='Outline' variant='outline' />
    <Button description='Ghost' variant='ghost' />
    <Button description='Link' variant='link' />
  </div>
);

export const Disabled: Story = () => (
  <Button description='Disabled Button' variant='primary' disabled={true} />
);

export const WithClick: Story = () => (
  <Button
    description='Click Me'
    variant='primary'
    onClick={() => alert('Button clicked!')}
  />
);
