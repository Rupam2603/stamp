import { pgTable, text, timestamp, integer, boolean, bigint, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // We can use UUID or standard strings
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  mobile: text("mobile"), // Added mobile number
  passwordHash: text("password_hash").notNull(),
  stamps: integer("stamps").default(0).notNull(),
  completedCards: integer("completed_cards").default(0).notNull(),
  lastStampTime: bigint("last_stamp_time", { mode: "number" }), // Store as unix epoch or timestamp
  stampHistory: jsonb("stamp_history").default([]).notNull(), // Array of unix timestamps for each stamp
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  currentChallenge: text("current_challenge"), // To temporarily store the authentication challenge
});

export const passkeys = pgTable("passkeys", {
  id: text("id").primaryKey(), // Base64URL encoded credential ID
  userId: text("user_id").notNull().references(() => users.id),
  publicKey: text("public_key").notNull(), // Base64URL encoded public key
  counter: bigint("counter", { mode: "number" }).notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"), // Comma separated list of transports
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
