import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadFlowHeaderProps {
  currentStep: string;
  onClose: () => void;
}

const UploadFlowHeader = ({ currentStep, onClose }: UploadFlowHeaderProps) => {
  const getTitle = () => {
    switch (currentStep) {
      case "upload":
        return "Identify Wildlife";
      case "confirm":
        return "Ready to Identify";
      case "identifying":
        return "Analyzing...";
      case "results":
        return "Species Identified";
      case "failed":
        return "Identification Failed";
      case "publishing":
        return "Sharing Discovery...";
      default:
        return "Identify Wildlife";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default UploadFlowHeader;