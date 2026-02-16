import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile as updateFirebaseProfile, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// TODO: Replace with your Firebase config from console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

const app = isConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const googleProvider = new GoogleAuthProvider();

export { auth, db, isConfigured };

// Auth functions
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    return null;
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateFirebaseProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase not configured');
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Firestore: User profile
export interface UserProfile {
  uid: string;
  displayName: string;
  avatar: string;
  email: string;
  photoURL?: string;
  createdAt: unknown;
  lastLoginAt: unknown;
}

export async function getOrCreateProfile(user: User, avatar?: string): Promise<UserProfile | null> {
  if (!db) return null;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  
  if (snap.exists()) {
    await updateDoc(ref, { lastLoginAt: serverTimestamp() });
    return snap.data() as UserProfile;
  }
  
  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || 'Player',
    avatar: avatar || '🤠',
    email: user.email || '',
    photoURL: user.photoURL || undefined,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return profile;
}

export async function updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
}

// Firestore: Game stats per map
export interface CloudGameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  bestDailyTier: number;
  bestDailyGuesses: number;
  totalDaysPlayed: number;
  lastPlayedDate: string;
}

export async function getCloudStats(uid: string, mapId: string): Promise<CloudGameStats | null> {
  if (!db) return null;
  const ref = doc(db, 'users', uid, 'stats', mapId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() as CloudGameStats : null;
}

export async function saveCloudStats(uid: string, mapId: string, stats: CloudGameStats): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid, 'stats', mapId);
  await setDoc(ref, { ...stats, updatedAt: serverTimestamp() }, { merge: true });
}

// Firestore: Daily results (for global leaderboard)
export async function saveDailyResult(uid: string, mapId: string, result: {
  displayName: string;
  avatar: string;
  highestTier: number;
  totalGuesses: number;
  tierGuesses: number[];
  date: string;
}): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'dailyResults', `${mapId}_${result.date}_${uid}`);
  await setDoc(ref, { ...result, uid, mapId, createdAt: serverTimestamp() });
}
