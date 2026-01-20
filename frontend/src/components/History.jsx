import "../styes/history.css";
import wood from "../images/wood.png";
import bronze from "../images/bronze2.png";
import silver from "../images/prata2.png";
import gold from "../images/ouro.png";
import master from "../images/master.png";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
const History = () => {
  const { user, token, setCards, cards } = useContext(UserContext);

  const getCards = async () => {
    try {
      if (!user) return;

      const res = await fetch("http://localhost:3000/api/cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error to get cards");

      const data = await res.json();
      setCards(data);
      return console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCards();
  }, [token]);

  function dailyTotal(cardss) {
    const grouped = {};

    cardss.forEach((c) => {
      const date = c.created_at.slice(0, 10);

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(c.minutes);
    });

    return grouped;
  }

  function medals(minutes) {
    if (minutes <= 10) return wood;
    if (minutes <= 30) return bronze;
    if (minutes <= 60) return silver;
    if (minutes <= 90) return gold;
    if (minutes > 90) return master;
    return wood;
  }

  const groupedCards = dailyTotal(cards);

  return (
    <div className="historyContainer">
      {user
        ? Object.entries(groupedCards).map(([date, minutesList]) => (
            <div className="historyCard" key={date}>
              <div className="historyCardDate">{date}</div>
              <div className="flex">
                {minutesList.map((min, index) => (
                  <img key={index} className="medals" src={medals(min)} />
                ))}
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};

export default History;
