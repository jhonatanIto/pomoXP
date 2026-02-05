import { useContext, useEffect, useRef, useState } from "react";
import "../styes/report.css";
import { UserContext } from "../context/UserContext";
import {
  SlArrowLeft,
  SlArrowRight,
  SlCalender,
  SlClock,
  SlFire,
} from "react-icons/sl";
const Report = (props) => {
  const { reportPage, setReportPage } = props;
  const boxRef = useRef();
  const [selecFilter, setSelecFilter] = useState("week");
  const [totalHours, setTotalHours] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [streak, setStreak] = useState(0);

  const { cards } = useContext(UserContext);

  const handleClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closeReportPage();
    }
  };

  const closeReportPage = () => {
    setReportPage(false);
    setSelecFilter("week");
  };

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);

  const last7Cards = cards?.filter((n) => new Date(n.created_at) >= last7Days);

  const lastMonthCards = cards?.filter(
    (n) => new Date(n.created_at) >= lastMonth,
  );

  const last7Total = last7Cards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );
  const lastMonthTotal = lastMonthCards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );

  useEffect(() => {
    if (selecFilter === "week") {
      updateWeekTotal();
    } else if (selecFilter === "month") {
      updateMonthTotal();
    }
  }, [cards, selecFilter]);

  const updateWeekTotal = () => {
    setTotalHours((last7Total / 60).toFixed(0));
  };
  const updateMonthTotal = () => {
    setTotalHours((lastMonthTotal / 60).toFixed(0));
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
              <div className="reportTopNum">{totalHours}</div>
              <div>hours focused</div>
            </div>
          </div>
          <div className="topBox">
            <SlCalender className="reportClock" />
            <div className="reportBoxBot">
              <div className="reportTopNum">{totalDays}</div>
              <div>days accessed</div>
            </div>
          </div>
          <div className="topBox">
            <SlFire className="reportClock reportFire" />
            <div className="reportBoxBot">
              <div className="reportTopNum">{streak}</div>
              <div>day streak</div>
            </div>
          </div>
        </div>

        <div className="reportBotCont">
          <div className="focusHoursTitle">Focus Hours</div>
          <div className="reportBotMiddle">
            <div className="reportFilter">
              <button
                className={`reportFilterButt ${selecFilter === "week" ? "selecFilter" : ""} ${selecFilter !== "week" ? "hoverFilter" : ""}`}
                onClick={() => setSelecFilter("week")}
              >
                Week
              </button>
              <button
                className={`reportFilterButt ${selecFilter === "month" ? "selecFilter" : ""} ${selecFilter !== "month" ? "hoverFilter" : ""}`}
                onClick={() => setSelecFilter("month")}
              >
                Month
              </button>
              <button
                className={`reportFilterButt ${selecFilter === "year" ? "selecFilter" : ""} ${selecFilter !== "year" ? "hoverFilter" : ""}`}
                onClick={() => setSelecFilter("year")}
              >
                Year
              </button>
            </div>
            <div className="reportThisWeek">
              <button className="reportArrow">
                <SlArrowLeft />
              </button>
              <div>This Week</div>
              <button className="reportArrow">
                <SlArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
