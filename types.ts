export enum AppView {
  AUTH = 'AUTH',
  PERMISSION = 'PERMISSION',
  HOME = 'HOME',
  MODE_SELECTION = 'MODE_SELECTION',
  PREFERENCES = 'PREFERENCES',
  LOADING = 'LOADING',
  ITINERARY = 'ITINERARY',
  BOARD = 'BOARD',
  SAVED_LIST = 'SAVED_LIST',
}

export enum AppMode {
  ITINERARY = 'ITINERARY',
  BOARD = 'BOARD', // Formerly Storyboard, now "Pinterest Board" style output
}

export type SaveStatus = 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR';

export interface UserPreferences {
  budget: 'Budget' | 'Moderate' | 'Luxury';
  days: number;
  travelers: string;
  vibe: string; // e.g., "Relaxed", "Adventure", "Foodie"
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  estimatedCost: string;
  location: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface ItineraryResult {
  title: string;
  destination: string;
  totalEstimatedCost: string;
  days: ItineraryDay[];
}

export interface BoardScene {
  id: number;
  title: string;
  visualDescription: string;
  aestheticNote: string;
  mood: string;
}

export interface BoardResult {
  title: string;
  concept: string;
  scenes: BoardScene[];
}

export type GeneratedData = ItineraryResult | BoardResult | null;

// Database Types
export interface TripRecord {
  id: string;
  created_at: string;
  type: 'ITINERARY' | 'BOARD';
  source_url?: string;
  preferences: UserPreferences;
  result_data: any;
  user_id: string;
}