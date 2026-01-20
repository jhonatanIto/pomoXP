import { db } from "../db.js";
import { cards } from "../schema.js";

export const postCards = async (req, res) => {
  try {
    const { minutes, created_at } = req.body;

    if (typeof minutes !== "number" || minutes <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [created] = await db
      .insert(cards)
      .values({
        user_id: userId,
        minutes,
        created_at: created_at ? new Date(created_at) : undefined,
      })
      .returning();

    res.status(201).json({ message: "card added", card: created });
  } catch (error) {
    console.error("POST /cards ERROR", error);
    res.status(500).json({ message: error.message });
  }
};
