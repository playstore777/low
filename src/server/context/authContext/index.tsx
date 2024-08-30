import React, { ReactNode, useEffect, useState } from "react";

import {
  NextOrObserver,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { getUserById } from "../../services";
import { User } from "../../../types/types";
import { auth } from "../../firebase";

type Auth = {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
};

export const AuthContext = React.createContext<Auth>({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: null | ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      initializeUser as NextOrObserver<FirebaseUser>
    );
    return unsubscribe;
  }, []);

  const initializeUser = async (firebaseUser: User) => {
    if (firebaseUser) {
      // User is signed in, fetch user details from Firestore
      try {
        const userData = await getUserById(firebaseUser.uid);

        if (userData) {
          setCurrentUser(userData as User);
          setUserLoggedIn(true);
        } else {
          // If the user does not exist in Firestore, handle this case
          console.error("No user data found in Firestore!");
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } else {
      // User is signed out
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };

  const value = {
    loading,
    currentUser,
    userLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
