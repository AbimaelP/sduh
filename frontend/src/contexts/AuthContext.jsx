import { createContext, useState, useContext, useEffect } from "react";
import { loginAPI } from '../services/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // adiciona loading

  const login = async (identify = '', password = '', authType = 'prototipo') => {
    let userData = {};

    switch (authType) {
      case 'prototipo':
        userData = await loginAPI(identify, password, authType);
        break;

      case 'gov':
        userData = await loginAPI(identify, password, authType);
        break;

      case 'cidadao':
        userData = { user: 'Cidadão', role: 'cidadao' };
        break;
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const onLoading = () => {
    setLoading(true)
  }

  const offLoading = () => {
    setLoading(false)
  }

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, onLoading, offLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
