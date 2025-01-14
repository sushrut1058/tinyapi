import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface EndpointBannerProps {
  endpoint: string;
  onClose: () => void;
}

const EndpointBanner: React.FC<EndpointBannerProps> = ({ endpoint, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50">
      <span>Access your latest deployed API: </span>
      <div className="flex items-center space-x-2">
        <a 
          href={endpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:text-blue-200 underline underline-offset-2"
        >
          {endpoint}
        </a>
        <button
          onClick={handleCopy}
          className="p-1 hover:text-blue-200 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <button 
        onClick={onClose} 
        className="hover:text-blue-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EndpointBanner;