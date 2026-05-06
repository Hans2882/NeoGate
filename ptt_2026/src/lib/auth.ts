import { auth } from "@/utils/db/firebase";
import { signOut } from "firebase/auth";

type SessionUser = {
  id?: string;
  name?: string;
  fullname?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
};

export const loginmanual = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isLogin", "true");

    localStorage.setItem("user", JSON.stringify(data)); 
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
