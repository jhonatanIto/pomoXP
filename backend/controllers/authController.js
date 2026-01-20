import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const authUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password too short" });
    }

    // verify if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
