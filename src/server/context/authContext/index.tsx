import React, { ReactNode, useEffect, useState } from "react";

import { NextOrObserver, onAuthStateChanged, User } from "firebase/auth";

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
      initializeUser as NextOrObserver<User>
    );
    return unsubscribe;
  }, []);

  const initializeUser = (user: User) => {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
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
