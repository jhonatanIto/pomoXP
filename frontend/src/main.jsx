import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styes/index.css";
import App from "./App.jsx";
import GoalProvider from "./context/Goal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoalProvider>
      <App />
    </GoalProvider>
  </StrictMode>
);
