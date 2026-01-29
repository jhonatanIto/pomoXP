import { useContext, useEffect, useRef, useState } from "react";
import "../styes/timer.css";
import { FaArrowRight } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { getCards } from "../utilities/fetchData.js";
import clickSound from "../audio/clickDefault.mp3";
import alarm from "../audio/alarm.mp3";
import xpUp from "../audio/xpUp.mp3";
import levelUp from "../audio/levelUp.mp3";
import { convertToLevel } from "../../../backend/utils/level.js";

const playClick = () => {
  new Audio(clickSound).play();
};
const alarmSound = () => {
  const audio = new Audio(alarm);
  audio.volume = 1;
  audio.play();
};
const xpUpAudio = () => {
  const audio = new Audio(xpUp);
  audio.volume = 0.5;
  audio.play();
};

const lvlUpSound = () => {
  const audio = new Audio(levelUp);
  audio.volume = 0.2;
  audio.play();
};

const Timer = (props) => {
  const {
    focusTime,
    shortBreak,
    longBreak,
    setTargetXp,
    setTargetBar,
    onePercent,
    triggerXpPopup,
  } = props;
  const [time, setTime] = useState(focusTime * 60);
  const [isRunning, setIsRunnig] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pomodoro");
  const { token, user, setCards, fetchUserData, setVisitor } =
    useContext(UserContext);

  const minutes = Number(120);
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  useEffect(() => {
    if (selectedTab === "Pomodoro") {
      setTime(focusTime * 60);
    } else if (selectedTab === "Short Break") {
      setTime(shortBreak * 60);
    } else {
      setTime(longBreak * 60);
    }
  }, [focusTime, shortBreak, longBreak, selectedTab]);

  const prevLevel = useRef(null);
  useEffect(() => {
    if (!user) return;

    if (prevLevel.current !== null && user.level > prevLevel.current) {
      lvlUpSound();
    }
    prevLevel.current = user.level;
  }, [user?.level]);

  async function postCard() {
    try {
      if (!Number.isFinite(minutes) || minutes <= 0) return;

      const res = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          minutes: minutes,
          created_at: localTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }

      setTimeout(async () => {
        fetchUserData();
      }, 1500);

      const updateCards = await getCards(token);
      setCards(updateCards);

      return data;
    } catch (error) {
      console.error(error.message);
    }
  }
  const changeButts = (tab, time) => {
    setIsRunnig(false);
    setTime(time * 60);
    setSelectedTab(tab);
  };

  const handleTimerEnd = () => {
    setIsRunnig(false);
    alarmSound();

    if (selectedTab === "Pomodoro") {
      if (user) {
        postCard();
        setTimeout(() => {
          setTargetXp((prev) => prev + minutes);
          setTargetBar((prev) => {
            const percent = minutes / onePercent;
            return prev + percent * 4.9;
          });

          xpUpAudio();
        }, 1100);
        setTimeout(() => {
          triggerXpPopup();
        }, 1200);
      } else {
        setTimeout(() => {
          setVisitor((prev) => {
            const newXp = prev.xp + minutes;
            return {
              ...prev,
              level: convertToLevel(newXp),
              xp: newXp,
              cards: [
                ...prev.cards,
                { minutes: minutes, created_at: localTime.toISOString() },
              ],
            };
          });
        }, 1100);
        setTimeout(() => {
          triggerXpPopup();
        }, 1200);

        setTargetXp((prev) => prev + minutes);
        setTargetBar((prev) => {
          const percent = minutes / onePercent;
          return prev + percent * 4.9;
        });
      }
      changeButts("Short Break", shortBreak); // set time to short break mode
    } else if (selectedTab === "Short Break") {
      changeButts("Pomodoro", focusTime); // back to work
    }
  };

  useEffect(() => {
    selectedTab === "Pomodoro"
      ? (document.body.style.backgroundColor = "rgb(53 106 146)")
      : selectedTab === "Short Break"
        ? (document.body.style.backgroundColor = "rgb(47 124 129)")
        : (document.body.style.backgroundColor = "rgb(79, 79, 79)");
  }, [selectedTab]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            handleTimerEnd();

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = () => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const secs = (time % 60).toString().padStart(2, "0");
    document.title = `${mins}:${secs} - PomoXP`;
    return `${mins}:${secs}`;
  };

  return (
    <div className="timerContainer">
      <div className="timerHeader">
        <button
          onClick={() => {
            changeButts("Pomodoro", focusTime);
          }}
          className={`timerButt ${
            selectedTab === "Pomodoro" ? "timerButtBg" : ""
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => {
            changeButts("Short Break", shortBreak);
          }}
          className={`timerButt ${
            selectedTab === "Short Break" ? "timerButtBg" : ""
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            changeButts("Long Break", longBreak);
          }}
          className={`timerButt ${
            selectedTab === "Long Break" ? "timerButtBg" : ""
          }`}
        >
          Long Break
        </button>
      </div>
      <div className="clock">{formatTime()}</div>
      <div className="timerBot">
        <button
          onClick={() => {
            setIsRunnig(!isRunning);
            playClick();
          }}
          className="pause"
          style={{
            color:
              selectedTab === "Pomodoro"
                ? "rgb(53 106 146)"
                : selectedTab === "Short Break"
                  ? "rgb(47 124 129)"
                  : "rgb(79, 79, 79)",
          }}
        >
          {isRunning ? "PAUSE" : "START"}
        </button>
        <button
          style={{ display: isRunning ? "block" : "none" }}
          className="arrowButt"
          onClick={() => {
            selectedTab === "Pomodoro"
              ? changeButts("Short Break", shortBreak)
              : changeButts("Pomodoro", focusTime);
          }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Timer;
