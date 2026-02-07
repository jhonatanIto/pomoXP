const today = new Date();

const last7Days = new Date();

last7Days.setDate(today.getDate() - 6);

export const calc7Cards = (cards) => {
  const last7Cards = cards?.filter((n) => new Date(n.created_at) >= last7Days);

  const last7Total = last7Cards?.reduce(
    (acc, current) => acc + current.minutes,
    0,
  );

  return last7Total;
};

export const updateUser7Days = async (token, cards) => {
  const total = calc7Cards(cards);
  console.log(total);
  try {
    const res = await fetch(
      "https://pomoxp-production.up.railway.app/api/users",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ last7Days: total }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
