import { createContext, useCallback, useEffect, useState } from "react";
import { refreshUser } from "../utilities/fetchData";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cards, setCards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitor, setVisitor] = useState({
    level: 1,
    xp: 6,
    cards: [],
    notes: [],
    plan: "free",
  });

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setNotes([]);
    setCards([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("pomoCards");
  };

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await refreshUser(token);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedCards = localStorage.getItem(`pomoCards`);

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
        localStorage.removeItem("user");
      }
    }
    if (storedCards && storedCards !== "undefined") {
      try {
        setCards(JSON.parse(storedCards));
      } catch (e) {
        console.error(e);
        localStorage.removeItem("pomoCards");
      }
    }
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        cards,
        setCards,
        fetchUserData,
        visitor,
        setVisitor,
        setNotes,
        notes,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
