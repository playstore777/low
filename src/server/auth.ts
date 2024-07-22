import { signInWithPopup, User, UserCredential } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

import { auth } from "./firebase";
import {
  getDoc,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

async function getUserEmail(email: string) {
  const document = await getDoc(
    doc(getFirestore(), "emails", email.toLowerCase())
  );
  return document;
}

const emailExists = async (email: string) =>
  (await getUserEmail(email)).exists();

async function addNewUser(user: User) {
  if (!user?.email || !user?.displayName) return;

  const { uid, displayName, photoURL, email } = user;

  try {
    if (await emailExists(email)) return;
    const userDetails = {
      uid,
      username: "", // need to set a random username, till user updates it in settings
      creationTime: serverTimestamp(),
      bio: "",
      displayName,
      followers: [],
      following: [],
      notifications: [],
      photoURL,
    };

    const userSpecificData = {
      savedPosts: [],
      email,
    };

    await setDoc(doc(getFirestore(), "users", uid), userDetails);
    await setDoc(
      doc(getFirestore(), `users/${uid}/personal`, "personal-info"),
      userSpecificData
    );

    // for checking if email is unique
    await setDoc(doc(getFirestore(), `emails`, email), { uid });
  } catch (error) {
    //implement logger later
    console.error("Error while inserting data to the DB", error);
  }
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  const userExists = await emailExists(userCredential.user.email as string);
  if (!userExists) {
    console.error("User does not exists");
    doSignOut();
  }
  return { user: userCredential.user, userExists };
};

export const doSignUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  const userExists = await emailExists(userCredential.user.email as string);
  if (!userExists) {
    await addNewUser(userCredential.user);
  } else {
    console.error("User already exists");
    doSignOut();
  }
  return { user: userCredential.user, userExists };
};

export const doSignOut = () => {
  return auth.signOut();
};
