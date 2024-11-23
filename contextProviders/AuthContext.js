import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDataWithExpiration, removeDataAfterLogin, storeDataWithExpiration } from '../utils/authHelper';
 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getDataWithExpiration('accessToken');
      setAccessToken(token);
      setLoading(false);
    };
    checkToken();
  }, []);

  const saveToken = async (token) => {
    await storeDataWithExpiration('accessToken', token);
    setAccessToken(token);
  };

  const removeToken = async () => {
    await removeDataAfterLogin('accessToken');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ setAccessToken: saveToken, accessToken, removeToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
