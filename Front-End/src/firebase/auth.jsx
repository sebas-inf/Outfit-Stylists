import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// Sign-up with Email & Password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Sign-in with Email & Password
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

// Sign-in with Google
export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        createdAt: new Date(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

// Logout
export const doSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};
