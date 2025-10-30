import { useState } from "react";
import StepSidebar from "@/components/StepSidebar";
import FormSection from "@/components/FormSection";
import FormField from "@/components/FormField";
import FileUploadZone from "@/components/FileUploadZone";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Settings, Code, TestTube2, Sparkles } from "lucide-react";

const steps = [
  { id: 1, title: "Project Configuration", description: "Basic project details" },
  { id: 2, title: "Language & Framework", description: "Technology stack" },
  { id: 3, title: "Testing Setup", description: "Test configuration" },
];

const languageFrameworks = {
  java: ["Spring Boot", "Micronaut", "Quarkus"],
  nodejs: ["Express", "NestJS", "Fastify"],
  python: ["Flask", "Django", "FastAPI"],
};

const testFrameworks = {
  java: ["JUnit", "TestNG", "Spock"],
  nodejs: ["Mocha", "Jest", "Jasmine"],
  python: ["pytest", "unittest", "nose2"],
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [database, setDatabase] = useState("");
  const [generateTests, setGenerateTests] = useState(false);
  const [testFramework, setTestFramework] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setFramework("");
    setTestFramework("");
    setCurrentStep(2);
  };

  const handleFrameworkChange = (value: string) => {
    setFramework(value);
    setCurrentStep(3);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("projectName", projectName);
      formData.append("language", language);
      formData.append("framework", framework);
      formData.append("database", database);
      formData.append("generateTests", String(generateTests));
      
      if (generateTests && testFramework) {
        formData.append("testFramework", testFramework);
      }
      
      if (swaggerFile) {
        formData.append("swaggerFile", swaggerFile);
      }

      const response = await fetch("/api/generate-project", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate project");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Project generated and downloaded successfully!");
    } catch (error) {
      console.error("Error generating project:", error);
      alert(error instanceof Error ? error.message : "Failed to generate project");
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = projectName && language && framework && database && (!generateTests || testFramework);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <StepSidebar steps={steps} currentStep={currentStep} />
      </div>

      <div className="lg:hidden w-full border-b border-border bg-sidebar p-4">
        <h1 className="text-xl font-bold text-sidebar-foreground mb-4">Skeleton Code Generator</h1>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 h-2 rounded-full ${
                currentStep >= step.id ? "bg-primary" : "bg-sidebar-border"
              }`}
              data-testid={`progress-step-${step.id}`}
            />
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-12 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Project</h1>
            <p className="text-muted-foreground">Configure your project settings and generate a production-ready skeleton</p>
          </div>
          
          <FormSection
            title="Project Configuration"
            description="Enter your project name and upload Swagger specification"
            icon={<Settings className="w-6 h-6 text-primary-foreground" />}
          >
            <FormField label="Project Name" required>
              <Input
                placeholder="my-awesome-project"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value) setCurrentStep(Math.max(currentStep, 1));
                }}
                data-testid="input-project-name"
              />
            </FormField>

            <FormField label="Swagger YAML File">
              <FileUploadZone
                onFileSelect={setSwaggerFile}
                currentFile={swaggerFile}
              />
            </FormField>
          </FormSection>

          <FormSection
            title="Language & Framework"
            description="Select your programming language and framework"
            icon={<Code className="w-6 h-6 text-primary-foreground" />}
          >
            <FormField label="Programming Language" required>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger data-testid="select-language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="nodejs">Node.js</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            {language && (
              <FormField label="Framework" required>
                <Select value={framework} onValueChange={handleFrameworkChange}>
                  <SelectTrigger data-testid="select-framework">
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageFrameworks[language as keyof typeof languageFrameworks].map((fw) => (
                      <SelectItem key={fw} value={fw.toLowerCase().replace(/\s+/g, '-')}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}

            <FormField label="Database" required>
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger data-testid="select-database">
                  <SelectValue placeholder="Select a database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>

          <FormSection
            title="Testing Setup"
            description="Configure unit testing for your project"
            icon={<TestTube2 className="w-6 h-6 text-primary-foreground" />}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-tests"
                checked={generateTests}
                onCheckedChange={(checked) => setGenerateTests(checked as boolean)}
                data-testid="checkbox-generate-tests"
              />
              <label
                htmlFor="generate-tests"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Generate Unit Test Cases?
              </label>
            </div>

            {generateTests && language && (
              <FormField label="Test Framework" required>
                <Select value={testFramework} onValueChange={setTestFramework}>
                  <SelectTrigger data-testid="select-test-framework">
                    <SelectValue placeholder="Select a test framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {testFrameworks[language as keyof typeof testFrameworks].map((tf) => (
                      <SelectItem key={tf} value={tf.toLowerCase()}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </FormSection>

          <div className="pt-6">
            <Button
              size="lg"
              className="w-full text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
              disabled={!canGenerate || isGenerating}
              onClick={handleGenerate}
              data-testid="button-generate"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Project...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Project
                </>
              )}
            </Button>
            {canGenerate && !isGenerating && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Click to generate and download your project skeleton
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
