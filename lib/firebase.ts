// Firebase initialization (modular SDK) - fill in config from Firebase console
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore, collection, getDocs, query as fsQuery } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let firebaseApp: any = null;
if (!getApps().length) {
  // TODO: replace these placeholders with your Firebase config
  const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  };
  firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

// Helper: create a Recaptcha verifier container name for web fallback (expo web)
export function createRecaptchaVerifier(containerId = 'recaptcha-container') {
  try {
    return new RecaptchaVerifier(containerId, { size: 'invisible' }, auth);
  } catch (err) {
    console.warn('Recaptcha not available', err);
    return null;
  }
}

// Example: signInWithPhone wrapper (OTP)
export async function signInWithPhoneNumberUI(phoneNumber: string, verifier: any) {
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

// NOTE: For FCM / push notifications, Expo has a separate flow—implement server/cloud functions to send notifications.

// Helper: fetch all institutions (used to seed offline cache)
export async function fetchAllInstitutions() {
  try {
    const q = fsQuery(collection(db, 'institutions'));
    const snap = await getDocs(q);
    const arr: any[] = [];
    snap.forEach(doc => {
      arr.push({ id: doc.id, ...doc.data() });
    });
    return arr;
  } catch (err) {
    console.warn('Failed to fetch institutions', err);
    return [];
  }
}

// Save device push token to user document for later notification targeting
import { doc, setDoc } from 'firebase/firestore';
export async function saveFcmTokenForUser(uid: string, token: string) {
  try {
    if (!uid) return;
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { fcmToken: token }, { merge: true } as any);
  } catch (e) {
    console.warn('Failed to save FCM token', e);
  }
}
