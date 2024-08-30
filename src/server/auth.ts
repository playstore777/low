import { signInWithPopup, User, UserCredential } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {
  getDoc,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth } from "./firebase";

async function getUser(userId: string) {
  const document = await getDoc(
    doc(getFirestore(), "users", userId.toLowerCase())
  );
  return document;
}

const userExists = async (userId: string) => (await getUser(userId)).exists();

async function addNewUser(user: User) {
  if (!user?.email || !user?.displayName) return;

  const { uid, displayName, photoURL, email } = user;

  try {
    if (await userExists(uid)) return;
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
    // await setDoc(doc(getFirestore(), `emails`, email), { uid });
  } catch (error) {
    //implement logger later
    console.error("Error while inserting data to the DB", error);
  }
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  const isUserExists = await userExists(userCredential.user.email as string);
  if (!isUserExists) {
    await addNewUser(userCredential.user);
    // console.error("User does not exists");
    // doSignOut();
  }
  return { user: userCredential.user, userExists: isUserExists };
};

export const doSignUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  const isUserExists = await userExists(userCredential.user.email as string);
  if (!isUserExists) {
    await addNewUser(userCredential.user);
    // } else {
    //   console.error("User already exists");
    //   doSignOut();
  }
  return { user: userCredential.user, userExists: isUserExists };
};

export const doSignOut = () => {
  return auth.signOut();
};
