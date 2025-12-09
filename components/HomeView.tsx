import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Plus, FolderHeart, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HomeViewProps {
  onImageSelected: (file: File) => void;
  onLinkSubmitted: (link: string) => void;
  onShowSaved: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onImageSelected, onLinkSubmitted, onShowSaved }) => {
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      onLinkSubmitted(linkInput.trim());
    }
  };

  const handleSignOut = async () => {
    await (supabase.auth as any).signOut();
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-50 to-white z-0"></div>

      {/* Header Bar */}
      <div className="absolute top-0 w-full p-4 flex justify-between z-20">
         <button 
            onClick={handleSignOut}
            className="p-2 rounded-full text-gray-400 hover:bg-white/50 hover:text-red-500 transition-colors"
            title="Sign Out"
         >
            <LogOut size={18} />
         </button>
         <button 
            onClick={onShowSaved}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all"
         >
            <FolderHeart size={16} className="text-red-500" />
            My Trips
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="mb-10 text-center">
           <div className="inline-block p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-200 mb-4 rotate-3">
              <span className="text-3xl font-bold text-white tracking-tighter">Pt.</span>
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">PinTrip</h1>
           <p className="text-gray-400 mt-2 text-sm">Share a Pin. Get a Plan.</p>
        </div>

        {/* Input Area */}
        <div className="w-full space-y-4">
          
          {/* Link Input */}
          <form onSubmit={handleLinkSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon size={18} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="url"
              placeholder="Paste Pinterest Link..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-800 placeholder-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 outline-none transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={!linkInput}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-red-600 rounded-xl flex items-center justify-center text-white disabled:opacity-0 disabled:scale-75 transition-all"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="flex items-center justify-center space-x-4 text-gray-300 text-xs">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          {/* Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all group"
          >
            <Upload size={18} className="mr-2 group-hover:scale-110 transition-transform" />
            <span>Upload Screenshot</span>
          </button>
          <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="p-8 text-center relative z-10">
        <p className="text-xs text-gray-400">
          Tip: Open Pinterest app, tap Share, and select <span className="font-bold text-gray-600">PinTrip</span>
        </p>
      </div>
    </div>
  );
};

export default HomeView;