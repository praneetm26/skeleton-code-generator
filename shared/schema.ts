import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projectGenerationSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  language: z.enum(["java", "nodejs", "python"]),
  framework: z.string().min(1, "Framework is required"),
  database: z.enum(["postgresql", "mysql", "mongodb"]),
  generateTests: z.boolean(),
  testFramework: z.string().optional(),
});

export type ProjectGenerationRequest = z.infer<typeof projectGenerationSchema>;
