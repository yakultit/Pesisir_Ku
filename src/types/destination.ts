export type Region = 'Manado' | 'Bitung' | 'Minahasa Utara';

export type Category = 
  | 'Pantai'
  | 'Pulau & Bawah Laut'
  | 'Ekowisata Mangrove'
  | 'Spot Diving/Snorkeling'
  | 'Kuliner Pesisir';

export interface DestinationReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MarineWeatherForecast {
  time: string[];
  waveHeight: number[];
  waveDirection?: number[];
  windSpeed: number[];
  surfaceTemperature?: number[];
  currentSafetyLevel: 'AMAN' | 'WASPADA' | 'BAHAYA';
  safetyRecommendation: string;
}

export interface Destination {
  id: string;
  name: string;
  region: Region;
  category: Category;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  entryFee: number; // in IDR
  boatFee: number; // in IDR (0 if not needed)
  gearRentFee: number; // in IDR
  isFamilyFriendly: boolean;
  isSnorkelingSpot: boolean;
  isDivingSpot: boolean;
  waveConditionDefault: 'Tenang' | 'Sedang' | 'Berombak';
  bestTimeToVisit: string;
  facilities: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  aiReviewSummary?: {
    positivePoints: string[];
    cautionPoints: string[];
    tips: string;
    lastGenerated: string;
  };
  reviews?: DestinationReview[];
}

export interface UserTripQuery {
  days: number;
  budget: number;
  regions: Region[];
  isFamilyWithChildren: boolean;
  likesSnorkeling: boolean;
  likesDiving: boolean;
  preferredCategories: Category[];
  customNotes?: string;
}

export interface TripItineraryDay {
  dayNumber: number;
  dateStr?: string;
  title: string;
  items: {
    time: string;
    destinationId: string;
    destinationName: string;
    activity: string;
    estimatedCost: number;
    marineSafetyStatus?: string;
    tips: string;
  }[];
  totalDayCost: number;
}

export interface TripItinerary {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  querySummary: string;
  totalBudget: number;
  estimatedTotalCost: number;
  days: TripItineraryDay[];
  rationale: string;
  safetyAdvisory: string;
}
