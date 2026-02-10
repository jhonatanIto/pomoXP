import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Charts = (props) => {
  const { token } = useContext(UserContext);
  const [chartData, setChartData] = useState([]);
  const { selecFilter } = props;

  const fetchChartData = async () => {
    if (!selecFilter) return [];
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/cards/chart_data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type: selecFilter }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw Error(err?.message || "Request failed");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("chartData");
    if (savedData) setChartData(JSON.parse(savedData));

    const setData = async () => {
      const data = await fetchChartData();
      if (!data) return;

      setChartData(data);
      localStorage.setItem("chartData", JSON.stringify(data));
    };

    setData();
  }, [token]);

  return (
    <div className="chartCont">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_xp" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
