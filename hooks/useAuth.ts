"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  resendEmailVerification,
  type UserProfile,
} from "@/lib/auth";
import SocketService from "@/lib/socket";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    }
  };

  const login = async (email: string, password: string) => {
    const firebaseUser = await loginUser(email, password);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setProfile(userProfile);

    // Connect to socket
    if (userProfile) {
      SocketService.getInstance().connect(firebaseUser.uid);
    }
  };

  const register = async (userData: any) => {
    const { user: firebaseUser, profile: userProfile } = await registerUser(
      userData
    );
    setProfile(userProfile);
  };

  const logout = async () => {
    // Disconnect from socket
    SocketService.getInstance().disconnect();
    await logoutUser();
    setProfile(null);
  };

  const resendVerification = async () => {
    await resendEmailVerification();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);

        // Connect to socket if profile exists
        if (userProfile) {
          SocketService.getInstance().connect(firebaseUser.uid);
        }
      } else {
        setProfile(null);
        SocketService.getInstance().disconnect();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        resendVerification,
      }}
    >
      {children}
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
