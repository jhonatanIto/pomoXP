import { useRef } from "react";
import "../styes/report.css";
import { SlCalender, SlClock, SlFire } from "react-icons/sl";
const Report = (props) => {
  const { reportPage, setReportPage } = props;
  const boxRef = useRef();

  const handleClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closeReportPage();
    }
  };

  const closeReportPage = () => {
    setReportPage(false);
  };

  return (
    <div
      onMouseDown={(e) => handleClick(e)}
      className={`reportBody ${reportPage ? "active" : ""}`}
    >
      <div ref={boxRef} className="reportContainer">
        <div className="reportTopCont">
          <div className="topBox">
            <SlClock className="reportClock" />
            <div className="reportBoxBot">
              <div className="reportTopNum">42</div>
              <div>hours focused</div>
            </div>
          </div>
          <div className="topBox">
            <SlCalender className="reportClock" />
            <div className="reportBoxBot">
              <div className="reportTopNum">42</div>
              <div>days accessed</div>
            </div>
          </div>
          <div className="topBox">
            <SlFire className="reportClock reportFire" />
            <div className="reportBoxBot">
              <div className="reportTopNum">42</div>
              <div>day streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
