import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  getRedirectResult,
  getAdditionalUserInfo,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUserRecord } from "../features/account/api/accountService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "AuthProvider: onAuthStateChanged fired. User:",
        user ? user.uid : null
      );
      setUser(user);
      setIsLoading(false);
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("AuthProvider: Detected redirect result.");
          const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
          if (isNewUser) {
            console.log(
              "AuthProvider: New user from redirect, creating DB record..."
            );
            createUserRecord().catch((err) =>
              console.error("AuthProvider: Failed to create user record", err)
            );
          }
        }
      })
      .catch((error) => {
        console.error("AuthProvider: Error from getRedirectResult", error);
      });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
