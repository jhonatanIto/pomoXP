import { useContext, useEffect, useRef, useState } from "react";
import add from "../images/add.png";
import back from "../images/return.png";
import lock from "../images/lock.png";
import "../styes/addnotes.css";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";
import { getNotes } from "../utilities/fetchData";
import { groupByDay, groupByMonth, groupByYear } from "./AddNote/utils";
import NoteSideBar from "./AddNote/NoteSideBar";
import { nanoid } from "nanoid";

const AddNote = (props) => {
  const {
    noteModal,
    setNoteModal,
    savedNote,
    setSavedNote,
    selectedDay,
    setSelectedDay,
  } = props;

  const { successNotification, errorNotification } =
    useContext(NotificationContext);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const boxRef = useRef();
  const savedRef = useRef();
  const [displayNote, setDisplayNote] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const [selecYear, setSelecYear] = useState(year);
  const [selecMonth, setSelecMonth] = useState("");

  const { token, user, setNotes, notes, setVisitor, visitor, setLoading } =
    useContext(UserContext);
  const visitorNoteId = nanoid();

  const closeNote = () => {
    setNoteModal(false);
    setNoteTitle("");
    setNoteContent("");
    setDisplayNote(false);
    setSavedNote(false);
    setEdit(false);
    setId("");
  };
  const handleOverlayClick = (e) => {
    if (
      !boxRef.current.contains(e.target) &&
      !savedRef.current.contains(e.target)
    ) {
      closeNote();
    }
  };

  const postNotes = async () => {
    setLoading(true);
    try {
      if (!noteTitle.trim() || !noteContent.trim()) {
        setLoading(false);
        errorNotification("Must insert Title and Note");
        return;
      }
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
            created_at: new Date().toISOString(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }
      setLoading(false);
      closeNote();
      successNotification("Note Added!");
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };
  const loadNotes = async () => {
    try {
      if (!user || !token) return;

      const data = await getNotes(token);

      setNotes(data.notes);
    } catch (error) {
      console.error(error.message);
    }
  };
  const updateNotes = async () => {
    setLoading(true);
    try {
      if (!id) return console.log("Id is missing");

      const res = await fetch(
        `https://pomoxp-production.up.railway.app/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw Error(data?.message || "Request failed");

      setLoading(false);
      successNotification("Note Updated!");
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  const deleteNote = async () => {
    setLoading(true);
    try {
      if (!id) return console.log("Id is missing");

      const res = await fetch(
        `https://pomoxp-production.up.railway.app/api/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (!res.ok) throw Error(data?.message || "Request failed");

      successNotification("Note Deleted");
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user, token]);

  const currNotes = user ? notes : visitor.notes;

  const years = Object.entries(groupByYear(currNotes || []));

  const months =
    selecYear && groupByYear(currNotes || [])[selecYear]
      ? Object.entries(groupByMonth(groupByYear(currNotes)[selecYear]))
      : [];

  const yearNotes =
    currNotes?.filter(
      (note) => new Date(note.created_at).getFullYear() === Number(selecYear),
    ) || [];

  const monthNumber = selecMonth ? Number(selecMonth.split("-")[1]) : null;

  const monthNotes =
    monthNumber != null
      ? yearNotes.filter(
          (note) => new Date(note.created_at).getMonth() + 1 === monthNumber,
        )
      : yearNotes;

  const groupedByDay = groupByDay(monthNotes);
  const groupedCards = Object.entries(groupedByDay);

  const filteredNotes = selectedDay
    ? groupedCards.find(([date]) => date === selectedDay)?.[1] || []
    : monthNotes;

  const recent = Object.entries(groupByDay(currNotes));

  const selecIndex = recent.findIndex((g) => g[0] === selectedDay);
  const blocked =
    (user?.plan === "free" && selecIndex >= 6) || (!user && selecIndex >= 6);

  useEffect(() => {
    if (groupedCards.length === 0) return;

    const exists = groupedCards.some((g) => g[0] === selectedDay);

    if (!selectedDay || !exists) {
      const latest = groupedCards[0][0];
      setSelectedDay(latest);
    }
  }, [savedNote]);

  return (
    <div className="addNoteContainer">
      <div className="imgCont">
        <img onClick={() => setNoteModal(true)} className="addImg" src={add} />
        <div className="addAlert">Add new note</div>
      </div>

      <div
        onMouseDown={handleOverlayClick}
        className={`noteModalBody ${noteModal ? "active" : ""}`}
      >
        <div ref={boxRef} className="noteBox">
          <div className="noteDate">{formattedDate}</div>
          <input
            onChange={(e) => {
              setNoteTitle(e.target.value);
            }}
            className="noteTitle"
            type="text"
            value={noteTitle}
            placeholder="Title"
          />
          <textarea
            placeholder="Write your note..."
            onChange={(e) => {
              setNoteContent(e.target.value);
            }}
            value={noteContent}
            name="textarea"
          ></textarea>
          <div className="noteButtCont">
            <button onClick={closeNote} className="noteCancel">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (user) {
                  await postNotes();
                  await loadNotes();
                } else {
                  setVisitor((prev) => {
                    return {
                      ...prev,
                      notes: [
                        ...prev.notes,
                        {
                          title: noteTitle,
                          content: noteContent,
                          created_at: new Date().toISOString(),
                          id: visitorNoteId,
                        },
                      ],
                    };
                  });
                  closeNote();
                }
              }}
              className="noteButt"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
      <div
        onMouseDown={handleOverlayClick}
        className={`savedNotesModal ${savedNote ? "active" : ""}`}
      >
        <div ref={savedRef} className="savedNotesCont">
          <NoteSideBar
            setSelecYear={setSelecYear}
            setSelecMonth={setSelecMonth}
            setDisplayNote={setDisplayNote}
            setSelectedDay={setSelectedDay}
            selecYear={selecYear}
            selecMonth={selecMonth}
            selectedDay={selectedDay}
            groupedCards={groupedCards}
            months={months}
            years={years}
            recent={recent}
            blocked={blocked}
          />

          <div className="savedRight">
            <div style={{ display: displayNote ? "none" : "block" }}>
              {filteredNotes.map((f) => (
                <div
                  onClick={() => {
                    if (!blocked) {
                      setNoteTitle(f.title);
                      setNoteContent(f.content);
                      setDisplayNote(true);
                      setEdit(false);
                      setId(f.id);
                    } else {
                      alert("upgrade to premium user first");
                    }
                  }}
                  className="rightSideTitles"
                  key={f.id}
                >
                  {f.title}
                  <div
                    style={{ display: blocked ? "flex" : "none" }}
                    className="blockedButt"
                  >
                    <img className="lock" src={lock} />
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{ display: displayNote ? "flex" : "none" }}
              className="selectedNote"
            >
              <img
                onClick={() => {
                  setEdit(false);
                  setDisplayNote(false);
                }}
                className="back"
                src={back}
              />
              <input
                style={{ pointerEvents: edit ? "auto" : "none" }}
                value={noteTitle}
                className={`noteTitle ${edit ? "editTitle" : ""}`}
                onChange={(e) => {
                  setNoteTitle(e.target.value);
                }}
              />
              <textarea
                style={{ pointerEvents: edit ? "auto" : "none" }}
                className={`contenttt ${edit ? "editAll" : ""}`}
                name="savedArea"
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                }}
              ></textarea>
              <div className="noteButtCont">
                <button
                  style={{ display: edit ? "block" : "none" }}
                  className="noteCancel"
                  onClick={async () => {
                    if (user) {
                      await deleteNote();
                      await loadNotes();
                    } else {
                      setVisitor((prev) => {
                        const updatedNotes = prev.notes.filter(
                          (n) => n.id !== id,
                        );

                        return { ...prev, notes: updatedNotes };
                      });
                    }

                    setNoteModal(false);
                    setNoteTitle("");
                    setNoteContent("");
                    setDisplayNote(false);
                    setEdit(false);
                    setId("");
                  }}
                >
                  delete
                </button>
                <button
                  onClick={async () => {
                    if (!edit) {
                      setEdit(true);
                    } else {
                      if (user) {
                        await updateNotes();
                        await loadNotes();
                      } else {
                        setVisitor((prev) => {
                          const updateNotes = prev.notes.map((n) => {
                            if (n.id === id) {
                              return {
                                ...n,
                                title: noteTitle,
                                content: noteContent,
                              };
                            }
                            return n;
                          });
                          return { ...prev, notes: updateNotes };
                        });
                      }

                      setEdit(false);
                    }
                  }}
                  className="noteButt"
                >
                  {edit ? "save" : "edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
