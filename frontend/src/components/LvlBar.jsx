import "../styes/lvlBar.css";
import avatar from "../images/avatar.avif";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const LvlBar = (props) => {
  const { targetXp, setTargetXp } = props;
  const { user } = useContext(UserContext);
  const [xp, setXp] = useState(0);
  const [neededXp, setNeededXp] = useState(60);
  const [percent, setPercent] = useState(xp);

  useEffect(() => {
    if (!user) return;

    const nextLevelXp = 6 * Math.pow(user?.level + 1, 2);

    setNeededXp(nextLevelXp);
    setXp(user.xp);
    setTargetXp(user.xp);
  }, [user]);
  useEffect(() => {
    if (xp >= targetXp) return;

    const interval = setInterval(() => {
      setXp((prev) => {
        if (prev >= targetXp) {
          clearInterval(interval);
          return targetXp;
        }
        return prev + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [targetXp, xp]);

  useEffect(() => {
    setPercent(Math.min(xp, neededXp));
  }, [xp, neededXp]);

  return (
    <div className="lvlBarContainer">
      <div className="lvlTitle">Level {user ? user.level : 1}</div>
      <div className="lvlBar">
        <div className="numberBar">
          {user ? percent.toLocaleString("pt-BR") : 0}/
          {user ? neededXp.toLocaleString("pt-BR") : 60}
        </div>
        <div className="progressLoad" />{" "}
      </div>

      <img className="avatar" src={avatar} />
    </div>
  );
};

export default LvlBar;
