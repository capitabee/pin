import React, { useState } from 'react';
import { UserPreferences, AppMode } from '../types';
import { ArrowRight, DollarSign, Calendar, Users, Sparkles, X, RefreshCw } from 'lucide-react';

interface PreferencesViewProps {
  initialPrefs: UserPreferences;
  imagePreview: string | null;
  mode: AppMode;
  onGenerate: (prefs: UserPreferences) => void;
  onCancel: () => void;
}

const PreferencesView: React.FC<PreferencesViewProps> = ({ initialPrefs, imagePreview, mode, onGenerate, onCancel }) => {
  const [budget, setBudget] = useState<UserPreferences['budget']>(initialPrefs.budget);
  const [days, setDays] = useState(initialPrefs.days);
  const [travelers, setTravelers] = useState(initialPrefs.travelers);
  const [vibe, setVibe] = useState(initialPrefs.vibe);

  return (
    <div className="h-full bg-white flex flex-col relative animate-in slide-in-from-bottom-10 duration-500">
      {/* Visual Header */}
      <div className="h-48 w-full relative shrink-0">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
             <Sparkles className="text-white/50" size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 bg-white/40 backdrop-blur-md p-2 rounded-full text-gray-800 shadow-sm hover:bg-white/60 transition-colors z-50"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 -mt-10 relative z-10 overflow-y-auto pb-24 no-scrollbar">
        <div className="bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 mb-6">
           <h2 className="text-2xl font-bold text-gray-900 mb-1">
               Modify {mode === AppMode.ITINERARY ? 'Plan' : 'Board'}
           </h2>
           <p className="text-gray-500 text-sm">Update preferences to regenerate.</p>
        </div>

        <div className="space-y-8">
          {/* Days */}
          <div>
            <div className="flex justify-between items-end mb-3">
                <label className="flex items-center text-sm font-bold text-gray-800">
                <Calendar size={16} className="mr-2 text-red-500" /> Duration
                </label>
                <span className="text-2xl font-black text-red-600">{days} <span className="text-sm font-medium text-gray-400">Days</span></span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="7" 
              value={days} 
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-2 px-1">
                <span>1 Day</span>
                <span>1 Week</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
              <DollarSign size={16} className="mr-2 text-red-500" /> Budget
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Budget', 'Moderate', 'Luxury'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b as any)}
                  className={`py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    budget === b 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {b.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Travelers / Vibe */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                <Users size={16} className="mr-2 text-red-500" /> Travelers
                </label>
                <select 
                value={travelers} 
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-red-100"
                >
                <option>Solo</option>
                <option>Couple</option>
                <option>Family</option>
                <option>Friends</option>
                </select>
             </div>
             <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                <Sparkles size={16} className="mr-2 text-red-500" /> Vibe
                </label>
                <select 
                value={vibe} 
                onChange={(e) => setVibe(e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-red-100"
                >
                <option>Relaxed</option>
                <option>Adventure</option>
                <option>Foodie</option>
                <option>Luxury</option>
                <option>Artistic</option>
                <option>Authentic</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
        <button
          onClick={() => onGenerate({ budget, days, travelers, vibe })}
          className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-red-200 flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all"
        >
          <RefreshCw size={20} className="mr-2" />
          Regenerate {mode === AppMode.ITINERARY ? 'Itinerary' : 'Board'}
        </button>
      </div>
    </div>
  );
};

export default PreferencesView;