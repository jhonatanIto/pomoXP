import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

export const userData = async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        photo: users.photo,
        xp: users.xp,
        level: users.level,
        plan: users.plan,
      })
      .from(users)
      .where(eq(users.id, req.userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("GET/ user data error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, photo } = req.body;
    const userId = req.userId;

    if (!name && !photo) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(photo && { photo }),
      })
      .where(eq(users.id, userId))
      .returning();

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error("POST/ user data error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
