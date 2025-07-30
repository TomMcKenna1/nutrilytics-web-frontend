import {
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  getAdditionalUserInfo,
  type UserCredential,
} from "firebase/auth";
import { auth as firebaseAuth } from "../../../lib/firebase";

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

export const signInWithGoogle = async (
  auth: Auth = firebaseAuth
): Promise<{
  user: UserCredential["user"] | null;
  error: Error | null;
  isNewUser: boolean;
}> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);
    return {
      user: result.user,
      error: null,
      isNewUser: additionalInfo?.isNewUser || false,
    };
  } catch (error) {
    return { user: null, error: error as Error, isNewUser: false };
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
