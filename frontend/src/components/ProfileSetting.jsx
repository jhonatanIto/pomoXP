import "../styes/profileSet.css";
import naruto from "../images/naruto.webp";
import edit from "../images/edit.png";
import x from "../images/x-button.png";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";

const ProfileSetting = (props) => {
  const { profileEdit, setProfileEdit } = props;
  const profileBoxRef = useRef(null);
  const { user, token, fetchUserData, setLoading } = useContext(UserContext);
  const { successNotification, errorNotification } =
    useContext(NotificationContext);
  const [editName, setEditName] = useState("");
  const [editUser, setEditUser] = useState(false);
  const [email, setEmail] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    setEditName(user?.name);
    setEmail(user?.email);
  }, [user]);

  useEffect(() => {
    if (editUser) {
      nameRef.current.focus();
    }
  }, [editUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileBoxRef.current && !profileBoxRef.current.contains(e.target)) {
        setProfileEdit(false);
        handleEmailClick(e);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmailClick = (e) => {
    if (!nameRef.current.contains(e.target)) {
      setEditUser(false);
    }
  };

  async function updateName() {
    try {
      if (editName.length > 20) {
        return alert("Name must be less than 20 characters");
      }
      setLoading(true);
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/users",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
          }),
        },
      );

      const data = await res.json();
      console.log(data);
      successNotification("Name updated!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      errorNotification("error");
    }
  }

  return (
    <div
      style={{ display: profileEdit ? "flex" : "none" }}
      className="profileSetBody"
    >
      <div
        onClick={(e) => handleEmailClick(e)}
        ref={profileBoxRef}
        className="profileBox"
      >
        <div className="profileHeader">
          <div className="acc">Account</div>
          <div onClick={() => setProfileEdit(false)} className="xCont">
            <img src={x} className="x" />
          </div>
        </div>
        <div className="profileCont">
          <img
            className="profileSetPicture"
            src={user?.photo ? user?.photo : naruto}
          />
          <div className="profileNameCont">
            <div className="nameContainer">
              <input
                ref={nameRef}
                disabled={!editUser}
                className="profileNameInput"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setEditUser(true);
                }}
                className="editName"
                src={edit}
              />
            </div>

            <input style={{ pointerEvents: "none" }} value={email} />
          </div>
        </div>

        <div className="currentPlan">
          Current plan:{" "}
          <p className="userPlan">
            {user?.plan !== "free" ? "Premium" : "free"}
          </p>{" "}
        </div>

        <div className="profileButtCont">
          <button
            onClick={() => {
              setProfileEdit(false);
            }}
            className="cancelProfile"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await updateName();
              await fetchUserData();
            }}
            className="saveProfile"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
