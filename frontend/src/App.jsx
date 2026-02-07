import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import History from "./components/History";
import LvlBar from "./components/LvlBar";
import Setting from "./components/Setting";
import Timer from "./components/Timer";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import LoginSuccess from "./utilities/LoginSuccess";
import ProfileSetting from "./components/ProfileSetting";
import AddNote from "./components/AddNote";
import Loading from "./components/Loading";
import Plans, { Cancel, Success } from "./components/Plans";
import Report from "./components/Report";
import { NotificationContext } from "./context/NotificationContext";
import alarm from "./audio/alarm.mp3";

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

  const [noteModal, setNoteModal] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");

  const [plansPage, setPlansPage] = useState(false);
  const [reportPage, setReportPage] = useState(false);

  const [paySuccess, setPaySuccess] = useState(false);
  const [payCancel, setPayCancel] = useState(false);
  const location = useLocation();

  const audioRef = useRef(new Audio(alarm));
  const [currentVolume, setCurrentVolume] = useState(1);

  const { successNotification, errorNotification } =
    useContext(NotificationContext);

  useEffect(() => {
    if (location.pathname === "/payment/success") {
      setPaySuccess(true);
      successNotification("Payment confimed!");
    }
    if (location.pathname === "/payment/cancel") {
      setPayCancel(true);
      errorNotification("Payment cancelled");
    }
  }, [location.pathname]);

  const triggerXpPopup = () => {
    setPopupTrigger((prev) => prev + 1);
  };

  const alarmSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.volume = currentVolume;
    audioRef.current.play();
  };

  const MainApp = (
    <div className="containerAlpha">
      <Loading />
      <Header
        setDisplayModal={setDisplayModal}
        setDisplayLogin={setDisplayLogin}
        setSignIn={setSignIn}
        setProfileEdit={setProfileEdit}
        setSavedNote={setSavedNote}
        setNoteModal={setNoteModal}
        setSelectedDay={setSelectedDay}
        setPlansPage={setPlansPage}
        setReportPage={setReportPage}
      />
      <div className="mainContainer">
        <History
          setDisplayLogin={setDisplayLogin}
          setSignIn={setSignIn}
          setSavedNote={setSavedNote}
          setSelectedDay={setSelectedDay}
          setNoteModal={setNoteModal}
        />
        <div>
          <Timer
            focusTime={focusTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            setTargetXp={setTargetXp}
            setTargetBar={setTargetBar}
            onePercent={onePercent}
            triggerXpPopup={triggerXpPopup}
            alarmSound={alarmSound}
          />
          <AddNote
            noteModal={noteModal}
            setNoteModal={setNoteModal}
            setSavedNote={setSavedNote}
            savedNote={savedNote}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            setPlansPage={setPlansPage}
          />
        </div>

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
        setCurrentVolume={setCurrentVolume}
        currentVolume={currentVolume}
        alarmSound={alarmSound}
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
      <Plans plansPage={plansPage} setPlansPage={setPlansPage} />
      <Report reportPage={reportPage} setReportPage={setReportPage} />
      <Success paySuccess={paySuccess} setPaySuccess={setPaySuccess} />
      <Cancel payCancel={payCancel} setPayCancel={setPayCancel} />
      <LoginSuccess />
    </div>
  );
  return (
    <Routes>
      <Route path="/*" element={MainApp} />
    </Routes>
  );
};

export default App;
