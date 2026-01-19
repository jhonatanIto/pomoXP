import "../styes/history.css";

const History = () => {
  return (
    <div className="historyContainer">
      <div className="historyCard">
        {new Date().toLocaleDateString()}
        <div>@ @ @ @ @ @</div>
      </div>
    </div>
  );
};

export default History;
