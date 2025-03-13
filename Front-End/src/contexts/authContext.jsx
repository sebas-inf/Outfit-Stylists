import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe();
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);

      setIsEmailUser(user.providerData.some((p) => p.providerId === "password"));
      setIsGoogleUser(user.providerData.some((p) => p.providerId === GoogleAuthProvider.PROVIDER_ID));
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    }

    setLoading(false);
  }

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const value = { userLoggedIn, isEmailUser, isGoogleUser, currentUser, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
