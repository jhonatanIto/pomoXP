import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://pomoxp-production.up.railway.app/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const photo = profile.photos?.[0]?.value || null;
        const googleId = profile.id;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        let user;

        if (existingUser.length > 0) {
          user = existingUser[0];

          const [updatedUser] = await db
            .update(users)
            .set({ googleId, photo })
            .where(eq(users.id, user.id))
            .returning();

          user = updatedUser;
        } else {
          const [newUser] = await db
            .insert(users)
            .values({ name, email, googleId, photo })
            .returning();

          user = newUser;
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" },
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
