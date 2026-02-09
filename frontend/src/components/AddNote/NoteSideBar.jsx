import { useContext, useState } from "react";
import { groupByDay, groupByMonth } from "./utils";
import lock from "../../images/lock.png";
import { UserContext } from "../../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const NoteSideBar = (props) => {
  const {
    setSelecYear,
    setSelecMonth,
    setDisplayNote,
    setSelectedDay,
    selecYear,
    selecMonth,
    selectedDay,
    months,
    years,
    recent,
    closeNote,
  } = props;
  const [viewMode, setViewMode] = useState("recent");
  const { user, notes } = useContext(UserContext);

  const freeUser = user?.plan === "free" || !user ? true : false;

  return (
    <div className="savedLeft">
      <div className="filterButtCont">
        <IoMdArrowRoundBack className="notesBack" onClick={closeNote} />
        <button
          onClick={() => {
            setViewMode("recent");
            setSelecMonth(null);
            setSelectedDay(recent[0][0]);
          }}
          className={`filterButt ${viewMode === "recent" ? "selecFilter" : ""}`}
        >
          Recent
        </button>

        <button
          onClick={() => {
            if (!freeUser) {
              setViewMode("months");
              setSelectedDay(null);
              setSelecMonth(months[0][0]);
            } else {
              alert("Upgrade to Premium to access");
            }
          }}
          className={`filterButt ${viewMode === "months" ? "selecFilter" : ""}`}
        >
          Month
          <div
            style={{ display: freeUser ? "flex" : "none" }}
            className="blockFilterButt"
          >
            <img className="lockFilt" src={lock} />
          </div>
        </button>

        <button
          onClick={() => {
            if (!freeUser) {
              setViewMode("years");
              setSelecMonth(null);
              setSelectedDay(null);
              setSelecYear(years[0][0]);
            } else {
              alert("Upgrade to Premium to access");
            }
          }}
          className={`filterButt ${viewMode === "years" ? "selecFilter" : ""}`}
        >
          Year
          <div
            style={{ display: freeUser ? "flex" : "none" }}
            className="blockFilterButt"
          >
            <img className="lockFilt" src={lock} />
          </div>
        </button>
      </div>

      <div className="sideButtCont">
        {viewMode === "years" &&
          years.map(([year, yearNote]) => (
            <button
              key={year}
              className={`noteDatesButt ${selecYear === year ? "selectedDate" : ""}`}
              onClick={() => {
                setSelecYear(year);
                setSelecMonth(null);
                setSelectedDay(null);
                setDisplayNote(false);
              }}
            >
              {year}: {yearNote.length} notes
            </button>
          ))}

        {viewMode === "months" && (
          <>
            {!selecYear && (
              <p style={{ padding: "10px", fontSize: "14px" }}>
                Select a year first
              </p>
            )}

            {months.map(([month, monthNotes]) => (
              <button
                key={month}
                className={`noteDatesButt ${selecMonth === month ? "selectedDate" : ""}`}
                onClick={() => {
                  setSelecMonth(month);

                  const yearNotes =
                    notes?.filter(
                      (note) =>
                        new Date(note.created_at).getFullYear() ===
                        Number(selecYear),
                    ) || [];

                  const monthGrouped = groupByMonth(yearNotes);

                  const selectedMonthNotes = monthGrouped[month] || [];

                  const monthDays = Object.entries(
                    groupByDay(selectedMonthNotes),
                  );

                  if (monthDays.length > 0) {
                    setSelectedDay(null);
                  }
                  setDisplayNote(false);
                }}
              >
                {month} : {monthNotes.length} notes
              </button>
            ))}
          </>
        )}

        {viewMode === "recent" &&
          recent?.map((g, index) => {
            const date = g[0];
            const locked = user?.plan === "free" && index >= 7;

            return (
              <button
                onClick={() => {
                  setDisplayNote(false);
                  setSelectedDay(date);
                  setSelecYear(date.slice(0, 4));
                }}
                className={`noteDatesButt ${selectedDay === date ? "selectedDate" : ""}`}
                key={date}
              >
                {date} : {g[1].length} notes
                {locked && (
                  <div
                    style={{
                      display: locked ? "flex" : "none",
                    }}
                    className="blockedButt"
                  >
                    <img className="lock" src={lock} />
                  </div>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default NoteSideBar;
