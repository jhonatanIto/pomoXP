import { useContext, useEffect, useState } from "react";
import "../styes/timer.css";
import { FaArrowRight } from "react-icons/fa";
import { GoalContext } from "../context/Goal";

const Timer = () => {
  const [selectedTime, setSelectedTime] = useState(120);
  const [time, setTime] = useState(selectedTime * 60); // 2hours
  const [isRunning, setIsRunnig] = useState(false);
  const [mode, setMode] = useState("focus");
  const [selectedTab, setSelectedTab] = useState("Pomodoro");
  const [cycles, setCycles] = useState(0);

  const { setGoal } = useContext(GoalContext);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            handleTimerEnd();
            if (selectedTab === "Pomodoro") {
              setGoal((prev) => ({
                ...prev,
                goal: selectedTime,
                times: (prev.times || 0) + 1,
                date: new Date().toLocaleDateString(),
              }));
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const changeButts = (tab, time) => {
    setIsRunnig(false);
    setTime(time * 60);
    setSelectedTab(tab);
  };

  const handleTimerEnd = () => {
    setIsRunnig(false);
    if (mode === "focus") {
      setMode("break");
      setTime(15 * 60); // 15 minutes break
    } else {
      setMode("focus");
      setTime(120 * 60); // back to work
      setCycles((c) => c * 1);
    }
  };

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
            changeButts("Pomodoro", 120);
            document.body.style.backgroundColor = "rgb(175 77 77)";
          }}
          className={`timerButt ${
            selectedTab === "Pomodoro" ? "timerButtBg" : ""
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => {
            changeButts("Short Break", 15);
            document.body.style.backgroundColor = "rgb(47 124 129)";
          }}
          className={`timerButt ${
            selectedTab === "Short Break" ? "timerButtBg" : ""
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            changeButts("Long Break", 60);
            document.body.style.backgroundColor = "rgb(53 106 146)";
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
          onClick={() => setIsRunnig(!isRunning)}
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
              ? changeButts("Short Break", 15)
              : changeButts("Pomodoro", 120);
          }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Timer;
