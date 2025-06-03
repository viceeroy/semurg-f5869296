
import { useState } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UploadFlowProps {
  onClose: () => void;
}

const UploadFlow = ({ onClose }: UploadFlowProps) => {
  const [currentStep, setCurrentStep] = useState<"upload" | "analyzing" | "result" | "publish">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  
  // Mock AI result data
  const [aiResult] = useState({
    speciesName: "American Robin",
    confidence: 94,
    facts: "The American Robin (Turdus migratorius) is a migratory bird found throughout North America. Known for their orange-red breast and melodious song, they're often considered a sign of spring.",
    habitat: "Gardens, parks, yards, and forests",
    diet: "Earthworms, insects, and berries"
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCurrentStep("analyzing");
        
        // Simulate AI processing
        setTimeout(() => {
          setCurrentStep("result");
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setCurrentStep("publish");
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {currentStep === "upload" && "Upload Photo"}
            {currentStep === "analyzing" && "Analyzing..."}
            {currentStep === "result" && "Species Identified!"}
            {currentStep === "publish" && "Publishing..."}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-nature-green/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-nature-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Take or Upload a Photo</h3>
                  <p className="text-gray-600 text-sm">Capture wildlife and let AI identify the species for you</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="photo-upload">
                    <Button className="w-full nature-gradient text-white" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose from Gallery
                      </span>
                    </Button>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button variant="outline" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {currentStep === "analyzing" && selectedImage && (
          <div className="p-6">
            <div className="text-center space-y-4">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-nature-green mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">Analyzing your photo...</h3>
                <p className="text-gray-600">Our AI is identifying the species</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Step */}
        {currentStep === "result" && selectedImage && (
          <div className="p-6 space-y-6">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="bg-nature-green/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{aiResult.speciesName}</h3>
                <span className="bg-nature-green text-white px-2 py-1 rounded-full text-xs font-medium">
                  {aiResult.confidence}% confident
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{aiResult.facts}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium text-gray-900">Habitat:</span>
                  <p className="text-gray-600">{aiResult.habitat}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Diet:</span>
                  <p className="text-gray-600">{aiResult.diet}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Add your notes (optional)
              </label>
              <Textarea
                placeholder="Share your experience or observations..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Save Draft
              </Button>
              <Button className="flex-1 nature-gradient text-white" onClick={handlePublish}>
                Publish
              </Button>
            </div>
          </div>
        )}

        {/* Publish Step */}
        {currentStep === "publish" && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-nature-green rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Publishing your discovery...</h3>
            <p className="text-gray-600">Sharing with the Semurg community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFlow;
