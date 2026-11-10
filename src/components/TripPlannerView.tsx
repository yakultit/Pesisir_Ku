import React, { useState } from 'react';
import { Destination, Region, TripItinerary, UserTripQuery } from '../types/destination';
import { generateGroundedItinerary } from '../services/aiService';
import { AuthUser, saveItinerary } from '../services/firebaseService';
import { 
  Sparkles, Calendar, DollarSign, Users, Compass, 
  CheckCircle, BookmarkCheck, ArrowRight, Clock, 
  MapPin, AlertCircle, ShieldCheck
} from 'lucide-react';

interface TripPlannerViewProps {
  destinations: Destination[];
  currentUser: AuthUser | null;
  onLoginRequest: () => void;
  onSelectDestination: (dest: Destination) => void;
  onItinerarySaved: () => void;
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  destinations,
  currentUser,
  onLoginRequest,
  onSelectDestination,
  onItinerarySaved
}) => {
  // Query Form State
  const [naturalPrompt, setNaturalPrompt] = useState<string>('2 hari di Bunaken dan Likupang, budget 600 ribu, bawa anak, suka snorkeling');
  const [days, setDays] = useState<number>(2);
  const [budget, setBudget] = useState<number>(600000);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(['Manado', 'Minahasa Utara']);
  const [isFamily, setIsFamily] = useState<boolean>(true);
  const [likesSnorkel, setLikesSnorkel] = useState<boolean>(true);
  const [likesDive, setLikesDive] = useState<boolean>(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<TripItinerary | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Preset prompts
  const samplePrompts = [
    '2 hari di Bunaken, budget 500 ribu, bawa anak, suka snorkeling',
    '3 hari keliling pantai Likupang Minahasa Utara, budget 800 ribu, cari pantai pasir putih sepi',
    '1 hari muck diving dan mangrove di Selat Lembeh Bitung, budget 700 ribu',
    'Wisata santai kuliner pesisir dan sunset di Manado untuk keluarga'
  ];

  const handleToggleRegion = (reg: Region) => {
    if (selectedRegions.includes(reg)) {
      if (selectedRegions.length > 1) {
        setSelectedRegions(selectedRegions.filter(r => r !== reg));
      }
    } else {
      setSelectedRegions([...selectedRegions, reg]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setIsSaved(false);

    const userQuery: UserTripQuery = {
      days,
      budget,
      regions: selectedRegions,
      isFamilyWithChildren: isFamily,
      likesSnorkeling: likesSnorkel,
      likesDiving: likesDive,
      preferredCategories: []
    };

    try {
      const result = await generateGroundedItinerary(naturalPrompt, userQuery, destinations);
      setGeneratedItinerary(result);
    } catch (err) {
      console.error('Planner error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = () => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (!generatedItinerary) return;

    const toSave: TripItinerary = {
      ...generatedItinerary,
      userId: currentUser.uid
    };
    saveItinerary(toSave);
    setIsSaved(true);
    onItinerarySaved();
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grounded AI Engine • Anti-Halusinasi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Trip Planner Pesisir Sulawesi Utara
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tulis kebutuhan perjalanan Anda dalam bahasa santai. LLM menyusun itinerary otomatis langsung dari data objek wisata resmi Manado, Bitung, & Minut.
          </p>
        </div>

        {/* Input & Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form & Preferences */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-5">
            <form onSubmit={handleGenerate} className="space-y-4">
              
              {/* Natural Language Prompt */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                  Kebutuhan Perjalanan (Bahasa Natural)
                </label>
                <textarea
                  rows={3}
                  value={naturalPrompt}
                  onChange={e => setNaturalPrompt(e.target.value)}
                  placeholder="Misal: 2 hari di Bunaken, budget 500 ribu, bawa anak, suka snorkeling..."
                  className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sample Prompt Chips */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Contoh Skenario Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((promptText, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setNaturalPrompt(promptText)}
                      className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 text-left transition-colors"
                    >
                      "{promptText.substring(0, 35)}..."
                    </button>
                  ))}
                </div>
              </div>

              {/* Durasi & Budget Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                    <span>Durasi</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold">{days} Hari</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                    <span>Maks Budget</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                      Rp {(budget / 1000).toLocaleString('id-ID')}rb
                    </span>
                  </label>
                  <input
                    type="range"
                    min="200000"
                    max="2500000"
                    step="50000"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Region Checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Cakupan Wilayah
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Manado', 'Bitung', 'Minahasa Utara'] as Region[]).map(reg => {
                    const isSelected = selectedRegions.includes(reg);
                    return (
                      <button
                        type="button"
                        key={reg}
                        onClick={() => handleToggleRegion(reg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {reg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Flags */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFamily}
                    onChange={e => setIsFamily(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>Bawa Anak / Ramah Keluarga</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={likesSnorkel}
                    onChange={e => setLikesSnorkel(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>Suka Snorkeling & Wisata Air</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-4"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Menyusun Itinerary dari Firestore...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Rencana AI Sekarang</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Generated Itinerary Presentation */}
          <div className="lg:col-span-7">
            {generatedItinerary ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 animate-in fade-in">
                
                {/* Header Itinerary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      Hasil Rekomendasi Terverifikasi
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {generatedItinerary.title}
                    </h2>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveItinerary}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        <span>Tersimpan di Akun</span>
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        <span>Simpan Rencana</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cost & Budget Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alokasi Budget Anda</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">
                      Rp {generatedItinerary.totalBudget.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimasi Total Biaya</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      Rp {generatedItinerary.estimatedTotalCost.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px]">Sisa Budget Aman</span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      Rp {(generatedItinerary.totalBudget - generatedItinerary.estimatedTotalCost).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* AI Rationale & Safety Advisory */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                      Alasan Pemilihan Rute:
                    </span>
                    {generatedItinerary.rationale}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span className="font-bold block mb-0.5">Saran Keselamatan Pesisir & Laut:</span>
                      {generatedItinerary.safetyAdvisory}
                    </div>
                  </div>
                </div>

                {/* Days Breakdown */}
                <div className="space-y-4">
                  {generatedItinerary.days.map((day, idx) => (
                    <div 
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white">
                          {day.title}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Estimasi Biaya: Rp {day.totalDayCost.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 pt-2">
                        {day.items.map((item, itemIdx) => {
                          const targetDest = destinations.find(d => d.id === item.destinationId);
                          return (
                            <div 
                              key={itemIdx}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                                    {item.time}
                                  </span>
                                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    {item.destinationName}
                                  </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                  {item.activity}
                                </p>
                                <p className="text-[11px] text-cyan-600 dark:text-cyan-400">
                                  💡 {item.tips}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                                <span className="font-bold text-slate-700 dark:text-slate-200">
                                  Rp {item.estimatedCost.toLocaleString('id-ID')}
                                </span>
                                {targetDest && (
                                  <button
                                    onClick={() => onSelectDestination(targetDest)}
                                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                  >
                                    Lihat Detail & Cuaca →
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white">
                  Rencana Perjalanan Belum Dibuat
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                  Ketik preferensi Anda di formulir sebelah kiri dan klik tombol "Susun Rencana AI Sekarang" untuk mendapatkan jadwal liburan pesisir anti-halusinasi.
                </p>
                <button
                  onClick={() => handleGenerate()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Gunakan Skenario Rekomendasi
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
