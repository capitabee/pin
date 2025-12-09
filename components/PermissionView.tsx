import React from 'react';
import { Share2, ShieldCheck, ArrowRight } from 'lucide-react';

interface PermissionViewProps {
  onGrant: () => void;
}

const PermissionView: React.FC<PermissionViewProps> = ({ onGrant }) => {
  return (
    <div className="flex flex-col h-full bg-white p-8 items-center justify-center text-center fade-in">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <Share2 size={40} className="text-red-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Enable Sharing</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        To magically transform your Pinterest boards into itineraries, PinTrip needs permission to appear in your share menu.
      </p>

      <div className="w-full bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
        <div className="flex items-start mb-3">
          <ShieldCheck size={20} className="text-green-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Secure Data Access</h3>
            <p className="text-xs text-gray-400">We only access the links you explicitly share.</p>
          </div>
        </div>
        <div className="flex items-start">
          <Share2 size={20} className="text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Share Sheet Integration</h3>
            <p className="text-xs text-gray-400">Allows "PinTrip" to appear when you tap Share.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onGrant}
        className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
      >
        Allow Access
      </button>
      <p className="text-xs text-gray-300 mt-4">You can change this in settings later.</p>
    </div>
  );
};

export default PermissionView;