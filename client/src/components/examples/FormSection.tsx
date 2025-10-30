import FormSection from '../FormSection';
import FormField from '../FormField';
import { Input } from '@/components/ui/input';

export default function FormSectionExample() {
  return (
    <div className="p-8 max-w-2xl">
      <FormSection 
        title="Project Configuration" 
        description="Enter your project name and upload Swagger specification"
      >
        <FormField label="Project Name" required>
          <Input placeholder="my-awesome-project" />
        </FormField>
      </FormSection>
    </div>
  );
}
