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

export const updateNotes = async (req, res) => {
  try {
    const userId = req.userId;

    const { id } = req.params;

    const { title, content } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Note id is required" });
    if (!title && !content)
      return res.status(400).json({ message: "Nothing to update" });
    const [updatedNote] = await db
      .update(notes)
      .set({
        ...(title && { title }),
        ...(content && { content }),
      })
      .where(and(eq(notes.id, id), eq(notes.user_id, userId)))
      .returning();

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (err) {
    console.error("PUT/ note error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Note id is required" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [deletedNote] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.user_id, userId)))
      .returning();

    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully", deletedNote });
  } catch (error) {
    console.error("DELETE/ note error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
