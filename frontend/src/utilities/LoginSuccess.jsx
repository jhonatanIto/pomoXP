import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("https://pomoxp-production.up.railway.app/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((user) => {
        login(user, token);
        navigate("/");
      })
      .catch(() => navigate("/"));
  }, [params, login, navigate]);

  return <p>Loggin in with Google...</p>;
};

export default LoginSuccess;
