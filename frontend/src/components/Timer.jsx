import { useContext, useEffect, useState } from "react";
import "../styes/timer.css";
import { FaArrowRight } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { getCards } from "../utilities/fetchData.js";
import clickSound from "../audio/clickDefault.mp3";

const playClick = () => {
  new Audio(clickSound).play();
};

const Timer = (props) => {
  const { focusTime, shortBreak, longBreak, setTargetXp } = props;
  const [time, setTime] = useState(focusTime * 60);
  const [isRunning, setIsRunnig] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pomodoro");

  const { token, user, setCards, fetchUserData } = useContext(UserContext);

  useEffect(() => {
    if (selectedTab === "Pomodoro") {
      setTime(focusTime * 60);
    } else if (selectedTab === "Short Break") {
      setTime(shortBreak * 60);
    } else {
      setTime(longBreak * 60);
    }
  }, [focusTime, shortBreak, longBreak, selectedTab]);

  async function postCard() {
    try {
      const minutes = Number(focusTime);
      if (!Number.isFinite(minutes) || minutes <= 0) return;

      const now = new Date();
      const localTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000,
      );

      const res = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          minutes: 50,
          created_at: localTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }

      setTargetXp((prev) => prev + 50);

      setTimeout(() => {
        fetchUserData();
      }, 2000);

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

    if (selectedTab === "Pomodoro") {
      if (user) postCard();
      changeButts("Short Break", shortBreak); // set time to short break mode
    } else if (selectedTab === "Short Break") {
      changeButts("Pomodoro", focusTime); // back to work
    }
  };

  useEffect(() => {
    selectedTab === "Pomodoro"
      ? (document.body.style.backgroundColor = "rgb(175 77 77)")
      : selectedTab === "Short Break"
        ? (document.body.style.backgroundColor = "rgb(47 124 129)")
        : (document.body.style.backgroundColor = "rgb(53 106 146)");
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
                ? "rgb(175 77 77)"
                : selectedTab === "Short Break"
                  ? "rgb(47 124 129)"
                  : "rgb(53 106 146)",
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
