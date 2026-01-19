import { db } from "../db.js";
import { cards } from "../schema.js";
import { eq, sql } from "drizzle-orm";

export const postCards = async (req, res) => {
  try {
    const goalColumn = {
      10: "min10",
      15: "min15",
      20: "min20",
      30: "min30",
      40: "min40",
      50: "min50",
      60: "min60",
      90: "min90",
      120: "min120",
    };
    const { goal, times } = req.body;
    const column = goalColumn[goal];
    if (!column || typeof times !== "number" || times <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const today = new Date().toISOString().slice(0, 10);

    const [existingCard] = await db
      .select()
      .from(cards)
      .where(eq(cards.created_at, today));

    if (existingCard) {
      const [updated] = await db
        .update(cards)
        .set({
          [column]: sql`${cards[column]} + ${times} `,
        })
        .where(eq(cards.created_at, today))
        .returning();

      return res.json({ message: "card updated", card: updated });
    }

    const values = { created_at: today };
    values[column] = times;

    const [created] = await db.insert(cards).values(values).returning();

    res.status(201).json({ message: "card added", card: created });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
