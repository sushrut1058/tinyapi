import React from 'react';
import { X } from 'lucide-react';

interface EndpointBannerProps {
  endpoint: string;
  onClose: () => void;
}

const EndpointBanner: React.FC<EndpointBannerProps> = ({ endpoint, onClose }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50">
      <span>Access your latest deployed API: <span className="font-semibold">{endpoint}</span></span>
      <button onClick={onClose} className="hover:text-blue-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EndpointBanner;