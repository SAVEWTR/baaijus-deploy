import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Baaijuses (bias profiles) table
export const baaijuses = pgTable("baaijuses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  sensitivity: varchar("sensitivity").notNull().default("balanced"), // permissive, balanced, strict
  keywords: text("keywords"), // comma-separated keywords
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(false),
  accuracyRate: real("accuracy_rate").default(0),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Filter results table
export const filterResults = pgTable("filter_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  baaijusId: integer("baaijus_id").notNull().references(() => baaijuses.id),
  content: text("content").notNull(),
  isBlocked: boolean("is_blocked").notNull(),
  confidence: real("confidence").notNull(),
  analysis: text("analysis"),
  matchedKeywords: text("matched_keywords"), // JSON array as text
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  baaijuses: many(baaijuses),
  filterResults: many(filterResults),
}));

export const baaijusesRelations = relations(baaijuses, ({ one, many }) => ({
  user: one(users, {
    fields: [baaijuses.userId],
    references: [users.id],
  }),
  filterResults: many(filterResults),
}));

export const filterResultsRelations = relations(filterResults, ({ one }) => ({
  user: one(users, {
    fields: [filterResults.userId],
    references: [users.id],
  }),
  baaijus: one(baaijuses, {
    fields: [filterResults.baaijusId],
    references: [baaijuses.id],
  }),
}));

// Insert schemas
export const insertBaaijusSchema = createInsertSchema(baaijuses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  accuracyRate: true,
  usageCount: true,
});

export const insertFilterResultSchema = createInsertSchema(filterResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertBaaijus = z.infer<typeof insertBaaijusSchema>;
export type Baaijus = typeof baaijuses.$inferSelect;
export type InsertFilterResult = z.infer<typeof insertFilterResultSchema>;
export type FilterResult = typeof filterResults.$inferSelect;
