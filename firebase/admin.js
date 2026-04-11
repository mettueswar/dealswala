import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // If Firebase env vars are not configured, return null gracefully
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey || privateKey.includes('REPLACE_WITH_ACTUAL_KEY')) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}

export async function verifyFirebaseToken(idToken) {
  try {
    const adminAuth = getAdminAuth();
    if (!adminAuth) throw new Error('Firebase Admin not configured');
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.error('Firebase token verification failed:', err.message);
    return null;
  }
}
