import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import Lenis from 'lenis';

// Custom hook to initialize Lenis
function useLenis() {
  React.useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      direction: 'vertical',
      gestureOrientation: 'vertical',
      smoothTouch: true,
      touchMultiplier: 1.5,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

function RootWithLenis() {
  useLenis();
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RootWithLenis />
  </React.StrictMode>
); 