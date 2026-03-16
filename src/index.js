import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PasswordGate from './PasswordGate';

function Root() {
  const [unlocked, setUnlocked] = useState(false);
  return unlocked ? <App /> : <PasswordGate onUnlock={() => setUnlocked(true)} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
