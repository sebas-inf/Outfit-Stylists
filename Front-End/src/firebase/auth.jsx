import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
//import { setDoc, doc } from "firebase/firestore";
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

async function sendCreateWithEmailPassword(userData) {
  await axiosInstance.post('/user/signup/emailpassword', {
    username : userData.displayName,
    email : userData.email,
    loginid : userData.uid,
    createdAt : new Date(),
    withCredentials: true,
  })
}

async function sendLoginWithEmailPassword(userData) {
  await axiosInstance.post('/user/login/emailpassword', {
    loginid : userData.uid,
    withCredentials: true,
  })
}

async function sendLoginWithGoogle(userData) {
  await axiosInstance.post('/user/login/google', {
    loginid : userData.uid,
    email: userData.email,
    username: userData.displayName,
    profilePicture: userData.photoURL,
    createdAt: new Date(),
    withCredentials: true,
  })
}


async function sendLogout() {
  await axiosInstance.get('/user/logout');
} 

// Sign-up with Email & Password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = userCredential.user;

    sendCreateWithEmailPassword(userData);

    return userData;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Sign-in with Email & Password
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    sendLoginWithEmailPassword(userCredential.user);

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
    const userData = result.user;

    /* await setDoc(
      doc(db, "users", userData.uid),
      {
        email: userData.email,
        name: userData.displayName,
        profilePicture: userData.photoURL,
        createdAt: new Date(),
      },
      { merge: true }
    ); */

    sendLoginWithGoogle(userData);

    return userData;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

// Logout
export const doSignOut = async () => {
  try {
    await signOut(auth);
    sendLogout();
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};
