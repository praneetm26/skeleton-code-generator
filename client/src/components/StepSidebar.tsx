import { Check, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
}

export default function StepSidebar({ steps, currentStep }: StepSidebarProps) {
  return (
    <div className="w-full lg:w-72 bg-sidebar border-r border-sidebar-border p-6">
      <div className="mb-8 pb-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <Code2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Skeleton Code Gen</h1>
          </div>
        </div>
      </div>
      
      <nav className="space-y-3">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-md transition-all border-l-4",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground border-l-primary-foreground shadow-md",
                isCompleted && "border-l-primary bg-sidebar-accent",
                !isActive && !isCompleted && "opacity-50 border-l-transparent"
              )}
              data-testid={`step-${step.id}`}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all shadow-sm",
                  isActive && "border-primary-foreground bg-primary-foreground text-primary scale-110",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-sidebar-border bg-sidebar text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-bold text-sm",
                  isActive && "text-sidebar-primary-foreground",
                  isCompleted && "text-sidebar-foreground",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}>
                  {step.title}
                </h3>
                <p className={cn(
                  "text-xs mt-1",
                  isActive && "text-sidebar-primary-foreground/90",
                  !isActive && "text-muted-foreground"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-accent rounded-md border-l-4 border-l-primary">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Tip:</span> Upload a Swagger file to auto-generate API endpoints
        </p>
      </div>
    </div>
  );
}
