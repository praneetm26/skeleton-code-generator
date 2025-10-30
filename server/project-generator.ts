import fs from "fs";
import path from "path";
import archiver from "archiver";
import { randomUUID } from "crypto";
import type { Response } from "express";

interface ProjectConfig {
  projectName: string;
  language: string;
  framework: string;
  database: string;
  generateTests: boolean;
  testFramework?: string;
  swaggerContent?: string;
}

export class ProjectGenerator {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  private sanitizeProjectName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, "");
  }

  async generateProject(config: ProjectConfig, res: Response): Promise<void> {
    const sanitizedName = this.sanitizeProjectName(config.projectName);
    const uniqueId = randomUUID().substring(0, 8);
    const safeFolderName = `${sanitizedName}-${uniqueId}`;
    const projectPath = path.join(this.tempDir, safeFolderName);

    if (!projectPath.startsWith(this.tempDir)) {
      throw new Error("Invalid project path");
    }

    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    fs.mkdirSync(projectPath, { recursive: true });

    switch (config.language) {
      case "java":
        this.generateJavaProject(projectPath, config);
        break;
      case "nodejs":
        this.generateNodeProject(projectPath, config);
        break;
      case "python":
        this.generatePythonProject(projectPath, config);
        break;
    }

    await this.createZipFile(projectPath, config.projectName, res);

    fs.rmSync(projectPath, { recursive: true, force: true });
  }

  private generateJavaProject(projectPath: string, config: ProjectConfig): void {
    const srcPath = path.join(projectPath, "src", "main", "java", "com", "example");
    const testPath = path.join(projectPath, "src", "test", "java", "com", "example");
    
    fs.mkdirSync(srcPath, { recursive: true });
    if (config.generateTests) {
      fs.mkdirSync(testPath, { recursive: true });
    }

    const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>${config.projectName}</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <name>${config.projectName}</name>
    <description>Generated project skeleton</description>
    
    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <dependencies>
        ${config.framework === "spring-boot" ? `
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
            <version>3.2.0</version>
        </dependency>` : ""}
        ${this.getDatabaseDependency(config.database, "java")}
        ${config.generateTests ? `
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>` : ""}
    </dependencies>
</project>`;

    fs.writeFileSync(path.join(projectPath, "pom.xml"), pomXml);

    const appJava = `package com.example;

public class Application {
    public static void main(String[] args) {
        System.out.println("${config.projectName} is running!");
    }
}`;

    fs.writeFileSync(path.join(srcPath, "Application.java"), appJava);

    if (config.generateTests) {
      const testJava = `package com.example;

import org.junit.Test;
import static org.junit.Assert.*;

public class ApplicationTest {
    @Test
    public void testApplication() {
        assertTrue("Application test", true);
    }
}`;
      fs.writeFileSync(path.join(testPath, "ApplicationTest.java"), testJava);
    }

    this.generateReadme(projectPath, config);
  }

  private generateNodeProject(projectPath: string, config: ProjectConfig): void {
    const srcPath = path.join(projectPath, "src");
    const testPath = path.join(projectPath, "test");
    
    fs.mkdirSync(srcPath, { recursive: true });
    if (config.generateTests) {
      fs.mkdirSync(testPath, { recursive: true });
    }

    const packageJson = {
      name: config.projectName,
      version: "1.0.0",
      description: "Generated project skeleton",
      main: "src/app.js",
      scripts: {
        start: "node src/app.js",
        dev: "nodemon src/app.js",
        test: config.generateTests ? `${config.testFramework} test/**/*.test.js` : "echo 'No tests configured'"
      },
      dependencies: this.getNodeDependencies(config.framework, config.database),
      devDependencies: config.generateTests ? this.getNodeTestDependencies(config.testFramework!) : {}
    };

    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    let appJs = "";
    if (config.framework === "express") {
      appJs = `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${config.projectName}!' });
});

app.listen(port, () => {
  console.log(\`${config.projectName} is running on port \${port}\`);
});

module.exports = app;`;
    } else {
      appJs = `console.log('${config.projectName} is running!');

module.exports = {};`;
    }

    fs.writeFileSync(path.join(srcPath, "app.js"), appJs);

    if (config.generateTests) {
      const testJs = config.testFramework === "mocha" ? 
        `const assert = require('assert');
const app = require('../src/app');

describe('Application Tests', () => {
  it('should run basic test', () => {
    assert.strictEqual(1 + 1, 2);
  });
});` : 
        `const app = require('../src/app');

test('basic test', () => {
  expect(1 + 1).toBe(2);
});`;

      fs.writeFileSync(path.join(testPath, "app.test.js"), testJs);
    }

    this.generateReadme(projectPath, config);
  }

  private generatePythonProject(projectPath: string, config: ProjectConfig): void {
    const srcPath = path.join(projectPath, "src");
    const testPath = path.join(projectPath, "tests");
    
    fs.mkdirSync(srcPath, { recursive: true });
    if (config.generateTests) {
      fs.mkdirSync(testPath, { recursive: true });
    }

    const requirements = this.getPythonDependencies(config.framework, config.database);
    fs.writeFileSync(path.join(projectPath, "requirements.txt"), requirements);

    let appPy = "";
    if (config.framework === "flask") {
      appPy = `from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message='Welcome to ${config.projectName}!')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)`;
    } else if (config.framework === "django") {
      appPy = `# Django project
# Run: django-admin startproject ${config.projectName} .

print('${config.projectName} Django project skeleton')`;
    } else {
      appPy = `# FastAPI application
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to ${config.projectName}!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;
    }

    fs.writeFileSync(path.join(srcPath, "app.py"), appPy);

    if (config.generateTests) {
      const testPy = `import pytest

def test_basic():
    assert 1 + 1 == 2
    
def test_application():
    # Add your application tests here
    pass`;
      fs.writeFileSync(path.join(testPath, "test_app.py"), testPy);
      fs.writeFileSync(path.join(testPath, "__init__.py"), "");
    }

    fs.writeFileSync(path.join(srcPath, "__init__.py"), "");
    this.generateReadme(projectPath, config);
  }

  private getDatabaseDependency(database: string, language: string): string {
    if (language === "java") {
      switch (database) {
        case "postgresql":
          return `<dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.0</version>
        </dependency>`;
        case "mysql":
          return `<dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>`;
        case "mongodb":
          return `<dependency>
            <groupId>org.mongodb</groupId>
            <artifactId>mongodb-driver-sync</artifactId>
            <version>4.11.0</version>
        </dependency>`;
        default:
          return "";
      }
    }
    return "";
  }

  private getNodeDependencies(framework: string, database: string): Record<string, string> {
    const deps: Record<string, string> = {};
    
    if (framework === "express") {
      deps.express = "^4.18.2";
    } else if (framework === "nestjs") {
      deps["@nestjs/core"] = "^10.0.0";
      deps["@nestjs/common"] = "^10.0.0";
      deps["@nestjs/platform-express"] = "^10.0.0";
    } else if (framework === "fastify") {
      deps.fastify = "^4.24.0";
    }

    switch (database) {
      case "postgresql":
        deps.pg = "^8.11.0";
        break;
      case "mysql":
        deps.mysql2 = "^3.6.0";
        break;
      case "mongodb":
        deps.mongodb = "^6.1.0";
        break;
    }

    return deps;
  }

  private getNodeTestDependencies(testFramework: string): Record<string, string> {
    if (testFramework === "mocha") {
      return { mocha: "^10.2.0", chai: "^4.3.10" };
    } else if (testFramework === "jest") {
      return { jest: "^29.7.0" };
    } else if (testFramework === "jasmine") {
      return { jasmine: "^5.1.0" };
    }
    return {};
  }

  private getPythonDependencies(framework: string, database: string): string {
    const deps = [];
    
    if (framework === "flask") {
      deps.push("Flask==3.0.0");
    } else if (framework === "django") {
      deps.push("Django==4.2.0");
    } else if (framework === "fastapi") {
      deps.push("fastapi==0.104.0");
      deps.push("uvicorn==0.24.0");
    }

    switch (database) {
      case "postgresql":
        deps.push("psycopg2-binary==2.9.9");
        break;
      case "mysql":
        deps.push("mysql-connector-python==8.2.0");
        break;
      case "mongodb":
        deps.push("pymongo==4.6.0");
        break;
    }

    deps.push("pytest==7.4.3");
    return deps.join("\n");
  }

  private generateReadme(projectPath: string, config: ProjectConfig): void {
    const readme = `# ${config.projectName}

## Generated Project Skeleton

**Language:** ${config.language.toUpperCase()}  
**Framework:** ${config.framework}  
**Database:** ${config.database.toUpperCase()}  
**Testing:** ${config.generateTests ? `Enabled (${config.testFramework})` : "Disabled"}

## Getting Started

### Installation

${config.language === "java" ? "```bash\nmvn clean install\n```" : ""}
${config.language === "nodejs" ? "```bash\nnpm install\n```" : ""}
${config.language === "python" ? "```bash\npip install -r requirements.txt\n```" : ""}

### Running the Application

${config.language === "java" ? "```bash\nmvn spring-boot:run\n```" : ""}
${config.language === "nodejs" ? "```bash\nnpm start\n```" : ""}
${config.language === "python" ? "```bash\npython src/app.py\n```" : ""}

### Running Tests

${config.generateTests ? 
  config.language === "java" ? "```bash\nmvn test\n```" :
  config.language === "nodejs" ? "```bash\nnpm test\n```" :
  "```bash\npytest\n```" : 
  "Tests are not configured for this project."}

## Project Structure

\`\`\`
${config.projectName}/
├── src/              # Source code
${config.generateTests ? "├── test/             # Test files\n" : ""}├── README.md         # This file
${config.language === "java" ? "└── pom.xml          # Maven configuration" : ""}
${config.language === "nodejs" ? "└── package.json     # NPM configuration" : ""}
${config.language === "python" ? "└── requirements.txt # Python dependencies" : ""}
\`\`\`

## Next Steps

1. Configure your database connection
2. Add your business logic
3. Implement API endpoints
${config.swaggerContent ? "4. Review the uploaded Swagger specification\n" : ""}
Happy coding!
`;

    fs.writeFileSync(path.join(projectPath, "README.md"), readme);
  }

  private async createZipFile(
    sourcePath: string,
    projectName: string,
    res: Response
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const archive = archiver("zip", { zlib: { level: 9 } });

      res.attachment(`${projectName}.zip`);
      archive.pipe(res);

      archive.directory(sourcePath, false);

      archive.on("error", (err) => {
        reject(err);
      });

      archive.on("end", () => {
        resolve();
      });

      archive.finalize();
    });
  }
}
