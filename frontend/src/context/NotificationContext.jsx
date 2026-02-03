import { createContext } from "react";
import { toast, Bounce } from "react-toastify";

export const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const toastStyle = {
    position: "bottom-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
  const errorStyle = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  const errorNotification = (message) => toast.error(message, errorStyle);

  const successNotification = (message) => toast.success(message, toastStyle);

  return (
    <NotificationContext.Provider
      value={{ errorNotification, successNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
