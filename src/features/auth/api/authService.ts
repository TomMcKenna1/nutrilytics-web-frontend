import {
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  getAdditionalUserInfo,
  signInWithRedirect,
  type User,
} from "firebase/auth";
import { auth as firebaseAuth } from "../../../lib/firebase";

export type GoogleSignInResult = {
  user: User;
  isNewUser: boolean;
  error: null;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  auth: Auth = firebaseAuth
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithEmail = async (
  email: string,
  password: string,
  auth: Auth = firebaseAuth
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signInWithGoogle = async (): Promise<
  GoogleSignInResult | undefined
> => {
  const provider = new GoogleAuthProvider();

  if (import.meta.env.DEV) {
    // DEVELOPMENT
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;
      return { user: result.user, isNewUser, error: null };
    } catch (error) {
      throw error;
    }
  } else {
    // PRODUCTION
    await signInWithRedirect(firebaseAuth, provider);
    return undefined;
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
