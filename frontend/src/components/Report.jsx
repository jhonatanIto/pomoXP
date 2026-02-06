import { useContext, useEffect, useRef, useState } from "react";
import "../styes/report.css";
import userPhoto from "../images/userPhoto.png";
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
  const [selecBar, setSelecBar] = useState("This Week");
  const [totalHours, setTotalHours] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rankedDisplay, setRankedDisplay] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  // const [allUsersWeek, setAllUsersWeek] = useState([]);

  const { cards } = useContext(UserContext);

  const handleClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closeReportPage();
    }
  };

  const closeReportPage = () => {
    setReportPage(false);
    setSelecFilter("week");
    setRankedDisplay(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/users/all",
      );

      const data = await res.json();

      if (!res.ok) throw Error(data?.message || "Request failed");

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userss = async () => {
      const data = await fetchUsers();
      setAllUsers(data.users);
    };

    userss();
  }, []);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);

  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 29);

  const lastYear = new Date();
  lastYear.setDate(today.getDate() - 364);

  const last7Cards = cards?.filter((n) => new Date(n.created_at) >= last7Days);

  const lastMonthCards = cards?.filter(
    (n) => new Date(n.created_at) >= lastMonth,
  );

  const lastYearCards = cards?.filter(
    (n) => new Date(n.created_at) >= lastYear,
  );

  const last7Total = last7Cards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );
  const lastMonthTotal = lastMonthCards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );
  const lastYearTotal = lastYearCards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );

  const updateWeekTotal = () => {
    setTotalHours((last7Total / 60).toFixed(0));
  };
  const updateMonthTotal = () => {
    setTotalHours((lastMonthTotal / 60).toFixed(0));
  };
  const updateYearTotal = () => {
    setTotalHours((lastYearTotal / 60).toFixed(0));
  };

  const calculateAccessed = (calc) => {
    const days = {};

    calc.map((l) => {
      const date = l.created_at.split("T")[0];

      days[date] = true;
    });

    const total = Object.entries(days).length;

    return total;
  };

  const calculateStreak = (cards) => {
    if (!cards || cards.length === 0) return;

    const daysSet = new Set(cards.map((c) => c.created_at.split("T")[0]));

    let streak = 0;
    const current = new Date();

    while (true) {
      const dateStudy = current.toISOString().split("T")[0];

      if (daysSet.has(dateStudy)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const formatMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (selecFilter === "week") {
      updateWeekTotal();
      setTotalDays(calculateAccessed(last7Cards));
      setStreak(calculateStreak(cards));
    } else if (selecFilter === "month") {
      updateMonthTotal();
      setTotalDays(calculateAccessed(lastMonthCards));
      setStreak(calculateStreak(cards));
    } else if (selecFilter === "year") {
      updateYearTotal();
      setTotalDays(calculateAccessed(lastYearCards));
      setStreak(calculateStreak(cards));
    }
  }, [cards, selecFilter]);

  return (
    <div
      onMouseDown={(e) => handleClick(e)}
      className={`reportBody ${reportPage ? "activeReport" : ""}`}
    >
      <div ref={boxRef} className="reportContainer">
        <div className="reportRankCont">
          <button
            className={`reportRankButton ${!rankedDisplay ? "reportSelected" : ""}`}
            onClick={() => setRankedDisplay(false)}
          >
            Report
          </button>
          <button
            className={`reportRankButton ${rankedDisplay ? "rankingSelected" : ""}`}
            onClick={() => setRankedDisplay(true)}
          >
            Ranking
          </button>
        </div>
        <div
          className={`reportAllCont ${!rankedDisplay && reportPage ? "activeReport" : ""}`}
        >
          <div className={`reportTopCont`}>
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
                  onClick={() => {
                    setSelecFilter("week");
                    setSelecBar("This Week");
                  }}
                >
                  Week
                </button>
                <button
                  className={`reportFilterButt ${selecFilter === "month" ? "selecFilter" : ""} ${selecFilter !== "month" ? "hoverFilter" : ""}`}
                  onClick={() => {
                    setSelecFilter("month");
                    setSelecBar("This Month");
                  }}
                >
                  Month
                </button>
                <button
                  className={`reportFilterButt ${selecFilter === "year" ? "selecFilter" : ""} ${selecFilter !== "year" ? "hoverFilter" : ""}`}
                  onClick={() => {
                    setSelecFilter("year");
                    setSelecBar("This Year");
                  }}
                >
                  Year
                </button>
              </div>
              <div className="reportThisWeek">
                <button className="reportArrow">
                  <SlArrowLeft />
                </button>
                <div>{selecBar}</div>
                <button className="reportArrow">
                  <SlArrowRight />
                </button>
              </div>
            </div>
            <div> </div>
          </div>
        </div>
        <div
          className={`reportAllCont rankingCont ${rankedDisplay && reportPage ? "activeReport" : ""}`}
        >
          <div className="rankingTitle">Top Focused All Time</div>
          <div className="rankingLine"></div>
          <div className="rankUsersCont">
            {allUsers?.map((a, index) => {
              return (
                <div key={index} className="rankUserBox">
                  <div className="leftsideUser">
                    <div className="numberUserRank">{index + 1}</div>
                    <img
                      className="rankUserPhoto"
                      src={a.photo ? a.photo : userPhoto}
                    />
                    <div>{a.name}</div>
                  </div>
                  <div className="rankUserLevel">
                    {" "}
                    LVL: {String(a.level).padStart(2, 0)}
                  </div>

                  <div className="rightSideUser">
                    <div>{formatMinutes(a.xp - 6)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
