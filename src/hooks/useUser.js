import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { fetchApi } from '../util/request';

const context = createContext(null);

export const UserContextWrapper = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const response = await fetchApi('GET', '/api/user');
    if (response.isLoggedIn) {
      setUser(response.user);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <context.Provider value={{ user, setUser }}>{children}</context.Provider>
  );
};

export const useUser = () => {
  return useContext(context);
};
