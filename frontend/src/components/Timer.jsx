import { useEffect, useState } from "react";
import "../styes/timer.css";
import { FaArrowRight } from "react-icons/fa";

const Timer = () => {
  const [time, setTime] = useState(120 * 60); // 2hours
  const [isRunning, setIsRunnig] = useState(false);
  const [mode, setMode] = useState("focus");
  const [cycles, setCycles] = useState(0);

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

  const handleReset = () => {
    setIsRunnig(false);
    setTime(mode === "focus" ? 25 * 60 : 5 * 60);
  };
  return (
    <div className="timerContainer">
      <div className="timerHeader">
        <button className="timerButt">Pomodoro</button>
        <button className="timerButt">Short Break</button>
        <button className="timerButt">Long Break</button>
      </div>
      <div className="clock">{formatTime()}</div>
      <div className="timerBot">
        <div className="timerBotNone"></div>
        <button onClick={() => setIsRunnig(!isRunning)} className="pause">
          {isRunning ? "PAUSE" : "START"}
        </button>
        <button className="arrowButt">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Timer;
