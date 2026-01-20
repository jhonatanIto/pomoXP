import { useState } from "react";
import Header from "./components/Header";
import History from "./components/History";
import LvlBar from "./components/LvlBar";
import Setting from "./components/Setting";
import Timer from "./components/Timer";
import Login from "./components/Login";

const App = () => {
  const [focusTime, setFocusTime] = useState(1);
  const [shortBreak, setShortBreak] = useState(15);
  const [longBreak, setLongBreak] = useState(60);
  const [displayModal, setDisplayModal] = useState("none");
  const [displayLogin, setDisplayLogin] = useState("none");
  return (
    <div className="containerAlpha">
      <Header
        setDisplayModal={setDisplayModal}
        setDisplayLogin={setDisplayLogin}
      />
      <div className="mainContainer">
        <History />
        <Timer
          focusTime={focusTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
        />
        <LvlBar />
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
      <Login setDisplayLogin={setDisplayLogin} displayLogin={displayLogin} />
    </div>
  );
};

export default App;
