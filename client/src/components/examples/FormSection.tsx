import FormSection from '../FormSection';
import FormField from '../FormField';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

export default function FormSectionExample() {
  return (
    <div className="p-8 max-w-2xl">
      <FormSection 
        title="Project Configuration" 
        description="Enter your project name and upload Swagger specification"
        icon={<Settings className="w-6 h-6 text-primary-foreground" />}
      >
        <FormField label="Project Name" required>
          <Input placeholder="my-awesome-project" />
        </FormField>
      </FormSection>
    </div>
  );
}
