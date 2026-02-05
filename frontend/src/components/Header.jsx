import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import userPic from "../images/userB.png";
import userW from "../images/userW.png";
import crownPic from "../images/crown.png";
import logoutPic from "../images/logout.png";
import deletePic from "../images/delete.png";
import { NotificationContext } from "../context/NotificationContext";

const Header = (props) => {
  const {
    setDisplayModal,
    setDisplayLogin,
    setSignIn,
    setProfileEdit,
    setSavedNote,
    setNoteModal,
    setSelectedDay,
    setPlansPage,
    setReportPage,
  } = props;
  const { user, logout, notes, visitor } = useContext(UserContext);
  const [profileMenu, setProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="middleHeader">
        <div className="headerTitle">PomoXP</div>
        <div className="buttContainer">
          <button
            onClick={() => {
              if (notes.length <= 0 && visitor.notes.length <= 0) {
                setNoteModal(true);
                return;
              }
              setSavedNote(true);
              const today = new Date().toISOString().slice(0, 10);
              setSelectedDay(today);
            }}
            className="headerButts"
          >
            Notes
          </button>
          <button onClick={() => setReportPage(true)} className="headerButts">
            Report
          </button>
          <button
            className="headerButts"
            onClick={() => setDisplayModal("flex")}
          >
            Setting
          </button>
          <button style={{ display: user ? "flex" : "none" }}>
            <img
              ref={buttonRef}
              onClick={() => setProfileMenu((prev) => !prev)}
              className="profilePicture"
              src={user?.photo ? user.photo : userW}
            />
          </button>
          <button
            style={{ display: user ? "none" : "flex" }}
            className="headerButts"
            onClick={() => {
              setDisplayLogin("flex");
              setSignIn(true);
            }}
          >
            Sign In
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        style={{ display: profileMenu ? "flex" : "none" }}
        className="profileMenu"
      >
        <button
          onClick={() => {
            setProfileEdit(true);
            setProfileMenu(false);
          }}
        >
          {" "}
          <img className="menuPic" src={userPic} />
          Account
        </button>
        <button
          onClick={() => {
            setPlansPage(true);
            setProfileMenu(false);
          }}
        >
          {" "}
          <img className="menuPic" src={crownPic} />
          Premium
        </button>
        <button
          onClick={() => {
            logout();
            setProfileMenu(false);
          }}
        >
          {" "}
          <img className="menuPic" src={logoutPic} />
          Logout
        </button>
        <button
          onClick={() => {
            setDeleteModal(true);
            setProfileMenu(false);
          }}
        >
          {" "}
          <img className="menuPic" src={deletePic} />
          Delete Account
        </button>
      </div>
      <DeleteUser deleteModal={deleteModal} setDeleteModal={setDeleteModal} />
    </div>
  );
};

export default Header;

const DeleteUser = (props) => {
  const { deleteModal, setDeleteModal } = props;
  const boxRef = useRef();

  const [password, setPassword] = useState();
  const { token, logout, setLoading } = useContext(UserContext);
  const { errorNotification, successNotification } =
    useContext(NotificationContext);

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setPassword("");
  };

  const handleOverClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      closeDeleteModal();
    }
  };

  const deleteUser = async () => {
    if (!password) return errorNotification("Password needed");
    setLoading(true);
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/users",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: password,
          }),
        },
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }

      successNotification("Account deleted");

      console.log(data);

      closeDeleteModal();
      logout();
      return data;
    } catch (error) {
      console.error(error);
      errorNotification("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onMouseDown={(e) => handleOverClick(e)}
      className={`deleteUserBody ${deleteModal ? "active" : ""}`}
    >
      <div ref={boxRef} className="deleteUserCont">
        <div className="deleteText">Digit your password to delete</div>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="deleteInput"
          type="password"
          placeholder="password"
        />
        <div className="deleteButtCon">
          <button className="deleteCancelButt" onClick={closeDeleteModal}>
            cancel
          </button>
          <button className="deleteUserButt" onClick={deleteUser}>
            confirm
          </button>
        </div>
      </div>
    </div>
  );
};
