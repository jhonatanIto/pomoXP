import { eq, desc, gte, lte } from "drizzle-orm";
import { notes } from "../schema.js";
import { db } from "../db.js";

export const getNotes = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const data = await db
      .select({
        id: notes.id,
        content: notes.content,
        created_at: notes.created_at,
      })
      .from(notes)
      .where(
        eq(notes.user_id, req.userId),
        gte(notes.created_at, startDate),
        lte(notes.created_at, endDate),
      )
      .orderBy(desc(notes.created_at));

    res.status(200).json(data);
  } catch (error) {
    console.error("GET /notes error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postNotes = async (req, res) => {
  try {
    const { content, created_at } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content)
      return res.status(400).json({ message: "Note content missing" });

    const values = { user_id: userId, content };
    if (created_at) values.created_at = created_at;

    const [note] = await db.insert(notes).values(values).returning();

    res.status(201).json({ message: "Note added", note });
  } catch (error) {
    console.error("POST /notes error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
