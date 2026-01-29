import { useContext, useEffect, useRef, useState } from "react";
import add from "../images/add.png";
import "../styes/addnotes.css";
import { UserContext } from "../context/UserContext";
import { getNotes } from "../utilities/fetchData";

const AddNote = (props) => {
  const { noteModal, setNoteModal, savedNote, setSavedNote } = props;
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const boxRef = useRef();
  const savedRef = useRef();

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

    setSavedNote(false);
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

  useEffect(() => {
    if (!user) return;

    const loadNotes = async () => {
      try {
        const data = await getNotes(token);
        setNotes(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadNotes();
  }, [user]);

  // ja esta recebendo os notes com fetch setando no notes
  console.log(notes);

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
            <button onClick={postNotes} className="noteButt">
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
          <div className="savedLeft"></div>
          <div className="savedRight"></div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
