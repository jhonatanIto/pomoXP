import { useState } from "react";
import Header from "./components/Header";
import History from "./components/History";
import LvlBar from "./components/LvlBar";
import Setting from "./components/Setting";
import Timer from "./components/Timer";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import LoginSuccess from "./utilities/LoginSuccess";
import ProfileSetting from "./components/ProfileSetting";

const App = () => {
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(10);
  const [longBreak, setLongBreak] = useState(60);
  const [displayModal, setDisplayModal] = useState("none");
  const [displayLogin, setDisplayLogin] = useState("none");
  const [targetXp, setTargetXp] = useState(0);
  const [targetBar, setTargetBar] = useState(0);
  const [onePercent, setOnePercent] = useState(0);
  const [signIn, setSignIn] = useState(true);
  const [popupTrigger, setPopupTrigger] = useState(0);
  const [profileEdit, setProfileEdit] = useState(false);

  const triggerXpPopup = () => {
    setPopupTrigger((prev) => prev + 1);
  };

  const MainApp = (
    <div className="containerAlpha">
      <Header
        setDisplayModal={setDisplayModal}
        setDisplayLogin={setDisplayLogin}
        setSignIn={setSignIn}
        setProfileEdit={setProfileEdit}
      />
      <div className="mainContainer">
        <History setDisplayLogin={setDisplayLogin} setSignIn={setSignIn} />

        <Timer
          focusTime={focusTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
          setTargetXp={setTargetXp}
          setTargetBar={setTargetBar}
          onePercent={onePercent}
          triggerXpPopup={triggerXpPopup}
        />

        <LvlBar
          popupTrigger={popupTrigger}
          setOnePercent={setOnePercent}
          onePercent={onePercent}
          targetXp={targetXp}
          setTargetXp={setTargetXp}
          targetBar={targetBar}
          setTargetBar={setTargetBar}
          focusTime={focusTime}
        />
      </div>
      <Setting
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
        setFocusTime={setFocusTime}
        focusTime={focusTime}
        setShortBreak={setShortBreak}
        shortBreak={shortBreak}
        longBreak={longBreak}
        setLongBreak={setLongBreak}
      />
      <Login
        signIn={signIn}
        setDisplayLogin={setDisplayLogin}
        displayLogin={displayLogin}
        setSignIn={setSignIn}
      />
      <ProfileSetting
        setProfileEdit={setProfileEdit}
        profileEdit={profileEdit}
      />
    </div>
  );
  return (
    <Routes>
      <Route path="/" element={MainApp}></Route>
      <Route path="/login/success" element={<LoginSuccess />} />
    </Routes>
  );
};

export default App;
