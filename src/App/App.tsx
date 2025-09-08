import { ToolCanvasV2ReactFlow } from '../components/ToolCanvasV2/ToolCanvasV2ReactFlow';
import React from 'react';

function App(): React.JSX.Element {
  return (
    <div className="w-full h-screen overflow-hidden" role='application'>
      {/* ARIA live region for screen reader announcements */}
      <div
        id='live-region'
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        aria-label='Status updates'
      />

      <ToolCanvasV2ReactFlow />
    </div>
  );
}

export default App;
