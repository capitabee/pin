import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import PreferencesView from './components/PreferencesView';
import LoadingView from './components/LoadingView';
import ResultView from './components/ResultView';
import PermissionView from './components/PermissionView';
import SavedTripsView from './components/SavedTripsView';
import AuthView from './components/AuthView';
import { AppView, AppMode, UserPreferences, GeneratedData, SaveStatus, TripRecord } from './types';
import { fileToGenerativePart, generateItinerary, generatePinterestBoard } from './services/geminiService';
import { Map, Grid, X } from 'lucide-react';
import { supabase } from './lib/supabase';

const DEFAULT_PREFS: UserPreferences = {
  days: 3,
  budget: 'Moderate',
  travelers: 'Couple',
  vibe: 'Authentic'
};

const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOADING); // Start loading to check auth
  
  // State for inputs
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState<AppMode | null>(null);
  
  // Data
  const [generatedData, setGeneratedData] = useState<GeneratedData>(null);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('IDLE');
  
  // Preferences (Start with defaults, but update when user edits)
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences>(DEFAULT_PREFS);

  // Check Auth on Mount
  useEffect(() => {
    (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
      setSession(session);
      handleInitialRoute(session);
    });

    const {
      data: { subscription },
    } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      // Reset state on logout
      if (!session) {
        setGeneratedData(null);
        setCurrentTripId(null);
      }
      handleInitialRoute(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInitialRoute = (currentSession: any | null) => {
    if (!currentSession) {
      setView(AppView.AUTH);
    } else {
      const hasPermission = localStorage.getItem('pin_trip_permission');
      if (hasPermission) {
        setView(AppView.HOME);
      } else {
        setView(AppView.PERMISSION);
      }
    }
  };

  const grantPermission = () => {
    localStorage.setItem('pin_trip_permission', 'true');
    setView(AppView.HOME);
  };

  const handleInputReceived = async (file: File | null, link: string | null) => {
    setSelectedImageFile(file);
    setSelectedLink(link);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    
    // Show Popup Choice immediately after input
    setView(AppView.MODE_SELECTION);
  };

  // AUTO-GENERATE FLOW: Triggered immediately on mode select
  const handleModeSelect = (mode: AppMode) => {
    setTargetMode(mode);
    // Reset prefs to default for a fresh auto-generation
    setCurrentPrefs(DEFAULT_PREFS);
    // Trigger generation immediately with defaults
    handleGenerate(DEFAULT_PREFS, mode, true); 
  };

  // Handles both Initial Creation (Auto) and Updates (Manual)
  const handleGenerate = async (prefs: UserPreferences, mode: AppMode, isNew: boolean) => {
    setTargetMode(mode);
    setCurrentPrefs(prefs);
    setView(AppView.LOADING);
    setSaveStatus('IDLE');
    
    try {
      let result;
      const inputData: { imageBase64?: string; mimeType?: string; link?: string } = {};
      
      if (selectedImageFile) {
        const base64Data = await fileToGenerativePart(selectedImageFile);
        inputData.imageBase64 = base64Data;
        inputData.mimeType = selectedImageFile.type;
      } else if (selectedLink) {
        inputData.link = selectedLink;
      }

      // Generate content via Gemini
      if (mode === AppMode.ITINERARY) {
        result = await generateItinerary(inputData, prefs);
      } else {
        result = await generatePinterestBoard(inputData, prefs);
      }
      
      setGeneratedData(result);
      
      // Start Saving Process
      setSaveStatus('SAVING');

      // --- SUPABASE SAVE LOGIC ---
      if (session?.user?.id) {
        try {
          if (isNew || !currentTripId) {
            // Insert new record
            const { data, error } = await supabase.from('trips').insert({
              type: mode,
              source_url: selectedLink || 'Image Upload',
              preferences: prefs,
              result_data: result,
              user_id: session.user.id // IMPORTANT: Pass user_id explicitly
            }).select().single();
            
            if (error) throw error;
            
            if (data) {
              setCurrentTripId(data.id);
              setSaveStatus('SAVED');
            }

          } else {
            // Update existing record
            const { error } = await supabase.from('trips').update({
              preferences: prefs,
              result_data: result,
              type: mode 
            }).eq('id', currentTripId);
            
            if (error) throw error;
            setSaveStatus('SAVED');
          }
        } catch (dbError: any) {
          setSaveStatus('ERROR');
          // Log full error details for debugging
          console.error("Supabase Save Error Details:", JSON.stringify(dbError, null, 2));
          console.error("Supabase Error Message:", dbError.message);
          alert(`Database Error: ${dbError.message || 'Unknown error. Check console.'}`);
        }
      } else {
         console.warn("No session found, skipping save.");
         setSaveStatus('ERROR');
      }
      // ---------------------------

      setView(mode === AppMode.ITINERARY ? AppView.ITINERARY : AppView.BOARD);

    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Something went wrong with the AI generation. Please try again.");
      setView(AppView.HOME); // Go back home on failure
    }
  };

  const handleEditClick = () => {
    setView(AppView.PREFERENCES);
  };

  const handleReset = () => {
    setView(AppView.HOME);
    setSelectedImageFile(null);
    setSelectedLink(null);
    setImagePreview(null);
    setGeneratedData(null);
    setTargetMode(null);
    setCurrentTripId(null);
    setCurrentPrefs(DEFAULT_PREFS);
    setSaveStatus('IDLE');
  };

  const handleShowSaved = () => {
    setView(AppView.SAVED_LIST);
  };

  const handleSelectTrip = (trip: TripRecord) => {
    setGeneratedData(trip.result_data);
    setTargetMode(trip.type === 'ITINERARY' ? AppMode.ITINERARY : AppMode.BOARD);
    setCurrentTripId(trip.id);
    setCurrentPrefs(trip.preferences);
    setSaveStatus('SAVED'); // Already saved since it comes from DB
    
    // Set view
    setView(trip.type === 'ITINERARY' ? AppView.ITINERARY : AppView.BOARD);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.AUTH:
        return <AuthView />;

      case AppView.PERMISSION:
        return <PermissionView onGrant={grantPermission} />;
      
      case AppView.HOME:
        return (
          <HomeView 
            onImageSelected={(f) => handleInputReceived(f, null)} 
            onLinkSubmitted={(l) => handleInputReceived(null, l)}
            onShowSaved={handleShowSaved}
          />
        );
      
      case AppView.SAVED_LIST:
        return (
          <SavedTripsView 
            onBack={() => setView(AppView.HOME)} 
            onSelectTrip={handleSelectTrip} 
          />
        );

      case AppView.MODE_SELECTION:
        return (
          <div className="h-full flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-6 absolute inset-0 z-50 fade-in">
             <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Transform Pin</h2>
                    <p className="text-xs text-gray-500">Choose how you want to see this.</p>
                  </div>
                  <button onClick={handleReset}><X className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleModeSelect(AppMode.ITINERARY)}
                    className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 flex items-center transition-all group relative overflow-hidden"
                  >
                     <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-red-100 to-transparent rounded-bl-full opacity-50"></div>
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform text-red-600 shadow-sm">
                      <Map size={26} />
                    </div>
                    <div className="text-left relative z-10">
                      <h3 className="font-bold text-gray-900 text-lg">Itinerary</h3>
                      <p className="text-xs text-gray-500 font-medium">3-Day actionable plan</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleModeSelect(AppMode.BOARD)}
                    className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 flex items-center transition-all group relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform text-blue-600 shadow-sm">
                      <Grid size={26} />
                    </div>
                    <div className="text-left relative z-10">
                      <h3 className="font-bold text-gray-900 text-lg">Visual Board</h3>
                      <p className="text-xs text-gray-500 font-medium">Aesthetic & Vibe breakdown</p>
                    </div>
                  </button>
                </div>
             </div>
          </div>
        );

      case AppView.PREFERENCES:
        return (
          <PreferencesView 
            initialPrefs={currentPrefs}
            imagePreview={imagePreview} 
            mode={targetMode || AppMode.ITINERARY} 
            onGenerate={(prefs) => handleGenerate(prefs, targetMode!, false)} // isNew = false
            onCancel={() => setView(targetMode === AppMode.ITINERARY ? AppView.ITINERARY : AppView.BOARD)}
          />
        );
      
      case AppView.LOADING:
        return <LoadingView />;
      
      case AppView.ITINERARY:
      case AppView.BOARD:
        if (!generatedData || !targetMode) return null;
        return (
          <ResultView 
            data={generatedData} 
            mode={targetMode} 
            onReset={handleReset} 
            onEdit={handleEditClick}
            saveStatus={saveStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;