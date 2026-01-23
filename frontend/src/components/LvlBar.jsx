import "../styes/lvlBar.css";
import avatar from "../images/avatar.avif";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const LvlBar = (props) => {
  const { targetXp, setTargetXp, setOnePercent, setTargetBar, targetBar } =
    props;
  const { user } = useContext(UserContext);
  const [neededXp, setNeededXp] = useState(60);
  const [currentXp, setCurrentXp] = useState(0);

  const [barPercent, setBarPercent] = useState(0);

  const calculatePercentage = () => {
    if (user) {
      const currentTotal = Math.pow(user.level, 2) * 6;
      const xpTolevelUp = Math.pow(user.level + 1, 2) * 6 - currentTotal;

      const currProgress = user.xp - currentTotal;
      const onePercent = xpTolevelUp / 100;
      const currentPercent = (user.xp - currentTotal) / onePercent;
      const pixelPercent = currentPercent * 4.9;

      setCurrentXp(currProgress);
      setNeededXp(xpTolevelUp);
      setBarPercent(pixelPercent);
      setOnePercent(onePercent);
      setTargetXp(currProgress);
      setTargetBar(pixelPercent);

      return pixelPercent;
    }
  };

  useEffect(() => {
    if (!user) return;
    calculatePercentage();
  }, [user]);

  useEffect(() => {
    if (barPercent >= targetBar) return;
    const barInterval = setInterval(() => {
      setBarPercent((prev) => {
        if (prev >= targetBar) {
          clearInterval(barInterval);
          return targetBar;
        }
        return prev + 1;
      });
    }, 5);
    return () => clearInterval(barInterval);
  }, [targetBar]);

  useEffect(() => {
    if (currentXp >= targetXp) return;

    const interval = setInterval(() => {
      setCurrentXp((prev) => {
        if (prev >= targetXp) {
          clearInterval(interval);
          return targetXp;
        }
        return prev + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [targetXp]);

  useEffect(() => {
    setTargetXp((prev) => Math.min(prev, neededXp));
  }, [targetXp]);

  return (
    <div className="lvlBarContainer">
      <div className="lvlTitle">Level {user ? user.level : 1}</div>
      <div className="lvlBar">
        <div className="numberBar">
          {user ? currentXp.toLocaleString("pt-BR") : 0}/
          {user ? neededXp.toLocaleString("pt-BR") : 60}
        </div>
        <div
          style={{ width: `${barPercent}px` }}
          className="progressLoad"
        />{" "}
      </div>

      <img className="avatar" src={avatar} />
    </div>
  );
};

export default LvlBar;
