export const loginmanual = (data: any) => {
  localStorage.setItem("isLogin", "true");
  document.cookie = "isLogin=true; path=/"; 
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

export const logoutUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("isLogin");
  localStorage.removeItem("user");
  document.cookie = "isLogin=; Max-Age=0; path=/";
};

export const logoutManual = () => {
  localStorage.removeItem("isLogin");
  document.cookie = "isLogin=; Max-Age=0; path=/";
};