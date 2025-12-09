import React from 'react';
import { ItineraryResult, BoardResult, AppMode, SaveStatus } from '../types';
import { MapPin, DollarSign, Cloud, Home, SlidersHorizontal, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultViewProps {
  data: ItineraryResult | BoardResult;
  mode: AppMode;
  onReset: () => void;
  onEdit: () => void;
  saveStatus: SaveStatus;
}

const SaveStatusIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
  if (status === 'SAVING') {
    return <span className="text-[10px] text-gray-500 flex items-center font-medium"><Loader2 size={8} className="mr-1 animate-spin"/> Saving...</span>;
  }
  if (status === 'SAVED') {
    return <span className="text-[10px] text-green-600 flex items-center font-medium"><CheckCircle2 size={8} className="mr-1"/> Saved</span>;
  }
  if (status === 'ERROR') {
    return <span className="text-[10px] text-red-500 flex items-center font-medium"><AlertCircle size={8} className="mr-1"/> Save Failed</span>;
  }
  return null;
};

const ResultView: React.FC<ResultViewProps> = ({ data, mode, onReset, onEdit, saveStatus }) => {
  
  // ---------------- ITINERARY VIEW ----------------
  if (mode === AppMode.ITINERARY) {
    const itinerary = data as ItineraryResult;
    return (
      <div className="flex flex-col h-full bg-gray-50 relative animate-in fade-in slide-in-from-bottom-5 duration-500">
        {/* Navigation Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100 shadow-sm">
           <button onClick={onReset} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <Home size={20} />
           </button>
           <div className="flex flex-col items-center">
             <span className="font-bold text-gray-900 text-sm tracking-wide">ITINERARY</span>
             <SaveStatusIndicator status={saveStatus} />
           </div>
           <button 
             onClick={onEdit} 
             className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold flex items-center hover:bg-gray-800 transition-colors"
           >
              Customize
              <SlidersHorizontal size={12} className="ml-1.5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
            {/* Title Card */}
            <div className="bg-white p-6 pb-8 mb-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight relative z-10">{itinerary.title}</h1>
                <div className="flex flex-wrap gap-3 mt-4 relative z-10">
                    <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                        <MapPin size={12} className="mr-1"/> {itinerary.destination}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                        <DollarSign size={12} className="mr-1"/> {itinerary.totalEstimatedCost}
                    </span>
                </div>
            </div>

            {/* Days Loop */}
            <div className="px-4 space-y-6">
                {itinerary.days.map((day) => (
                    <div key={day.day} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-orange-300"></div>
                        <div className="flex items-baseline mb-4">
                            <h2 className="text-4xl font-black text-gray-100 mr-3 absolute right-2 top-0 opacity-50">{day.day}</h2>
                            <div className="relative z-10">
                                <h3 className="font-bold text-gray-800 text-lg">Day {day.day}</h3>
                                <p className="text-xs text-red-500 font-bold uppercase tracking-wider">{day.theme}</p>
                            </div>
                        </div>

                        <div className="space-y-6 ml-1 pt-2">
                            {day.activities.map((act, idx) => (
                                <div key={idx} className="relative pl-6 border-l border-gray-200 pb-1 last:border-l-0">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-red-400"></div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 text-sm leading-snug">{act.activity}</h4>
                                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">{act.time}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs leading-relaxed mb-2">{act.description}</p>
                                        <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                            <MapPin size={10} className="mr-1 text-gray-300"/> {act.location}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-8 text-center text-gray-300 text-xs font-medium">
              Made with <span className="text-red-300">♥</span> by PinTrip
            </div>
        </div>
      </div>
    );
  } 
  
  // ---------------- BOARD VIEW ----------------
  else {
    const board = data as BoardResult;
    return (
      <div className="flex flex-col h-full bg-white relative animate-in fade-in duration-500">
         {/* Navigation */}
         <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100">
           <button onClick={onReset} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <ArrowLeft size={20} />
           </button>
           <div className="flex flex-col items-center">
             <span className="font-bold text-gray-900 text-sm tracking-wide">BOARD</span>
             <SaveStatusIndicator status={saveStatus} />
           </div>
           <button 
             onClick={onEdit} 
             className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold flex items-center hover:bg-gray-800 transition-colors"
           >
              Edit
              <SlidersHorizontal size={12} className="ml-1.5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
            <div className="py-8 text-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{board.title}</h1>
                <div className="w-12 h-1 bg-red-500 mx-auto rounded-full mb-4"></div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-light">"{board.concept}"</p>
            </div>

            <div className="columns-1 gap-6 space-y-6 pb-8">
                {board.scenes.map((scene) => (
                    <div key={scene.id} className="break-inside-avoid group">
                        <div className="relative rounded-2xl overflow-hidden mb-3 shadow-lg">
                          <img 
                            src={`https://picsum.photos/400/500?random=${scene.id}&blur=1`} 
                            alt="Mood" 
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="absolute bottom-3 left-3 text-white text-xs font-bold">{scene.mood}</div>
                          </div>
                        </div>
                        
                        <div className="px-1">
                            <h3 className="font-bold text-gray-900 mb-1 text-sm">{scene.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed border-l-2 border-gray-100 pl-2">{scene.visualDescription}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }
};

export default ResultView;