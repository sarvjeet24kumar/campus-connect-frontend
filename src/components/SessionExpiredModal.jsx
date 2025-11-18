import { createPortal } from 'react-dom';

const SessionExpiredModal = ({ onClose }) => {
  const modalContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 9999
      }}
    >
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
          <svg
            className="h-6 w-6 text-rose-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Session Expired</h3>
      </div>
      <p className="mb-6 text-sm text-slate-600">
        Your session has expired due to inactivity. Please login again to continue.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        OK, I will Login Again
      </button>
    </div>
  </div>
  );

  return createPortal(modalContent, document.body);
};

export default SessionExpiredModal;
