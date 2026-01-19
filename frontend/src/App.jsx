import Header from "./components/Header";
import History from "./components/History";
import LvlBar from "./components/LvlBar";
import Timer from "./components/Timer";

const App = () => {
  return (
    <div className="containerAlpha">
      <Header />
      <div className="mainContainer">
        <History />
        <Timer />
        <LvlBar />
      </div>
    </div>
  );
};

export default App;
