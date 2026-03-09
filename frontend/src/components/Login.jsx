import { useContext, useRef, useState } from "react";
import "../styes/login.css";
import { UserContext } from "../context/UserContext";
import google from "../images/google.png";
import { NotificationContext } from "../context/NotificationContext";

const Login = (props) => {
  const { displayLogin, setDisplayLogin, signIn, setSignIn } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const boxRef = useRef();

  const { login, setLoading } = useContext(UserContext);
  const { successNotification, errorNotification } =
    useContext(NotificationContext);

  const handleOverlayClick = (e) => {
    if (!boxRef.current.contains(e.target)) {
      setDisplayLogin("none");
    }
  };

  const toggleMode = () => {
    setSignIn(!signIn);
    setName("");
    setEmail("");
    setConfirmEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = signIn
      ? "https://pomoxp-production.up.railway.app/api/auth/login"
      : "https://pomoxp-production.up.railway.app/api/auth/register";

    const body = signIn ? { email, password } : { name, email, password };

    if (!signIn) {
      if (!name || !email || !password) {
        errorNotification("Fill all fields");
        return;
      }
      if (confirmEmail !== email) {
        errorNotification("Emails do not match");
        return;
      }
      if (password !== confirmPassword) {
        errorNotification("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        errorNotification("Password must have at least 8 digits");
        return;
      }
      if (name.length > 20) {
        errorNotification("Name must have less than 20 digits");
        return;
      }
    }

    try {
      setDisplayLogin("none");
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.message);
        return;
      }

      if (signIn) {
        login(data.user, data.token);
        setLoading(false);
        return;
      }

      successNotification("Account created!");
      toggleMode();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://pomoxp-production.up.railway.app/auth/google";
  };

  return (
    <div
      onMouseDown={handleOverlayClick}
      style={{ display: displayLogin }}
      className="loginBody"
    >
      <form ref={boxRef} className="loginBox" onSubmit={(e) => handleSubmit(e)}>
        <div className="loginTitle">
          {signIn === false ? "Sign Up" : "Sign In"}
        </div>
        <div className="loginInputContainer">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="googleButt"
          >
            {" "}
            <img className="google" src={google} />
            {signIn === true ? "Login with Google" : "Sign up with Google"}
          </button>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            style={{ display: signIn ? "none" : "flex" }}
            name="name"
            placeholder="Username"
            type="text"
          />
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            placeholder="Email"
            type="email"
          />
          <input
            value={confirmEmail}
            onChange={(e) => {
              setConfirmEmail(e.target.value);
            }}
            style={{ display: signIn ? "none" : "flex" }}
            placeholder="Confirm Email"
            type="email"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
          />
          <input
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            style={{ display: signIn ? "none" : "flex" }}
            placeholder="Confirm Password"
            type="password"
          />
          <button className="loginButt" type="submit">
            Submit
          </button>
          <div className="loginWords">
            {signIn ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => toggleMode()}>
              {signIn === false ? "Sign In" : "Sign Up"}{" "}
            </span>{" "}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
