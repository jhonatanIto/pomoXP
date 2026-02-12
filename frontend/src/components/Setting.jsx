import { useEffect, useRef, useState } from "react";
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
    setPomoColor,
    setShortColor,
    setLongColor,
    pomoColor,
    shortColor,
    longColor,
  } = props;

  const [selecChangeColor, setSelecChangeColor] = useState("pomo");
  const [showColors, setShowColors] = useState(false);
  const coloRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("timeSetting")) {
      const timeSetting = JSON.parse(localStorage.getItem("timeSetting"));
      setFocusTime(timeSetting.focusTime);
      setShortBreak(timeSetting.shortBreak);
      setLongBreak(timeSetting.longBreak);
    }
  }, []);

  const colRef = useRef({
    pomo: pomoColor,
    short: shortColor,
    long: longColor,
  });
  useEffect(() => {
    colRef.current = { pomo: pomoColor, short: shortColor, long: longColor };
    localStorage.setItem("themeColors", JSON.stringify(colRef.current));
  }, [pomoColor, shortColor, longColor]);

  function saveTimeSettings() {
    localStorage.setItem(
      "timeSetting",
      JSON.stringify({ focusTime, shortBreak, longBreak }),
    );
  }

  const boxRef = useRef();

  const closeColorBox = (e) => {
    if (!coloRef.current.contains(e.target)) {
      setShowColors(false);
      setSelecChangeColor("");
    }
  };
  const handleOverlayClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      setDisplayModal("none");
      closeColorBox(e);
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
      <div
        onMouseDown={(e) => closeColorBox(e)}
        className="settingBox"
        ref={boxRef}
      >
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

        <div className="themeColorCont">
          <div className="volumeTitle">Themes</div>
          <div className="colorBoxCont">
            <div
              style={{ backgroundColor: pomoColor }}
              className={`colorBox ${selecChangeColor === "pomo" ? "colSelec" : ""} `}
              onClick={() => {
                setSelecChangeColor("pomo");
                setShowColors(true);
              }}
            ></div>
            <div
              style={{ backgroundColor: shortColor }}
              className={`colorBox ${selecChangeColor === "short" ? "colSelec" : ""} `}
              onClick={() => {
                setSelecChangeColor("short");
                setShowColors(true);
              }}
            ></div>
            <div
              style={{ backgroundColor: longColor }}
              className={`colorBox ${selecChangeColor === "long" ? "colSelec" : ""} `}
              onClick={() => {
                setSelecChangeColor("long");
                setShowColors(true);
              }}
            ></div>
          </div>
          <ColorBox
            selecChangeColor={selecChangeColor}
            setPomoColor={setPomoColor}
            setShortColor={setShortColor}
            setLongColor={setLongColor}
            showColors={showColors}
            setShowColors={setShowColors}
            coloRef={coloRef}
          />
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

const ColorBox = (props) => {
  const {
    setPomoColor,
    setShortColor,
    setLongColor,
    selecChangeColor,
    showColors,
    coloRef,
  } = props;

  useEffect(() => {
    const savedColorsLocal = localStorage.getItem("themeColors");
    if (savedColorsLocal) {
      const allColors = JSON.parse(savedColorsLocal);
      setPomoColor(allColors.pomo);
      setShortColor(allColors.short);
      setLongColor(allColors.long);
    }
  }, []);

  return (
    <div
      ref={coloRef}
      style={{ display: showColors ? "flex" : "none" }}
      className="colorBoxComp"
    >
      <div
        style={{ backgroundColor: "rgb(175, 77, 77)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(175, 77, 77)");
              break;
            case "short":
              setShortColor("rgb(175, 77, 77)");
              break;
            case "long":
              setLongColor("rgb(175, 77, 77)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: " rgb(0, 116, 33)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor(" rgb(0, 116, 33)");
              break;
            case "short":
              setShortColor(" rgb(0, 116, 33)");
              break;
            case "long":
              setLongColor(" rgb(0, 116, 33)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(0, 94, 89)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(0, 94, 89)");
              break;
            case "short":
              setShortColor("rgb(0, 94, 89)");
              break;
            case "long":
              setLongColor("rgb(0, 94, 89)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(0, 56, 94)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(0, 56, 94)");
              break;
            case "short":
              setShortColor("rgb(0, 56, 94)");
              break;
            case "long":
              setLongColor("rgb(0, 56, 94)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: " rgb(5, 0, 94)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor(" rgb(5, 0, 94)");
              break;
            case "short":
              setShortColor(" rgb(5, 0, 94)");
              break;
            case "long":
              setLongColor(" rgb(5, 0, 94)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(44, 0, 94)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(44, 0, 94)");
              break;
            case "short":
              setShortColor("rgb(44, 0, 94)");
              break;
            case "long":
              setLongColor("rgb(44, 0, 94)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(127, 127, 127)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(127, 127, 127)");
              break;
            case "short":
              setShortColor("rgb(127, 127, 127)");
              break;
            case "long":
              setLongColor("rgb(127, 127, 127)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(116, 0, 116)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(116, 0, 116)");
              break;
            case "short":
              setShortColor("rgb(116, 0, 116)");
              break;
            case "long":
              setLongColor("rgb(116, 0, 116)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(53 106 146)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(53 106 146)");
              break;
            case "short":
              setShortColor("rgb(53 106 146)");
              break;
            case "long":
              setLongColor("rgb(53 106 146)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(47 124 129)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(47 124 129)");
              break;
            case "short":
              setShortColor("rgb(47 124 129)");
              break;
            case "long":
              setLongColor("rgb(47 124 129)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(44, 44, 44)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(44, 44, 44)");
              break;
            case "short":
              setShortColor("rgb(44, 44, 44)");
              break;
            case "long":
              setLongColor("rgb(44, 44, 44)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(0, 116, 85)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(0, 116, 85)");
              break;
            case "short":
              setShortColor("rgb(0, 116, 85)");
              break;
            case "long":
              setLongColor("rgb(0, 116, 85)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(181, 163, 0)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(181, 163, 0)");
              break;
            case "short":
              setShortColor("rgb(181, 163, 0)");
              break;
            case "long":
              setLongColor("rgb(181, 163, 0)");
              break;
          }
        }}
      ></div>
      <div
        style={{ backgroundColor: "rgb(150, 92, 0)" }}
        className="colorBox"
        onClick={() => {
          switch (selecChangeColor) {
            case "pomo":
              setPomoColor("rgb(150, 92, 0)");
              break;
            case "short":
              setShortColor("rgb(150, 92, 0)");
              break;
            case "long":
              setLongColor("rgb(150, 92, 0)");
              break;
          }
        }}
      ></div>
    </div>
  );
};
