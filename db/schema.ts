import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // We can use UUID or standard strings
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  stamps: integer("stamps").default(0).notNull(),
  completedCards: integer("completed_cards").default(0).notNull(),
  lastStampTime: integer("last_stamp_time"), // Store as unix epoch or timestamp
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
