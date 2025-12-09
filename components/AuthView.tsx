import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, Pin } from 'lucide-react';

const AuthView: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await (supabase.auth as any).signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message || 'Error logging in');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-tr-full -ml-10 -mb-10 z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center">
        <div className="mb-8 relative">
           <div className="w-20 h-20 bg-red-600 rounded-2xl rotate-3 shadow-xl shadow-red-200 flex items-center justify-center">
              <span className="text-white font-bold text-3xl">Pt.</span>
           </div>
           <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">AI</div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to PinTrip</h1>
        <p className="text-gray-500 mb-10 text-sm max-w-[240px]">
          Turn your Pinterest dreams into real-life itineraries and visual boards.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-5 h-5 mr-3"
            />
          )}
          Continue with Google
        </button>
        
        <p className="mt-8 text-xs text-gray-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthView;