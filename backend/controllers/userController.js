import { db } from "../db.js";
import { users } from "../schema.js";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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

export const allUsers = async (req, res) => {
  try {
    const usersData = await db
      .select({
        name: users.name,
        level: users.level,
        xp: users.xp,
        photo: users.photo,
      })
      .from(users)
      .orderBy(desc(users.xp));

    if (usersData.length === 0)
      return res.status(404).json({ message: "No users found" });

    res.status(200).json({ message: "users data", users: usersData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
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

export const deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    await db.delete(users).where(eq(users.id, userId));

    return res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.error("DELETE/ user data error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
