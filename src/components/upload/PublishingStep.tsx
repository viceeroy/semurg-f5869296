import { Loader2 } from "lucide-react";

const PublishingStep = () => {
  return (
    <div className="p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Sharing your discovery...</h3>
      <p className="text-gray-600">Adding to the Semurg community</p>
    </div>
  );
};

export default PublishingStep;