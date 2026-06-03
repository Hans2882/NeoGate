import { auth } from "@/utils/db/firebase";
import { signOut } from "firebase/auth";

type SessionUser = {
  id?: string;
  name?: string;
  fullname?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
  role?: string;
  gate?: 'gate1' | 'gate2' | null;
};

export const normalizeGate = (gate?: string | null) => {
  if (!gate) return null;

  const normalized = gate.toLowerCase().replace(/\s+/g, '');
  if (normalized === 'gate1') return 'gate1';
  if (normalized === 'gate2') return 'gate2';

  return null;
};

const getGateFromRole = (role?: string | null) => {
  if (role === 'operator1') return 'gate1';
  if (role === 'operator2') return 'gate2';
  return null;
};

export const loginmanual = (data: any) => {
  if (typeof window !== "undefined") {
    const normalizedData = {
      ...data,
      gate: normalizeGate(data?.gate) || getGateFromRole(data?.role)
    };

    localStorage.setItem("isLogin", "true");

    localStorage.setItem("user", JSON.stringify(normalizedData)); 
    document.cookie = "isLogin=true; path=/";
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLogin") === "true";
};

export const getSessionUser = () => {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    return null;
  }
};

export const getSessionUserName = () => {
  const user = getSessionUser();
  return user?.name || user?.fullname || user?.fullName || user?.displayName || user?.email || null;
};

export const getSessionUserRole = () => {
  const user = getSessionUser();
  return user?.role || null;
};

export const getSessionUserGate = () => {
  const user = getSessionUser();
  return normalizeGate(user?.gate) || getGateFromRole(user?.role) || null;
};

export const logoutUser = async () => {
  if (typeof window === "undefined") return;

  try {

    await signOut(auth);

   
    localStorage.removeItem("isLogin");
    localStorage.removeItem("user");

    
    document.cookie = "isLogin=; Max-Age=0; path=/";
    
    return true;
  } catch (error) {
    console.error("Error saat logout:", error);
    return false;
  }
};
