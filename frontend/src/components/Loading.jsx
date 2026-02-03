import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Loading = () => {
  const { loading } = useContext(UserContext);
  return (
    <div
      style={{ display: loading ? "flex" : "none" }}
      className="loadingContainer"
    >
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="2.5" className="circle" />
      </svg>
      <p className="loading">Loading...</p>
    </div>
  );
};

export default Loading;
