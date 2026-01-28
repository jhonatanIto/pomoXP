import {
  timestamp,
  pgTable,
  serial,
  text,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id"),
  photo: text("photo"),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cards = pgTable(
  "cards",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    minutes: integer("minutes").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("cards_user_id_idx").on(table.user_id)],
);

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),

    user_id: integer("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    content: text("content").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("notes_user_id_idx").on(t.user_id),
    index("notes_user_id_created_at_idx").on(t.user_id, t.created_at),
  ],
);
