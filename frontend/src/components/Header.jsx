import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = (props) => {
  const { setDisplayModal, setDisplayLogin } = props;
  const { user, logout } = useContext(UserContext);

  return (
    <div className="header">
      <div className="middleHeader">
        <div className="headerTitle">PomoXP</div>
        <div className="buttContainer">
          <button>Report</button>
          <button onClick={() => setDisplayModal("flex")}>Setting</button>
          <button style={{ display: user ? "flex" : "none" }}>
            {user ? user.name : ""}
          </button>
          <button
            onClick={() => {
              if (user) {
                logout();
                return;
              }
              setDisplayLogin("flex");
            }}
          >
            {user ? "Logout" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
