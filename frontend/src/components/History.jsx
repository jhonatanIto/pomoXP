import "../styes/history.css";
import wood from "../images/wood.png";
import bronze from "../images/bronze2.png";
import silver from "../images/prata2.png";
import gold from "../images/ouro.png";
import master from "../images/master.png";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { getCards } from "../utilities/fetchData.js";

const History = () => {
  const { user, token, setCards, cards } = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    const loadCards = async () => {
      try {
        const data = await getCards(token);
        setCards(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadCards();
  }, [user]);

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
        ? Object.entries(groupedCards).map((groupedCar) => {
            const date = groupedCar[0];
            const minutesList = groupedCar[1];

            return (
              <div className="historyCard" key={date}>
                <div className="historyCardDate">{date}</div>
                <div className="flex">
                  {minutesList.map((min, index) => (
                    <img key={index} className="medals" src={medals(min)} />
                  ))}
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
};

export default History;
