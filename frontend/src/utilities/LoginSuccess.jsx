import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  useEffect(() => {
    const token = params.get("token");

    if (!token) return;

    fetch("https://pomoxp-production.up.railway.app/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        login(user, token);
        navigate("/");
      })
      .catch(() => navigate("/"));
  }, []);

  return <p>Loggin in with Google...</p>;
};

export default LoginSuccess;
