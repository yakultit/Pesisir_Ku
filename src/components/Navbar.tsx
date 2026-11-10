import React from 'react';
import { Waves, MapPin, Sparkles, MessageSquare, Heart, Shield, Sun, Moon, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { AuthUser } from '../services/firebaseService';

interface NavbarProps {
  activeTab: 'map' | 'planner' | 'chatbot' | 'saved' | 'admin';
  setActiveTab: (tab: 'map' | 'planner' | 'chatbot' | 'saved' | 'admin') => void;
  currentUser: AuthUser | null;
  onLogin: () => void;
  onAdminLogin: () => void;
  onLogout: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  destinationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogin,
  onAdminLogin,
  onLogout,
  isDark,
  setIsDark,
  destinationsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  PesisirKu
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  {destinationsCount}+ Wisata
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Manado • Bitung • Minahasa Utara
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Peta Wisata
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              AI Trip Planner
            </button>

            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chatbot RAG
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorit & Rencana
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Dashboard Admin
            </button>
          </nav>

          {/* Action buttons (Dark mode & Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle Mode Gelap/Terang"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Auth Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.displayName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline">
                    {currentUser.displayName}
                  </span>
                  {currentUser.isAdmin && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar"
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </button>
                <button
                  onClick={onAdminLogin}
                  title="Masuk mode Administrator"
                  className="p-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Peta</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'planner' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'chatbot' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'saved' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorit</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
