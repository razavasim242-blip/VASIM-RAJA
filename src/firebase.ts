import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ApplicationRecord } from './types';

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must supply firestoreDatabaseId as required by Firebase skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 2. Strict Error Handling specification matching firebase-skill
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test Connection on Boot (MANDATORY REQUIREMENT)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}

// 4. User Profile Sync
export async function syncUserProfile(user: User) {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const isOwnerEmail =
      user.email === 'razavasim242@gmail.com' ||
      user.email === 'razav75@gmail.com';

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Customer',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || '',
        role: isOwnerEmail ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('User profile sync warning:', error);
  }
}

// 5. Cloud Application Storage
export async function saveApplicationToFirestore(app: ApplicationRecord): Promise<void> {
  const path = `applications/${app.id}`;
  try {
    const docRef = doc(db, 'applications', app.id);
    const payload: any = {
      id: app.id,
      serviceId: app.serviceId,
      serviceName: app.serviceName,
      serviceNameHi: app.serviceNameHi,
      applicantName: app.applicantName,
      fatherHusbandName: app.fatherHusbandName,
      gender: app.gender || 'Not specified',
      mobileNumber: app.mobileNumber,
      address: app.address,
      villageTown: app.villageTown,
      postOffice: app.postOffice,
      district: app.district,
      state: app.state,
      pinCode: app.pinCode,
      paymentStatus: app.paymentStatus,
      amountPaid: app.amountPaid,
      submittedAt: app.submittedAt,
      expectedDate: app.expectedDate,
      status: app.status,
    };

    if (app.dob) payload.dob = app.dob;
    if (app.email) payload.email = app.email;
    if (app.aadharNumber) payload.aadharNumber = app.aadharNumber;
    if (app.paymentMethod) payload.paymentMethod = app.paymentMethod;
    if (app.transactionRef) payload.transactionRef = app.transactionRef;
    if (app.operatorNotes) payload.operatorNotes = app.operatorNotes;
    if (auth.currentUser) {
      payload.userId = auth.currentUser.uid;
    }

    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. Fetch single application by tracking ID
export async function fetchApplicationFromFirestore(id: string): Promise<ApplicationRecord | null> {
  const path = `applications/${id}`;
  try {
    const docRef = doc(db, 'applications', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as ApplicationRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// 7. Update status by operator
export async function updateApplicationStatusFirestore(
  id: string,
  status: ApplicationRecord['status'],
  notes?: string
): Promise<void> {
  const path = `applications/${id}`;
  try {
    const docRef = doc(db, 'applications', id);
    const updates: any = { status };
    if (notes !== undefined) {
      updates.operatorNotes = notes;
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 8. Sign In / Sign Out Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (err) {
    console.error('Sign-in failed:', err);
    throw err;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}
