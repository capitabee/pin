import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TripRecord, AppMode } from '../types';
import { ArrowLeft, Map, Grid, Calendar, Clock, ChevronRight, Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface SavedTripsViewProps {
  onBack: () => void;
  onSelectTrip: (trip: TripRecord) => void;
}

const SavedTripsView: React.FC<SavedTripsViewProps> = ({ onBack, onSelectTrip }) => {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      setErrorMsg(error.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip?')) {
        const { error } = await supabase.from('trips').delete().eq('id', id);
        if (error) {
           alert("Could not delete: " + error.message);
        } else {
           setTrips(prev => prev.filter(t => t.id !== id));
        }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm z-10 sticky top-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">My Trips</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <Loader2 size={32} className="animate-spin mb-2" />
             <p className="text-xs">Loading saved plans...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-8 text-red-500">
            <AlertTriangle size={32} className="mb-2 opacity-50" />
            <h3 className="font-bold mb-1">Error Loading Trips</h3>
            <p className="text-xs text-gray-500">{errorMsg}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Map size={32} />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No trips yet</h3>
            <p className="text-sm text-gray-500">Share a Pinterest link to start building your collection.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => {
                const isItinerary = trip.type === AppMode.ITINERARY;
                const title = isItinerary 
                    ? trip.result_data?.title || trip.result_data?.destination 
                    : trip.result_data?.title || "Visual Board";
                
                return (
                    <div 
                        key={trip.id}
                        onClick={() => onSelectTrip(trip)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex items-center group cursor-pointer"
                    >
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${
                            isItinerary ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {isItinerary ? <Map size={20} /> : <Grid size={20} />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm mb-1">{title || 'Untitled Trip'}</h3>
                            <div className="flex items-center text-xs text-gray-400 space-x-3">
                                <span className="flex items-center">
                                    <Clock size={10} className="mr-1" />
                                    {formatDate(trip.created_at)}
                                </span>
                                {isItinerary && (
                                    <span className="flex items-center bg-gray-100 px-1.5 py-0.5 rounded">
                                        <Calendar size={10} className="mr-1" />
                                        {trip.preferences?.days} Days
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-center pl-2">
                             <button 
                                onClick={(e) => handleDelete(e, trip.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors mr-1"
                             >
                                <Trash2 size={16} />
                             </button>
                             <ChevronRight size={18} className="text-gray-300" />
                        </div>
                    </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripsView;