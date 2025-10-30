import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { ProjectGenerator } from "./project-generator";
import { projectGenerationSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  const projectGenerator = new ProjectGenerator();

  app.post(
    "/api/generate-project",
    upload.single("swaggerFile"),
    async (req, res) => {
      try {
        const body = {
          projectName: req.body.projectName,
          language: req.body.language,
          framework: req.body.framework,
          database: req.body.database,
          generateTests: req.body.generateTests === "true",
          testFramework: req.body.testFramework,
        };

        const validatedData = projectGenerationSchema.parse(body);

        let swaggerContent: string | undefined;
        if (req.file) {
          swaggerContent = req.file.buffer.toString("utf-8");
        }

        await projectGenerator.generateProject(
          {
            ...validatedData,
            swaggerContent,
          },
          res
        );
      } catch (error) {
        console.error("Error generating project:", error);
        res.status(400).json({
          error: error instanceof Error ? error.message : "Failed to generate project",
        });
      }
    }
  );

  const httpServer = createServer(app);

  return httpServer;
}
