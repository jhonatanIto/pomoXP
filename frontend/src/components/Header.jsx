import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import userPic from "../images/userB.png";
import userW from "../images/userW.png";
import crownPic from "../images/crown.png";
import logoutPic from "../images/logout.png";
import deletePic from "../images/delete.png";

const Header = (props) => {
  const {
    setDisplayModal,
    setDisplayLogin,
    setSignIn,
    setProfileEdit,
    setSavedNote,
    setNoteModal,
    setSelectedDay,
  } = props;
  const { user, logout, notes } = useContext(UserContext);
  const [profileMenu, setProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
              if (notes.length <= 0) {
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
        <button>
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
        <button>
          {" "}
          <img className="menuPic" src={deletePic} />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Header;
