import "../styes/lvlBar.css";
import avatar from "../images/avatar.avif";

const LvlBar = () => {
  return (
    <div className="lvlBarContainer">
      <div className="lvlTitle">Level 23</div>
      <div className="lvlBar"></div>
      <img className="avatar" src={avatar} />
    </div>
  );
};

export default LvlBar;
