import React, { useState, useEffect } from 'react';
import { Destination, DestinationReview } from '../types/destination';
import { 
  getDestinationWeatherAndMarine, 
  WeatherMarineDetail 
} from '../services/weatherService';
import { 
  getAiWeatherAdvisory, 
  generateAiReviewSummary 
} from '../services/aiService';
import { 
  AuthUser, 
  addDestinationReview, 
  deleteReview 
} from '../services/firebaseService';
import { 
  X, Star, Waves, Wind, Thermometer, ShieldAlert, 
  CheckCircle, AlertTriangle, Sparkles, Send, Trash2, 
  Heart, ExternalLink, MapPin, Clock, DollarSign
} from 'lucide-react';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginRequest: () => void;
  onUpdateDestination: (updated: Destination) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  currentUser,
  onLoginRequest,
  onUpdateDestination,
  isFavorite,
  onToggleFavorite
}) => {
  if (!destination) return null;

  // Weather & Marine State
  const [weatherData, setWeatherData] = useState<WeatherMarineDetail | null>(null);
  const [aiAdvisory, setAiAdvisory] = useState<string>('');
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);

  // AI Review Summary State
  const [aiSummary, setAiSummary] = useState(destination.aiReviewSummary);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  // User Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Fetch Open-Meteo REST API whenever destination changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingWeather(true);

    getDestinationWeatherAndMarine(destination.coordinates.lat, destination.coordinates.lng)
      .then(async data => {
        if (!isMounted) return;
        setWeatherData(data);
        setIsLoadingWeather(false);

        // Fetch AI Explanation for the marine condition
        const advisory = await getAiWeatherAdvisory(destination.name, data);
        if (isMounted) setAiAdvisory(advisory);
      })
      .catch(err => {
        console.error('Weather error:', err);
        if (isMounted) setIsLoadingWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination.id]);

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (!comment.trim()) return;

    setIsSubmittingReview(true);
    const updatedDestinations = addDestinationReview(destination.id, currentUser, rating, comment);
    const updated = updatedDestinations.find(d => d.id === destination.id);
    if (updated) {
      onUpdateDestination(updated);
    }
    setComment('');
    setIsSubmittingReview(false);
  };

  // Handle Review Deletion (Admin moderation or author)
  const handleDeleteReview = (reviewId: string) => {
    const updatedDestinations = deleteReview(destination.id, reviewId);
    const updated = updatedDestinations.find(d => d.id === destination.id);
    if (updated) {
      onUpdateDestination(updated);
    }
  };

  // Trigger on-demand AI review summarization
  const handleRegenerateAiSummary = async () => {
    setIsSummarizing(true);
    const reviews = (destination.reviews || []).map(r => ({
      author: r.userName,
      rating: r.rating,
      comment: r.comment
    }));
    const summary = await generateAiReviewSummary(destination.name, reviews);
    const updated = {
      ...destination,
      aiReviewSummary: {
        ...summary,
        lastGenerated: new Date().toISOString().split('T')[0]
      }
    };
    onUpdateDestination(updated);
    setAiSummary(updated.aiReviewSummary);
    setIsSummarizing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header Hero Image */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900">
          <img 
            src={destination.imageUrl} 
            alt={destination.name} 
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Top action buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/20">
              {destination.region} • {destination.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(destination.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFavorite 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' 
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/90 text-white text-xs font-bold backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{destination.rating}</span>
                <span className="text-amber-100 font-normal">({destination.reviewCount} ulasan)</span>
              </div>
              {destination.isFamilyFriendly && (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/90 text-white text-xs font-bold backdrop-blur-sm">
                  👶 Ramah Anak
                </span>
              )}
              {destination.isSnorkelingSpot && (
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/90 text-white text-xs font-bold backdrop-blur-sm">
                  🤿 Spot Snorkeling
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[calc(85vh-15rem)] overflow-y-auto">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Tiket Masuk</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {destination.entryFee === 0 ? 'Gratis' : `Rp ${destination.entryFee.toLocaleString('id-ID')}`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Sewa Perahu</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {destination.boatFee > 0 ? `Rp ${destination.boatFee.toLocaleString('id-ID')}` : 'Tidak Perlu'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Alat Snorkel</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {destination.gearRentFee > 0 ? `Rp ${destination.gearRentFee.toLocaleString('id-ID')}` : 'Bawa Sendiri'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Kondisi Ombak</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                {destination.waveConditionDefault}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">Deskripsi</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Open-Meteo REST API: Live Weather & Marine Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800/80 dark:to-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-500/20">
                  <Waves className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    Kondisi Cuaca & Gelombang Laut Realtime
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300">
                      Open-Meteo REST API
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Data laut langsung dari koordinat {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Marine Safety Badge */}
              {weatherData && (
                <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm ${
                  weatherData.safetyLevel === 'AMAN'
                    ? 'bg-emerald-600 text-white'
                    : weatherData.safetyLevel === 'WASPADA'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  {weatherData.safetyLevel === 'AMAN' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>Status: {weatherData.safetyLevel}</span>
                </div>
              )}
            </div>

            {isLoadingWeather ? (
              <div className="py-4 text-center text-xs text-slate-500">
                Memuat data oseanografi & cuaca Open-Meteo...
              </div>
            ) : weatherData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <span className="text-[11px] text-slate-400 block">Tinggi Gelombang</span>
                    <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">
                      {weatherData.waveHeight} Meter
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <span className="text-[11px] text-slate-400 block">Kecepatan Angin</span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      {weatherData.windSpeed} km/jam
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <span className="text-[11px] text-slate-400 block">Suhu Udara</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">
                      {weatherData.temperature}°C
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <span className="text-[11px] text-slate-400 block">Kondisi Cuaca</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 mt-1">
                      {weatherData.weatherDesc}
                    </span>
                  </div>
                </div>

                {/* AI Marine Advisory Explanation */}
                <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-cyan-100 dark:border-slate-700/60 flex items-start gap-2.5 text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Analisis Kelautan AI:
                    </span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      {aiAdvisory || weatherData.safetyRecommendation}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* AI Review Summary (LLM) */}
          {aiSummary && (
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Ringkasan Ulasan Otomatis oleh AI
                  </h4>
                </div>
                <button
                  onClick={handleRegenerateAiSummary}
                  disabled={isSummarizing}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {isSummarizing ? 'Menganalisis...' : 'Perbarui Ringkasan'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Positive Points */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    ✓ Poin Positif Wisatawan:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {aiSummary.positivePoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Caution Points */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                    ⚠ Perlu Diperhatikan:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {aiSummary.cautionPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {aiSummary.tips && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300">
                  💡 <span className="font-bold">Tips Pengunjung:</span> {aiSummary.tips}
                </div>
              )}
            </div>
          )}

          {/* Facilities & Best Time */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Fasilitas Tersedia</h4>
            <div className="flex flex-wrap gap-1.5">
              {destination.facilities.map((fac, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>

          {/* User Reviews Section (CRUD) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">
              Ulasan & Penilaian Pengunjung ({destination.reviews?.length || 0})
            </h4>

            {/* Write Review Form */}
            <form onSubmit={handleSubmitReview} className="mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                Tulis Ulasan Anda
              </span>

              {/* Star selector */}
              <div className="flex items-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map(starVal => (
                  <button
                    type="button"
                    key={starVal}
                    onClick={() => setRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        starVal <= rating 
                          ? 'text-amber-400 fill-current' 
                          : 'text-slate-300 dark:text-slate-600'
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  {rating === 5 ? 'Sangat Puas' : rating === 4 ? 'Puas' : rating === 3 ? 'Cukup' : 'Kurang'}
                </span>
              </div>

              {/* Textarea */}
              <textarea
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={currentUser ? 'Bagikan pengalaman ombak, kebersihan, atau keramahan pemandu...' : 'Silakan masuk akun terlebih dahulu untuk menulis review'}
                disabled={!currentUser}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <div className="mt-2 flex items-center justify-between">
                {!currentUser ? (
                  <button
                    type="button"
                    onClick={onLoginRequest}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Masuk Akun untuk Mengulas
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Mengulas sebagai {currentUser.displayName}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={!currentUser || !comment.trim() || isSubmittingReview}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Ulasan</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {(destination.reviews || []).map(rev => (
                <div 
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {rev.userName}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                      
                      {/* Admin moderation delete button */}
                      {(currentUser?.isAdmin || currentUser?.uid === rev.userId) && (
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Hapus / Moderasi Ulasan"
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka di Google Maps</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
