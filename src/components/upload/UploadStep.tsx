import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadStepProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadStep = ({ onImageUpload }: UploadStepProps) => {
  return (
    <div className="p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Wildlife</h3>
            <p className="text-gray-600 text-sm">Upload a photo and let AI identify the species</p>
          </div>
          <div className="space-y-3">
            <label htmlFor="photo-upload">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </span>
              </Button>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;