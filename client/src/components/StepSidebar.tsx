import { Check } from "lucide-react";
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Skeleton Code Generator</h1>
        <p className="text-sm text-muted-foreground mt-2">Configure and generate your project</p>
      </div>
      
      <nav className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-md transition-all",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                !isActive && !isCompleted && "opacity-60"
              )}
              data-testid={`step-${step.id}`}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all",
                  isActive && "border-sidebar-primary-foreground bg-sidebar-primary-foreground text-sidebar-primary",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-sidebar-border bg-sidebar"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-sm",
                  isActive && "text-sidebar-primary-foreground",
                  !isActive && "text-sidebar-foreground"
                )}>
                  {step.title}
                </h3>
                <p className={cn(
                  "text-xs mt-1",
                  isActive && "text-sidebar-primary-foreground/80",
                  !isActive && "text-muted-foreground"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
