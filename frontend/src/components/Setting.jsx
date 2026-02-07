import { useEffect, useRef } from "react";
import "../styes/setting.css";
import { FaClock } from "react-icons/fa";
import { IoVolumeHighOutline } from "react-icons/io5";
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
    setCurrentVolume,
    currentVolume,
    alarmSound,
  } = props;

  useEffect(() => {
    if (localStorage.getItem("timeSetting")) {
      const timeSetting = JSON.parse(localStorage.getItem("timeSetting"));
      setFocusTime(timeSetting.focusTime);
      setShortBreak(timeSetting.shortBreak);
      setLongBreak(timeSetting.longBreak);
    }
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
              max={999}
              min={1}
              value={focusTime}
              type="number"
              onChange={(e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v)) return;

                v = Math.min(Math.max(v, 1), 999);
                setFocusTime(v);
              }}
            />
          </div>
          <div className="settingButt">
            Short Break
            <input
              value={shortBreak}
              type="number"
              onChange={(e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v)) return;

                v = Math.min(Math.max(v, 1), 999);
                setShortBreak(v);
              }}
            />
          </div>
          <div className="settingButt">
            Long Break
            <input
              value={longBreak}
              type="number"
              onChange={(e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v)) return;

                v = Math.min(Math.max(v, 1), 999);
                setLongBreak(v);
              }}
            />
          </div>
        </div>
        <div className="volumeBox">
          <div className="volumeTitle">Alarm Volume</div>
          <div className="volumeCont">
            <IoVolumeHighOutline className="volumeIcon" />
            <input
              type="range"
              className="volRange"
              min="0"
              max="100"
              value={currentVolume * 100}
              onInput={(e) => setCurrentVolume(e.target.value / 100)}
            />
            <button onClick={() => alarmSound()} className="alarmTest">
              Play
            </button>
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
