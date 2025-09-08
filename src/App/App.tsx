import ToolCanvasV2 from '../components/ToolCanvasV2/ToolCanvasV2';
import React from 'react';
import styles from './App.module.css';

function App(): React.JSX.Element {
  return (
    <div
      className={styles.App}
      role='application'
      aria-label='Tool Canvas Application'
    >
      {/* ARIA live region for screen reader announcements */}
      <div
        id='live-region'
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        aria-label='Status updates'
      />

      <ToolCanvasV2 />
    </div>
  );
}

export default App;
