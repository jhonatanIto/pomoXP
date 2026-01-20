import {
  timestamp,
  pgTable,
  serial,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  minutes: integer("minutes").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  notes: text("notes"),
});
