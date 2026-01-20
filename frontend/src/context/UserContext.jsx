import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);

    setToken(localStorage.getItem("token") || null);
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, logout, cards, setCards }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
