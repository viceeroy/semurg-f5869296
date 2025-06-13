import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmStepProps {
  selectedImage: string;
  onBackToUpload: () => void;
  onIdentifySpecies: () => void;
}

const ConfirmStep = ({ selectedImage, onBackToUpload, onIdentifySpecies }: ConfirmStepProps) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <img
          src={selectedImage}
          alt="Selected photo"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Ready to analyze this photo?</h3>
          <p className="text-gray-600 text-sm">AI will identify the wildlife species in your image</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1 w-full" 
          onClick={onBackToUpload}
        >
          Choose Different Photo
        </Button>
        <Button 
          className="flex-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
          onClick={onIdentifySpecies}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Identify Species
        </Button>
      </div>
    </div>
  );
};

export default ConfirmStep;