import "../styes/lvlBar.css";
import avatar from "../images/avatar.avif";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const LvlBar = () => {
  const { user } = useContext(UserContext);
  const [xp, setXp] = useState(0);
  const [neededXp, setNeededXp] = useState(60);
  const [percent, setPercent] = useState(xp);
  const [userTotalXp, setUserTotalXp] = useState(0);

  useEffect(() => {
    if (!user) return;
    const nextLevelXp = 6 * Math.pow(user?.level + 1, 2);
    setUserTotalXp(user.xp);
    setNeededXp(nextLevelXp);
  }, [user]);

  useEffect(() => {
    setPercent(Math.min(userTotalXp, Math.max(xp, 0)));
  }, [xp]);

  useEffect(() => {
    if (xp >= neededXp) return;
    const interval = setInterval(() => {
      setXp((prev) => {
        return prev + 1;
      });
    }, 0);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="lvlBarContainer">
      <div className="lvlTitle">Level {user ? user.level : 1}</div>
      <div className="lvlBar">
        {" "}
        {percent.toLocaleString("pt-BR")}/{neededXp.toLocaleString("pt-BR")}
      </div>

      <img className="avatar" src={avatar} />
    </div>
  );
};

export default LvlBar;
