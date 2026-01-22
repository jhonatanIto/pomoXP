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
        xp: users.xp,
        level: users.level,
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
