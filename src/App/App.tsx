import ToolCanvasV2 from '../components/ToolCanvasV2/ToolCanvasV2';
import React from 'react';

function App(): React.JSX.Element {
  return (
    <div
      className='App'
      role='application'
      aria-label='Tool Canvas Application'
    >
      <ToolCanvasV2 />
    </div>
  );
}

export default App;
