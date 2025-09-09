import React from 'react';
import '../src/index.css';

export const decorators = [
  (Story): React.JSX.Element => (
    <div className='p-4'>
      <Story />
    </div>
  ),
];
