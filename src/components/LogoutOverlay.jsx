import { createPortal } from 'react-dom';

import Loader from './Loader.jsx';

const LogoutOverlay = () => {
  const overlayContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Logging Out...</h1>
          <p className="text-lg text-indigo-100">Thank you for using Campus Connect</p>
        </div>
        <div className="text-white">
          <Loader size="lg" text="Logging you out securely..." />
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default LogoutOverlay;