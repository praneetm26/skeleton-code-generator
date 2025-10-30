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
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Project name can only contain letters, numbers, hyphens, and underscores"
    ),
  language: z.enum(["java", "nodejs", "python"]),
  framework: z.string().min(1, "Framework is required"),
  database: z.enum(["postgresql", "mysql", "mongodb"]),
  generateTests: z.boolean(),
  testFramework: z.string().optional(),
}).refine(
  (data) => {
    if (data.generateTests && !data.testFramework) {
      return false;
    }
    return true;
  },
  {
    message: "Test framework is required when test generation is enabled",
    path: ["testFramework"],
  }
);

export type ProjectGenerationRequest = z.infer<typeof projectGenerationSchema>;
