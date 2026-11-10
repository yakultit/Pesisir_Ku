import React from 'react';
import { Destination, TripItinerary } from '../types/destination';
import { deleteItinerary, toggleFavorite } from '../services/firebaseService';
import { 
  Heart, BookmarkCheck, Calendar, Trash2, 
  MapPin, ArrowRight, ExternalLink, Printer 
} from 'lucide-react';

interface SavedItinerariesViewProps {
  itineraries: TripItinerary[];
  destinations: Destination[];
  favorites: string[];
  onSelectDestination: (dest: Destination) => void;
  onRefreshSaved: () => void;
  onNavigateToPlanner: () => void;
}

export const SavedItinerariesView: React.FC<SavedItinerariesViewProps> = ({
  itineraries,
  destinations,
  favorites,
  onSelectDestination,
  onRefreshSaved,
  onNavigateToPlanner
}) => {
  const favoriteDestinations = destinations.filter(d => favorites.includes(d.id));

  const handleDeleteItinerary = (id: string) => {
    deleteItinerary(id);
    onRefreshSaved();
  };

  const handleRemoveFavorite = (id: string) => {
    toggleFavorite(id);
    onRefreshSaved();
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Section 1: Saved Itineraries */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookmarkCheck className="w-6 h-6 text-blue-600" />
                <span>Rencana Perjalanan Tersimpan ({itineraries.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Itinerary AI yang telah Anda simpan ke akun/perangkat
              </p>
            </div>

            <button
              onClick={onNavigateToPlanner}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              + Buat Rencana Baru
            </button>
          </div>

          {itineraries.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <BookmarkCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Rencana Tersimpan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Gunakan fitur AI Trip Planner untuk menyusun dan menyimpan jadwal liburan pesisir Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itineraries.map(itin => (
                <div 
                  key={itin.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                        {itin.days.length} Hari Perjalanan
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {itin.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dibuat: {new Date(itin.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteItinerary(itin.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Hapus Itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Alokasi Budget</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Rp {itin.totalBudget.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Estimasi Pengeluaran</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rp {itin.estimatedTotalCost.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Days list preview */}
                  <div className="space-y-2">
                    {itin.days.map(d => (
                      <div key={d.dayNumber} className="text-xs p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          {d.title}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {d.items.map((it, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              📍 {it.destinationName}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Basis Data Terverifikasi
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Jadwal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Favorite Coastal Destinations */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-current" />
              <span>Objek Wisata Favorit Saya ({favoriteDestinations.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Daftar pantai dan pulau yang Anda simpan sebagai favorit
            </p>
          </div>

          {favoriteDestinations.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Destinasi Favorit</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Klik ikon hati (♥) pada kartu objek wisata di peta untuk menambahkannya ke daftar favorit ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteDestinations.map(dest => (
                <div 
                  key={dest.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-40 w-full bg-slate-800 overflow-hidden">
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                      {dest.region}
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(dest.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-md"
                      title="Hapus dari favorit"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                        {dest.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {dest.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {dest.entryFee === 0 ? 'Gratis' : `Rp ${dest.entryFee.toLocaleString('id-ID')}`}
                      </span>
                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
