import StepSidebar from '../StepSidebar';

const steps = [
  { id: 1, title: "Project Configuration", description: "Basic project details" },
  { id: 2, title: "Language & Framework", description: "Technology stack" },
  { id: 3, title: "Testing Setup", description: "Test configuration" },
];

export default function StepSidebarExample() {
  return <StepSidebar steps={steps} currentStep={2} />;
}
