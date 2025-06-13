import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FailedStepProps {
  onTryAgain: () => void;
}

const FailedStep = ({ onTryAgain }: FailedStepProps) => {
  return (
    <div className="min-h-[500px] flex flex-col">
      {/* Full screen error display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center space-y-6 max-w-sm">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-10 h-10 text-red-600" />
          </div>
          
          {/* Main Error Message */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Failed to identify species</h3>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Note:</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Take clear pictures of animals, birds, and plants. Upload again to Semurg for better identification results.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/70 rounded-lg p-4 text-left space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Tips for better results:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Ensure good lighting</li>
              <li>• Get close to the subject</li>
              <li>• Avoid blurry images</li>
              <li>• Include distinctive features</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Button */}
      <div className="p-6 bg-white border-t">
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3" 
          onClick={onTryAgain}
        >
          <Upload className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default FailedStep;