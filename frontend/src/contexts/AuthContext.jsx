import { createContext, useState, useContext, useEffect } from "react";
import { loginAPI } from '../services/api/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email = '', password = '', authType = 'prototipo') => {
    let userData = {};

    switch (authType) {
      case 'prototipo':
        userData = await loginAPI(email, password)
        break;

      case 'gov':
        
        break;

      case 'cidadao':
        userData = { user: 'Cidadão', role: 'cidadao' }
        break;
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    let userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
