import { Sparkles } from "lucide-react";

interface IdentifyingStepProps {
  selectedImage: string;
}

const IdentifyingStep = ({ selectedImage }: IdentifyingStepProps) => {
  return (
    <div className="p-6 text-center space-y-6">
      <img
        src={selectedImage}
        alt="Analyzing"
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="space-y-4">
        <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 animate-pulse text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI is analyzing your photo...</h3>
        <p className="text-gray-600">Identifying species and gathering information</p>
      </div>
    </div>
  );
};

export default IdentifyingStep;