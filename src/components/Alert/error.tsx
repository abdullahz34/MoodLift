import React from 'react';
import ReactDOM from 'react-dom';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed top-20 right-4 z-50">
      <div role="alert" className="alert alert-warning flex items-center justify-center p-2 text-sm max-w-xs">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
        <button className="btn btn-sm btn-ghost ml-2" onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

export default Alert;