import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db.js";
import { cards, users } from "../schema.js";
import { convertToLevel } from "../utils/level.js";

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

    const startTime = new Date(created_at);
    const endTime = new Date(startTime.getTime() + minutes * 60000);
    const now = new Date();
    const tolerance = 5000;
    const maxBackTime = 24 * 60 * 60 * 1000;

    if (isNaN(startTime.getTime()))
      return res.status(400).json({ message: "What are you doing" });

    if (now.getTime() - startTime.getTime() > maxBackTime)
      return res.status(400).json({ message: "What are you doing" });

    if (now.getTime() + tolerance < endTime.getTime())
      return res.status(400).json({ message: "What are you doing" });

    if (minutes > 720)
      return res.status(400).json({ message: "What are you doing" });

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

export const chart_data = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Unathorized" });

    const { type } = req.body;
    if (!type) return res.status(400).json({ message: "type not specified" });

    const days = type === "week" ? 7 : type === "month" ? 30 : 365;

    const cardss = await db
      .select()
      .from(cards)
      .where(eq(cards.user_id, userId));

    let data = {};

    const lastDays = () => {
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const t = new Date(today);
        t.setDate(today.getDate() - i);

        const [y, m, d] = t.toLocaleDateString("sv-SE").split("-");
        const date = type !== "year" ? `${m}-${d}` : `${y}-${m}`;

        if (!data[date]) {
          data[date] = [];
        }
      }
    };

    lastDays();

    cardss.forEach((c) => {
      const [y, m, d] = c.created_at.toLocaleDateString("sv-SE").split("-");
      const converted = type !== "year" ? `${m}-${d}` : `${y}-${m}`;

      if (data[converted]) {
        data[converted].push(c.minutes);
      }
    });

    const chartData = Object.entries(data)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((d) => {
        const totalXp = d[1].reduce((acc, c) => {
          return acc + c;
        }, 0);

        return { date: d[0], total_xp: totalXp };
      });

    res.status(200).json({ chartData, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
