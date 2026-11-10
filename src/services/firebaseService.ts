import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore, collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { Destination, DestinationReview, TripItinerary } from '../types/destination';
import { INITIAL_DESTINATIONS } from '../data/destinations';

// Firebase credentials can be supplied via .env or localStorage for flexible setup
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || localStorage.getItem('pesisir_firebase_apiKey') || '',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || localStorage.getItem('pesisir_firebase_authDomain') || '',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || localStorage.getItem('pesisir_firebase_projectId') || '',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || ''
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase init error, fallback to LocalStorage mode:', err);
  }
}

// ---------------- USER AUTHENTICATION ----------------
export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
}

const LOCAL_USER_KEY = 'pesisir_local_user';
const ADMIN_EMAILS = ['admin@pesisirku.id', 'admin@gmail.com'];

export function getCurrentUser(): AuthUser | null {
  const saved = localStorage.getItem(LOCAL_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function loginWithGoogle(): Promise<AuthUser> {
  if (auth && isFirebaseConfigured()) {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userObj: AuthUser = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Pengguna Pesisir',
        email: cred.user.email || '',
        photoURL: cred.user.photoURL || undefined,
        isAdmin: ADMIN_EMAILS.includes(cred.user.email || '')
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      console.warn('Firebase popup signin failed, using mock auth:', err);
    }
  }

  // Instant demo login for testing without needing live GCP auth setup immediately
  const mockUser: AuthUser = {
    uid: 'demo-user-101',
    displayName: 'Wisatawan Kawanua',
    email: 'wisatawan@pesisirku.id',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    isAdmin: false
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function loginAsAdmin(): Promise<AuthUser> {
  const adminUser: AuthUser = {
    uid: 'admin-001',
    displayName: 'Administrator Dinas Pariwisata',
    email: 'admin@pesisirku.id',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    isAdmin: true
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(adminUser));
  return adminUser;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {}
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

// ---------------- DESTINATIONS CRUD ----------------
const DESTINATIONS_STORAGE_KEY = 'pesisir_destinations_store';

export function getStoredDestinations(): Destination[] {
  const saved = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  // Initialize with the 33 destinations
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(INITIAL_DESTINATIONS));
  return INITIAL_DESTINATIONS;
}

export function saveDestination(dest: Destination): Destination[] {
  const all = getStoredDestinations();
  const index = all.findIndex(d => d.id === dest.id);
  let updated: Destination[];
  if (index >= 0) {
    updated = all.map(d => d.id === dest.id ? dest : d);
  } else {
    updated = [dest, ...all];
  }
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(updated));

  // Sync to Firestore if online
  if (db) {
    setDoc(doc(db, 'destinations', dest.id), dest).catch(err => console.error('Firestore save error:', err));
  }
  return updated;
}

export function deleteDestination(destId: string): Destination[] {
  const all = getStoredDestinations();
  const updated = all.filter(d => d.id !== destId);
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(updated));

  if (db) {
    deleteDoc(doc(db, 'destinations', destId)).catch(err => console.error('Firestore delete error:', err));
  }
  return updated;
}

// ---------------- FAVORITES & SAVED ITINERARIES ----------------
const FAVORITES_KEY = 'pesisir_user_favorites';
const ITINERARIES_KEY = 'pesisir_user_itineraries';

export function getUserFavorites(): string[] {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function toggleFavorite(destId: string): string[] {
  const favs = getUserFavorites();
  const next = favs.includes(destId) ? favs.filter(id => id !== destId) : [...favs, destId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

export function getSavedItineraries(): TripItinerary[] {
  const saved = localStorage.getItem(ITINERARIES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveItinerary(itinerary: TripItinerary): TripItinerary[] {
  const list = getSavedItineraries();
  const updated = [itinerary, ...list.filter(item => item.id !== itinerary.id)];
  localStorage.setItem(ITINERARIES_KEY, JSON.stringify(updated));

  if (db && itinerary.userId) {
    setDoc(doc(db, 'itineraries', itinerary.id), itinerary).catch(e => console.error('Firestore error:', e));
  }
  return updated;
}

export function deleteItinerary(id: string): TripItinerary[] {
  const list = getSavedItineraries();
  const updated = list.filter(item => item.id !== id);
  localStorage.setItem(ITINERARIES_KEY, JSON.stringify(updated));
  return updated;
}

// ---------------- USER REVIEWS CRUD ----------------
export function addDestinationReview(
  destId: string,
  user: AuthUser,
  rating: number,
  comment: string
): Destination[] {
  const all = getStoredDestinations();
  const dest = all.find(d => d.id === destId);
  if (!dest) return all;

  const newReview: DestinationReview = {
    id: 'rev-' + Date.now(),
    userId: user.uid,
    userName: user.displayName,
    rating,
    comment,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const existingReviews = dest.reviews || [];
  const updatedReviews = [newReview, ...existingReviews];
  const newRating = Math.round((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10) / 10;

  const updatedDest: Destination = {
    ...dest,
    rating: newRating,
    reviewCount: updatedReviews.length,
    reviews: updatedReviews
  };

  return saveDestination(updatedDest);
}

export function deleteReview(destId: string, reviewId: string): Destination[] {
  const all = getStoredDestinations();
  const dest = all.find(d => d.id === destId);
  if (!dest || !dest.reviews) return all;

  const updatedReviews = dest.reviews.filter(r => r.id !== reviewId);
  const newRating = updatedReviews.length > 0 
    ? Math.round((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10) / 10
    : 4.5;

  const updatedDest: Destination = {
    ...dest,
    rating: newRating,
    reviewCount: updatedReviews.length,
    reviews: updatedReviews
  };

  return saveDestination(updatedDest);
}
