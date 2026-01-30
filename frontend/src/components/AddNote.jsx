import { useContext, useEffect, useRef, useState } from "react";
import add from "../images/add.png";
import back from "../images/return.png";
import "../styes/addnotes.css";
import { UserContext } from "../context/UserContext";
import { getNotes } from "../utilities/fetchData";

const AddNote = (props) => {
  const {
    noteModal,
    setNoteModal,
    savedNote,
    setSavedNote,
    selectedDay,
    setSelectedDay,
  } = props;
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const boxRef = useRef();
  const savedRef = useRef();
  const [displayNote, setDisplayNote] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const { token, user, setNotes, notes } = useContext(UserContext);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

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
    try {
      if (!noteTitle.trim() || !noteContent.trim()) {
        alert("Must insert Title and  Note");
        return;
      }
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }
      closeNote();
      return data;
    } catch (error) {
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
    try {
      if (!id) return console.log("Id is missing");

      const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw Error(data?.message || "Request failed");

      console.log("Updated successfully");
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteNote = async () => {
    try {
      if (!id) return console.log("Id is missing");

      const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw Error(data?.message || "Request failed");

      console.log("Deleted successfully");
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user, token]);

  function dailyTotal(array) {
    const grouped = {};

    array.forEach((c) => {
      const date = c.created_at.slice(0, 10);

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(c);
    });

    return grouped;
  }

  const groupedCards = Object.entries(dailyTotal(notes));

  useEffect(() => {
    if (groupedCards.length === 0) return;

    const exists = groupedCards.some((g) => g[0] === selectedDay);

    if (!selectedDay || !exists) {
      const latest = groupedCards[0][0];
      setSelectedDay(latest);
    }
  }, [savedNote]);

  const filtered =
    groupedCards.find((n) => n[0] === selectedDay) || groupedCards[0];

  return (
    <div className="addNoteContainer">
      <div className="imgCont">
        <img onClick={() => setNoteModal(true)} className="addImg" src={add} />
        <div className="addAlert">Add new note</div>
      </div>

      <div
        onMouseDown={handleOverlayClick}
        style={{ display: noteModal ? "flex" : "none" }}
        className="noteModalBody"
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
                await postNotes();
                await loadNotes();
              }}
              className="noteButt"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
      <div
        style={{ display: savedNote ? "flex" : "none" }}
        onMouseDown={handleOverlayClick}
        className="savedNotesModal"
      >
        <div ref={savedRef} className="savedNotesCont">
          <div className="savedLeft">
            {groupedCards?.map((g) => {
              const date = g[0];
              return (
                <button
                  onClick={() => {
                    setDisplayNote(false);
                    setSelectedDay(date);
                  }}
                  className={`noteDatesButt ${selectedDay === date ? "selectedDate" : ""}`}
                  key={date}
                >
                  {date} : {g[1].length} notes
                </button>
              );
            })}
          </div>
          <div className="savedRight">
            <div style={{ display: displayNote ? "none" : "block" }}>
              {filtered?.[1]?.map((f) => {
                return (
                  <div
                    style={{ display: displayNote ? "none" : "flex" }}
                    onClick={() => {
                      setNoteTitle(f.title);
                      setNoteContent(f.content);
                      setDisplayNote(true);
                      setEdit(false);
                      setId(f.id);
                    }}
                    className="rightSideTitles"
                    key={f.id}
                  >
                    {f.title}
                  </div>
                );
              })}
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
                    await deleteNote();
                    await loadNotes();
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
                      await updateNotes();
                      await loadNotes();
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
