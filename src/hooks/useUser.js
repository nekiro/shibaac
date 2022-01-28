import { useEffect, useState, createContext, useContext } from 'react';
import fetchJson from '../util/fetchJson';

const context = createContext();

export function UserContextWrapper({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await fetchJson('/api/user');
      if (user.isLoggedIn) {
        setUser(user);
      }
    })();
  }, []);

  return (
    <context.Provider value={{ user, setUser }}>{children}</context.Provider>
  );
}

export function useUser() {
  return useContext(context);
}
