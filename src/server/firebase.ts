// Import the functions you need from the SDKs you need
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
  apiKey: "AIzaSyAuPIhahJ19LVOVKFsnb-tBtBds_gkK3gY",
  authDomain: "test-fc454.firebaseapp.com",
  projectId: "test-fc454",
  storageBucket: "test-fc454.appspot.com",
  messagingSenderId: "536958673807",
  appId: "1:536958673807:web:09e199c841888b767661fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore
const firestoreSettings: FirestoreSettings = {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
  // cacheSizeBytes: CACHE_SIZE_UNLIMITED,
};

const firestore = initializeFirestore(app, firestoreSettings);

const userStoreRef = collection(firestore, "users");
const postStoreRef = collection(firestore, "posts");
const commentStoreRef = collection(firestore, "comments");

export { auth, firestore, postStoreRef, commentStoreRef, userStoreRef };
