import { eq, desc } from "drizzle-orm";
import { cards } from "../schema.js";
import { db } from "../db.js";

export const getCard = async (req, res) => {
  try {
    const data = await db
      .select()
      .from(cards)
      .where(eq(cards.user_id, req.userId))
      .orderBy(desc(cards.created_at));

    res.status(200).json(data);
  } catch (err) {
    console.error("GET /cards error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
