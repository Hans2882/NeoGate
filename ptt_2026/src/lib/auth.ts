import { auth } from "@/utils/db/firebase";
import { signOut } from "firebase/auth";

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
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
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