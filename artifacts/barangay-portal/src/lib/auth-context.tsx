import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "resident" | "official";

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  address?: string;
  phone?: string;
  purok?: string;
}

interface AuthContextType {
  user: { uid: string; email: string } | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_RESIDENTS: UserData[] = [
  { uid: "res-001", email: "juan@email.com", fullName: "Juan dela Cruz", role: "resident", address: "Purok 1, Barangay Santiago", phone: "09123456789" },
  { uid: "res-002", email: "maria@email.com", fullName: "Maria Santos", role: "resident", address: "Purok 2, Barangay Santiago", phone: "09987654321" },
];

const DEMO_OFFICIALS: UserData[] = [
  { uid: "off-001", email: "captain@brgy-santiago.gov.ph", fullName: "Barangay Captain", role: "official", address: "Barangay Hall, Santiago" },
  { uid: "off-002", email: "secretary@brgy-santiago.gov.ph", fullName: "Barangay Secretary", role: "official" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("barangay_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ uid: parsed.uid, email: parsed.email });
        setUserData(parsed);
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));
    
    const pool = role === "official" ? DEMO_OFFICIALS : DEMO_RESIDENTS;
    const found = pool.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (found && password.length >= 4) {
      setUser({ uid: found.uid, email: found.email });
      setUserData(found);
      localStorage.setItem("barangay_user", JSON.stringify(found));
    } else {
      setError(
        found
          ? "Invalid password. Use any password with 4+ characters."
          : `No ${role} account found with that email. Try: ${pool[0].email}`
      );
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem("barangay_user");
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
