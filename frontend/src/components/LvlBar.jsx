import "../styes/lvlBar.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const LvlBar = (props) => {
  const {
    targetXp,
    setTargetXp,
    setOnePercent,
    setTargetBar,
    targetBar,
    focusTime,
    popupTrigger,
  } = props;
  const { user, visitor } = useContext(UserContext);
  const [neededXp, setNeededXp] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [barPercent, setBarPercent] = useState(0);
  const [xpPopup, setXpPopup] = useState(false);

  useEffect(() => {
    if (popupTrigger === 0) return;

    setXpPopup(true);

    const timeout = setTimeout(() => {
      setXpPopup(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [popupTrigger]);

  const calculateAll = (user) => {
    const currentTotal = Math.pow(user.level, 2) * 6;
    const xpTolevelUp = Math.pow(user.level + 1, 2) * 6 - currentTotal;

    const currProgress = user?.xp - currentTotal;
    const onePercent = xpTolevelUp / 100;
    const currentPercent = (user?.xp - currentTotal) / onePercent;
    const pixelPercent = currentPercent * 4.9;

    setCurrentXp(() => {
      if (currProgress < 0) return 0;
      return currProgress;
    });
    setNeededXp(xpTolevelUp);
    setBarPercent(pixelPercent);
    setOnePercent(onePercent);
    setTargetXp(currProgress);
    setTargetBar(pixelPercent);
    setTotalHours(user.xp / 60);
  };
  console.log();

  useEffect(() => {
    if (!user && !visitor) return;
    if (user) {
      return calculateAll(user);
    } else {
      return calculateAll(visitor);
    }
  }, [user, visitor]);

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
      <div className="lvlTitle">
        <div>Level {user ? user.level : visitor.level}</div>
        <div className="totalHours">
          Total: {totalHours.toFixed(1)} hours <br />
          LVL100 = 1000h
        </div>
      </div>

      <div style={{ opacity: xpPopup ? 1 : 0 }} className="xpPopup">
        +{focusTime}xp
      </div>

      <div className="lvlBar">
        <div className="numberBar">
          {currentXp.toLocaleString("pt-BR")}/{neededXp.toLocaleString("pt-BR")}
        </div>
        <div
          style={{ width: `${barPercent > 0 ? barPercent : 0}px` }}
          className="progressLoad"
        />{" "}
      </div>
      <div className="username" style={{ display: user ? "flex" : "none" }}>
        {user?.name}
      </div>
      {/* <img className="avatar" src={avatar} /> */}
    </div>
  );
};

export default LvlBar;
