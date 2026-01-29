import "../styes/profileSet.css";
import naruto from "../images/naruto.webp";
import edit from "../images/edit.png";
import x from "../images/x-button.png";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";

const ProfileSetting = (props) => {
  const { profileEdit, setProfileEdit } = props;
  const profileBoxRef = useRef(null);
  const { user, token, fetchUserData } = useContext(UserContext);
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("");

  useEffect(() => {
    if (!user) return;

    if (user?.name) {
      setEditName(user?.name);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileBoxRef.current && !profileBoxRef.current.contains(e.target)) {
        setProfileEdit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function updateName() {
    try {
      if (editName.length > 20) {
        return alert("Name must be less than 20 characters");
      }
      const res = await fetch("http://localhost:3000/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{ display: profileEdit ? "flex" : "none" }}
      className="profileSetBody"
    >
      <div ref={profileBoxRef} className="profileBox">
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
            alt=""
          />
          <div className="profileNameCont">
            <input
              className="profileNameInput"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="emailCont">
              jhonitojp@gmail.com <img className="editEmail" src={edit} />
            </div>
          </div>
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
              setProfileEdit(false);
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
