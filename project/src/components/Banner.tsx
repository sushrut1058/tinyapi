import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface BannerProps {
  message: string;
  onClose: () => void;
}

const Banner: React.FC<BannerProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <CheckCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default Banner;