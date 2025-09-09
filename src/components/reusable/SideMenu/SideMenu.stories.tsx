import type { Story } from '@ladle/react';
import { useState } from 'react';
import SideMenu from './SideMenu';
import type { SideMenuOption } from './SideMenu.types';
import '../../../index.css';

const sampleOptions: SideMenuOption[] = [
  {
    id: '1',
    title: 'Option 1',
    description: 'First option description',
    disabled: false,
  },
  {
    id: '2',
    title: 'Option 2',
    description: 'Second option description',
    disabled: false,
  },
  {
    id: '3',
    title: 'Option 3',
    description: 'Third option description',
    disabled: true,
  },
];

export const Default: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: SideMenuOption) => {
    setSelectedOption(option.title);
    console.log('Selected:', option);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      <div className="p-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isVisible ? 'Hide' : 'Show'} SideMenu
        </button>
        {selectedOption && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedOption}
          </p>
        )}
      </div>

      <SideMenu
        options={sampleOptions}
        isVisible={isVisible}
        onSelect={handleSelect}
        onClose={() => setIsVisible(false)}
        title="Select a Tool"
      />
    </div>
  );
};

export const LeftPosition: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="relative h-screen bg-gray-100">
      <div className="p-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle SideMenu
        </button>
      </div>

      <SideMenu
        options={sampleOptions}
        isVisible={isVisible}
        onSelect={(option) => console.log('Selected:', option)}
        onClose={() => setIsVisible(false)}
        title="Left Side Menu"
        position="left"
      />
    </div>
  );
};

export const RightPosition: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="relative h-screen bg-gray-100">
      <div className="p-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle SideMenu
        </button>
      </div>

      <SideMenu
        options={sampleOptions}
        isVisible={isVisible}
        onSelect={(option) => console.log('Selected:', option)}
        onClose={() => setIsVisible(false)}
        title="Right Side Menu"
        position="right"
      />
    </div>
  );
};

export const Empty: Story = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="relative h-screen bg-gray-100">
      <div className="p-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Empty Menu
        </button>
      </div>

      <SideMenu
        options={[]}
        isVisible={isVisible}
        onSelect={(option) => console.log('Selected:', option)}
        onClose={() => setIsVisible(false)}
        title="Empty Menu"
      />
    </div>
  );
};