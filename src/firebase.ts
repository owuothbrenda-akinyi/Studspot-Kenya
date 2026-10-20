import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  getDoc,
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { User, Listing, StudentVerification, CommunityPost } from './types/index.ts';

// Safely load local firebase config if present (e.g., in AI Studio dev environment)
// without failing build on GitHub/Vercel when firebase-applet-config.json is gitignored
const localConfigs = import.meta.glob<Record<string, any>>('../firebase-applet-config.json', { eager: true });
const localConfig = (localConfigs['../firebase-applet-config.json'] as any)?.default || (localConfigs['../firebase-applet-config.json'] as any) || {};

// Dynamic configuration supporting both Vercel environment variables and local config file
const activeConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || localConfig.projectId || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || localConfig.appId || '',
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || localConfig.apiKey || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || localConfig.authDomain || '',
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || localConfig.firestoreDatabaseId || 'ai-studio-campushubkenya-628480e8-76c0-48b5-8b37-ee14351506e1',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || localConfig.storageBucket || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || localConfig.messagingSenderId || '',
};

// Fallback safe configuration to avoid unhandled crashes if env vars are temporarily missing
const safeConfig = {
  projectId: activeConfig.projectId || 'studspot-kenya',
  appId: activeConfig.appId || '1:663762994305:web:placeholder',
  apiKey: activeConfig.apiKey || 'AIzaSyPlaceholderKeyForVercelSetup',
  authDomain: activeConfig.authDomain || 'studspot-kenya.firebaseapp.com',
  firestoreDatabaseId: activeConfig.firestoreDatabaseId,
  storageBucket: activeConfig.storageBucket || 'studspot-kenya.firebasestorage.app',
  messagingSenderId: activeConfig.messagingSenderId || '663762994305',
};

// Initialize Firebase App
const app = initializeApp(safeConfig);

// Initialize Firestore with designated database ID (CRITICAL)
export const db = getFirestore(app, safeConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase skill guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Firestore connection validated successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is currently offline or unreachable.');
    }
    return false;
  }
}

// Trigger connection check on initialization
testConnection();

// Authentication Helpers
export async function loginWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: unknown) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore Operations with required error handling
export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfile(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createListingDocument(listing: Listing): Promise<void> {
  const path = `listings/${listing.id}`;
  try {
    await setDoc(doc(db, 'listings', listing.id), listing);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToListings(onUpdate: (listings: Listing[]) => void, onError?: (err: unknown) => void) {
  const path = 'listings';
  const q = query(collection(db, path), limit(150));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Listing[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as Listing);
      });
      onUpdate(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function submitStudentVerificationDoc(verification: StudentVerification): Promise<void> {
  const path = `studentVerifications/${verification.id}`;
  try {
    await setDoc(doc(db, 'studentVerifications', verification.id), verification);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
