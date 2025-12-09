import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingView: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="relative">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="text-red-500 animate-spin-slow" size={40} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
            <Loader2 className="animate-spin text-gray-800" size={20} />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Dreaming up your plan...</h2>
      <p className="text-gray-500 text-sm max-w-[200px]">
        Our AI is analyzing the aesthetic and crafting the perfect details.
      </p>
    </div>
  );
};

export default LoadingView;