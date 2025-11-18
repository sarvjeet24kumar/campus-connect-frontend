import { createPortal } from 'react-dom';

import Loader from './Loader.jsx';

const LoginOverlay = () => {
  const overlayContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Signing you in...</h1>
          <p className="text-lg text-indigo-100">Please wait while we sign you in</p>
        </div>
        <div className="text-white">
          <Loader size="lg" text="Signing you in securely..." />
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default LoginOverlay;