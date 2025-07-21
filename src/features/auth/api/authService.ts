import {
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth as firebaseAuth } from "../../../lib/firebase";

export const signUpWithEmail = async (
  email: string,
  password: string,
  auth: Auth = firebaseAuth,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithEmail = async (
  email: string,
  password: string,
  auth: Auth = firebaseAuth,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithGoogle = async (auth: Auth = firebaseAuth) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async (auth: Auth = firebaseAuth) => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
