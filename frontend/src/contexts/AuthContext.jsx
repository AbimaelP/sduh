import { createContext, useState, useContext, useEffect } from "react";
import { loginAPI } from "../services/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const mainRolesAllowedSwitchRoles = ["admin", "municipal"];
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // adiciona loading

  const login = async (
    identify = "",
    password = "",
    authType = "prototipo"
  ) => {
    try {
      let userData = {};
      switch (authType) {
        case "prototipo":
          userData = await loginAPI(identify, password, authType);
          break;

        case "gov":
          userData = await loginAPI(identify, password, authType);
          break;

        case "cidadao":
          userData = { user: "Cidadão", role: "cidadao", main_role: "cidadao" };
          break;
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      const message = err.response?.data?.error || "Autenticação falhou";
      console.log('deu erro aqui')
      throw new Error(message);
    }
  };

  const changeUserAccessRole = (role) => {
    if (mainRolesAllowedSwitchRoles.includes(user.main_role)) {
      const userData = user;

      userData.role = role;

      setUser(userData);
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(userData));
      window.location.href = "/";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const onLoading = () => {
    setLoading(true);
  };

  const offLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        onLoading,
        offLoading,
        changeUserAccessRole,
        mainRolesAllowedSwitchRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
