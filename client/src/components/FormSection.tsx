interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function FormSection({ title, description, children, icon }: FormSectionProps) {
  return (
    <div className="bg-card border border-card-border rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary p-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}
