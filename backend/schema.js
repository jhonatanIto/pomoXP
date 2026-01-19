import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  created_at: date("created_at").defaultNow().notNull(),
  notes: text("notes"),
  min10: integer("min10").default(0).notNull(),
  min15: integer("min15").default(0).notNull(),
  min20: integer("min20").default(0).notNull(),
  min30: integer("min30").default(0).notNull(),
  min40: integer("min40").default(0).notNull(),
  min50: integer("min50").default(0).notNull(),
  min60: integer("min60").default(0).notNull(),
  min90: integer("min90").default(0).notNull(),
  min120: integer("min120").default(0).notNull(),
});
