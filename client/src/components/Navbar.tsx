import { Code2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-sidebar border-b border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Skeleton Code Gen
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Placeholder for future navigation items */}
          </div>
        </div>
      </div>
    </nav>
  );
}
