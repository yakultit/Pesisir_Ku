import React, { useState, useEffect } from 'react';
import { Destination, TripItinerary } from './types/destination';
import { 
  AuthUser, 
  getCurrentUser, 
  getStoredDestinations, 
  getUserFavorites, 
  getSavedItineraries, 
  loginWithGoogle, 
  loginAsAdmin, 
  logoutUser, 
  toggleFavorite 
} from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { DestinationModal } from './components/DestinationModal';
import { TripPlannerView } from './components/TripPlannerView';
import { ChatbotView } from './components/ChatbotView';
import { SavedItinerariesView } from './components/SavedItinerariesView';
import { AdminDashboard } from './components/AdminDashboard';
import { KeyRound, X, Check, Sparkles } from 'lucide-react';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'map' | 'planner' | 'chatbot' | 'saved' | 'admin'>('map');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // User & Data Persistence State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<TripItinerary[]>([]);

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('pesisir_theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Settings Modal State (for optional custom Gemini API Key)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => localStorage.getItem('pesisir_gemini_api_key') || '');
  const [isKeySavedFeedback, setIsKeySavedFeedback] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setDestinations(getStoredDestinations());
    setCurrentUser(getCurrentUser());
    setFavorites(getUserFavorites());
    setSavedItineraries(getSavedItineraries());
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pesisir_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pesisir_theme', 'light');
    }
  }, [isDark]);

  // Auth handlers
  const handleLogin = async () => {
    const user = await loginWithGoogle();
    setCurrentUser(user);
  };

  const handleAdminLogin = async () => {
    const admin = await loginAsAdmin();
    setCurrentUser(admin);
    setActiveTab('admin');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  // Favorites handler
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavorite(id);
    setFavorites(updated);
  };

  // Update single destination (e.g. from review submission)
  const handleUpdateSingleDestination = (updated: Destination) => {
    setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
    setSelectedDestination(updated);
  };

  // Refresh saved data
  const handleRefreshSaved = () => {
    setSavedItineraries(getSavedItineraries());
    setFavorites(getUserFavorites());
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pesisir_gemini_api_key', apiKeyInput.trim());
    setIsKeySavedFeedback(true);
    setTimeout(() => {
      setIsKeySavedFeedback(false);
      setIsApiKeyModalOpen(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogin={handleLogin}
        onAdminLogin={handleAdminLogin}
        onLogout={handleLogout}
        isDark={isDark}
        setIsDark={setIsDark}
        destinationsCount={destinations.length}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'map' && (
          <MapView
            destinations={destinations}
            onSelectDestination={setSelectedDestination}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlannerView
            destinations={destinations}
            currentUser={currentUser}
            onLoginRequest={handleLogin}
            onSelectDestination={setSelectedDestination}
            onItinerarySaved={handleRefreshSaved}
          />
        )}

        {activeTab === 'chatbot' && (
          <ChatbotView
            destinations={destinations}
            onSelectDestination={setSelectedDestination}
          />
        )}

        {activeTab === 'saved' && (
          <SavedItinerariesView
            itineraries={savedItineraries}
            destinations={destinations}
            favorites={favorites}
            onSelectDestination={setSelectedDestination}
            onRefreshSaved={handleRefreshSaved}
            onNavigateToPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            destinations={destinations}
            currentUser={currentUser}
            onLoginAsAdmin={handleAdminLogin}
            onUpdateDestinations={setDestinations}
            onSelectDestination={setSelectedDestination}
          />
        )}
      </main>

      {/* Floating API Key Settings Pill */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-md border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors"
          title="Konfigurasi Kunci API Gemini (Opsional)"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Konfigurasi AI / API</span>
        </button>
      </div>

      {/* Destination Detail & Realtime Marine Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        currentUser={currentUser}
        onLoginRequest={handleLogin}
        onUpdateDestination={handleUpdateSingleDestination}
        isFavorite={selectedDestination ? favorites.includes(selectedDestination.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Pengaturan Google Gemini API Key
                </h3>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem telah dilengkapi mesin sintesis grounded otomatis. Jika Anda ingin menghubungkan langsung dengan model Google Gemini 1.5 Flash untuk penalaran LLM live tambahan, masukkan API Key Anda di bawah:
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
                >
                  {isKeySavedFeedback ? <Check className="w-4 h-4" /> : null}
                  <span>{isKeySavedFeedback ? 'Tersimpan!' : 'Simpan Kunci'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
