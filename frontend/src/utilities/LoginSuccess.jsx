import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, setLoading } = useContext(UserContext);

  useEffect(() => {
    const token = params.get("token");
    setLoading(true);
    if (!token) {
      navigate("/");
      setLoading(false);
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
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [params, login, navigate]);

  return <p></p>;
};

export default LoginSuccess;
