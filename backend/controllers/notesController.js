import { eq, desc, gte, and } from "drizzle-orm";
import { db } from "../db.js";
import { notes, users } from "../schema.js";

export const getNotes = async (req, res) => {
  try {
    const range = req.query.range || "week";

    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!["week", "month", "year"].includes(range)) {
      return res.status(400).json({
        message: "Invalid range. Use week, month, or year",
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    const isFree = user.plan === "free";

    if (isFree && range !== "week") {
      return res.status(403).json({
        message: "Upgrade to premium to access month/year notes",
      });
    }

    const now = new Date();
    let startDate = new Date();

    if (range === "week") {
      startDate.setDate(now.getDate() - 7);
    }

    if (range === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    if (range === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const userNotes = await db
      .select()
      .from(notes)
      .where(and(eq(notes.user_id, userId), gte(notes.created_at, startDate)))
      .orderBy(desc(notes.created_at));

    return res.json({
      range,
      count: userNotes.length,
      notes: userNotes,
    });
  } catch (error) {
    console.error("GET /notes error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postNotes = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content || !title)
      return res.status(400).json({ message: "Title or content missing" });

    const values = { user_id: userId, content, title };

    const [note] = await db.insert(notes).values(values).returning();

    res.status(201).json({ message: "Note added", note });
  } catch (error) {
    console.error("POST /notes error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
