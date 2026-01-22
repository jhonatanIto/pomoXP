import { useEffect, useRef } from "react";
import "../styes/setting.css";
import { FaClock } from "react-icons/fa";
const Setting = (props) => {
  const {
    displayModal,
    setDisplayModal,
    setFocusTime,
    focusTime,
    setShortBreak,
    shortBreak,
    longBreak,
    setLongBreak,
  } = props;

  useEffect(() => {
    const timeSetting = JSON.parse(localStorage.getItem("timeSetting"));
    setFocusTime(timeSetting.focusTime);
    setShortBreak(timeSetting.shortBreak);
    setLongBreak(timeSetting.longBreak);
  }, []);

  function saveTimeSettings() {
    localStorage.setItem(
      "timeSetting",
      JSON.stringify({ focusTime, shortBreak, longBreak }),
    );
  }

  const boxRef = useRef();
  const handleOverlayClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      setDisplayModal("none");
    }
  };
  return (
    <div
      style={{ display: displayModal }}
      className="settingContainer"
      onMouseDown={(e) => {
        handleOverlayClick(e);
        saveTimeSettings();
      }}
    >
      <div className="settingBox" ref={boxRef}>
        <div className="settingTitle">SETTING</div>
        <div className="settingTimerContainer">
          <FaClock className="settingClock" />
          Timer (minutes)
        </div>
        <div className="settingButtContainer">
          <div className="settingButt">
            Pomodoro
            <input
              value={focusTime}
              type="number"
              onChange={(e) => {
                setFocusTime(e.target.value);
              }}
            />
          </div>
          <div className="settingButt">
            Short Break
            <input
              value={shortBreak}
              type="number"
              onChange={(e) => setShortBreak(e.target.value)}
            />
          </div>
          <div className="settingButt">
            Long Break
            <input
              value={longBreak}
              type="number"
              onChange={(e) => {
                setLongBreak(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            setDisplayModal("none");
            saveTimeSettings();
          }}
          className="settingSave"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Setting;
