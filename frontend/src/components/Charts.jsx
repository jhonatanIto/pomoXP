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

const Charts = () => {
  const { token } = useContext(UserContext);
  const [chartData, setChartData] = useState();

  const fetchChartData = async () => {
    try {
      const res = await fetch(
        "https://pomoxp-production.up.railway.app/api/cards/chart_data",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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

  console.log(chartData);

  return (
    <div>
      <ResponsiveContainer>
        <BarChart>
          <XAxis />
          <YAxis />
          <Tooltip />
          <Bar />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
