import { eq, desc } from "drizzle-orm";
import { cards } from "../schema.js";
import { db } from "../db.js";

export const getCard = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = await db
      .select({
        id: cards.id,
        minutes: cards.minutes,
        created_at: cards.created_at,
      })
      .from(cards)
      .where(eq(cards.user_id, req.userId))
      .orderBy(desc(cards.created_at))
      .limit(100);

    res.status(200).json(data);
  } catch (err) {
    console.error("GET /cards error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
