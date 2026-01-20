import "../styes/lvlBar.css";
import avatar from "../images/avatar.avif";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const LvlBar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="lvlBarContainer">
      <div className="lvlTitle">Level {user ? user.level : 1}</div>
      <div className="lvlBar"></div>

      <img className="avatar" src={avatar} />
    </div>
  );
};

export default LvlBar;
