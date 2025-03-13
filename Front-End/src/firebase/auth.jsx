import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
//import { setDoc, doc } from "firebase/firestore";
import {User as UserModel} from "../../../Back-End/src/run_database";

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

async function sendLogin(uData) {
  await axiosInstance.post('/user/login', {
    userid : uData.uid
  })
}

async function sendLogout() {
  await axiosInstance.post('/user/logout');
}


// Sign-up with Email & Password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = userCredential.user;

    /* await setDoc(doc(db, "users", userData.uid), {
      email,
      createdAt: new Date(),
    });  */

    const foundUser = await UserModel.findOne({ userid : userData.uid });
    if (!foundUser) {
      const newUser = await new UserModel({
        username : userData.displayName,
        useremail : userData.email,
        userid : userData.uid,
        createdate : new Date()
      })
      await newUser.save();
    }
    
    sendLogin(userData);

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

    sendLogin(userCredential.user);

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

    const foundUser = await UserModel.findOne({ useremail : userData.email });
    if (!foundUser) {
      const newUser = await new UserModel({
        username : userData.displayName,
        useremail : userData.email,
        userid : userData.uid,
        profilepicURL : userData.photoURL,
        createdate : new Date()
      })
      await newUser.save();
    } else {
      foundUser.username = userData.displayName;
      foundUser.useremail = userData.email;
      foundUser.userid = userData.uid;
      foundUser.profilepicURL = userData.photoURL;
      foundUser.createdate = new Date();
      await foundUser.save();
    }
    
    sendLogin(userData);

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
