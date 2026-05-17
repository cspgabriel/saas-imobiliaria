import React, { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  profile: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, "users", u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile({ ...docSnap.data(), uid: u.uid });
          } else {
            // Create minimal profile; agency binding happens at /onboarding
            const newProfile = {
              email: u.email,
              name: u.displayName,
              role: "ADMIN",
              agencyId: null,
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile);
            setProfile({ ...newProfile, uid: u.uid });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("O painel de login foi bloqueado pelo seu navegador. Por favor, permita popups para este site e tente novamente.");
      } else {
        alert("Erro ao tentar entrar com o Google: " + error.message);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setProfile({ ...docSnap.data(), uid: user.uid });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
