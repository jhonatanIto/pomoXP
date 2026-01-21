import { sql, eq } from "drizzle-orm";
import { db } from "../db.js";
import { cards, users } from "../schema.js";
import { convertToLevel } from "../utils/level.js";

export const postCards = async (req, res) => {
  try {
    const { minutes, created_at } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof minutes !== "number" || minutes <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const result = await db.transaction(async (trx) => {
      const [user] = await trx
        .select({ xp: users.xp })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("User not found");
      }

      const [card] = await trx
        .insert(cards)
        .values({
          user_id: userId,
          minutes,
          created_at: created_at ? new Date(created_at) : undefined,
        })
        .returning();

      await trx
        .update(users)
        .set({
          xp: sql`${users.xp} + ${minutes}`,
        })
        .where(eq(users.id, userId));

      const [updatedUser] = await trx
        .select({ xp: users.xp })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const newLevel = convertToLevel(updatedUser.xp);

      await trx
        .update(users)
        .set({
          level: newLevel,
        })
        .where(eq(users.id, userId));

      return {
        card,
        newXp: updatedUser.xp,
        newLevel,
      };
    });
    return res.status(201).json({
      message: "card added",
      card: result.card,
      xp: result.newXp,
      level: result.newLevel,
    });
  } catch (err) {
    console.error("POST /cards ERROR", err);
    return res.status(500).json({ message: err.message });
  }
};
