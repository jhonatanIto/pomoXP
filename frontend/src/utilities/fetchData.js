export const getCards = async (token) => {
  const res = await fetch("http://localhost:3000/api/cards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error to get cards");

  return res.json();
};

export const getNotes = async (token, range) => {
  const url = range
    ? `http://localhost:3000/api/notes?range=${range}`
    : `http://localhost:3000/api/notes`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error to get notes");

  return res.json();
};

export const refreshUser = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const res = await fetch("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to refresh user");

    return res.json();
  } catch (err) {
    console.log(err);
  }
};
