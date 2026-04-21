export const loginmanual = (data: any) => {
  localStorage.setItem("isLogin", "true");
  document.cookie = "isLogin=true; path=/"; 
};

export const logoutManual = () => {
  localStorage.removeItem("isLogin");
  document.cookie = "isLogin=; Max-Age=0; path=/";
};