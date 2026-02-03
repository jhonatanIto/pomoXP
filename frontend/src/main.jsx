import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./context/UserContext.jsx";
import "./styes/index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationProvider from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <NotificationProvider>
        <ToastContainer />
        <App />
      </NotificationProvider>
    </UserProvider>
  </BrowserRouter>,
);
