import type { Story } from '@ladle/react';
import { useState } from 'react';
import Input from './Input';
import '../../../index.css';

export const Default: Story = () => (
  <Input placeholder="Enter text..." />
);

export const WithValue: Story = () => (
  <Input value="Hello World" placeholder="Enter text..." />
);

export const Disabled: Story = () => (
  <Input placeholder="Disabled input" disabled={true} />
);

export const WithLabel: Story = () => {
  const [value, setValue] = useState('');
  return (
    <div className="w-64">
      <label
        htmlFor="input-with-label"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Label
      </label>
      <Input
        id="input-with-label"
        placeholder="Enter text..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
};

export const Interactive: Story = () => {
  const [value, setValue] = useState('');
  return (
    <div className="w-64">
      <Input
        placeholder="Type something..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <p className="mt-2 text-sm text-gray-600">Value: {value}</p>
    </div>
  );
};