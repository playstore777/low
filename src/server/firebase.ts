// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  FirestoreSettings,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_DEV_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_DEV_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_DEV_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_DEV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_DEV_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_DEV_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize Firestore
const firestoreSettings: FirestoreSettings = {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
  // cacheSizeBytes: CACHE_SIZE_UNLIMITED,
};

const firestore = initializeFirestore(app, firestoreSettings);

const commentStoreRef = collection(firestore, "comments");
const draftStoreRef = collection(firestore, "drafts");
const postStoreRef = collection(firestore, "posts");
const userStoreRef = collection(firestore, "users");

export {
  auth,
  firestore,
  postStoreRef,
  commentStoreRef,
  userStoreRef,
  draftStoreRef,
};
